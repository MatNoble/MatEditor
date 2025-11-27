import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useToast } from './components/Toast';
import { ShareButton } from './components/ShareButton';
import { Footer } from './components/Footer';
import { THEMES } from './constants';
import { ThemeId } from './types';
import { enhanceMarkdown, smartFormatMarkdown } from './services/geminiService';
import { formatMarkdown } from './services/formatService';
import {
  Sparkles,
  FileText,
  Loader2,
  Eraser,
  ChevronDown,
  ChevronUp,
  Wand2,
  Download,
  Brush, // Import Brush icon
} from 'lucide-react';
import tailwindCss from './index.css?inline';
import katexCss from 'katex/dist/katex.min.css?inline';
import themesCss from './themes.css?inline';

const App: React.FC = () => {
  const { showToast } = useToast();
  const [markdown, setMarkdown] = useState<string>('');
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(ThemeId.DEFAULT);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isSmartFormatting, setIsSmartFormatting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const formatMenuRef = useRef<HTMLDivElement>(null);

  const [showCustomCssEditor, setShowCustomCssEditor] = useState(false); // State for custom CSS editor visibility
  const [customCss, setCustomCss] = useState(''); // State for custom CSS content
  const customCssTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);

  // Refs for scroll sync
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

  // Sync scroll handlers
  const handleEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!previewRef.current || !editorRef.current) return;

    const editor = e.target as HTMLTextAreaElement;
    const preview = previewRef.current;

    // Calculate scroll ratios
    const editorRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    const previewScrollTop = editorRatio * (preview.scrollHeight - preview.clientHeight);

    // Update preview scroll position
    preview.scrollTop = previewScrollTop;
  }, []);

  const handlePreviewScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!editorRef.current || !previewRef.current) return;

    const preview = e.target as HTMLDivElement;
    const editor = editorRef.current;

    // Calculate scroll ratios
    const previewRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    const editorScrollTop = previewRatio * (editor.scrollHeight - editor.clientHeight);

    // Update editor scroll position
    editor.scrollTop = editorScrollTop;
  }, []);

  // Fetch default markdown on mount
  useEffect(() => {
    fetch('/DEFAULT_MARKDOWN.md')
      .then(res => res.text())
      .then(text => setMarkdown(text))
      .catch(err => console.error("Failed to load default markdown:", err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
        setShowFormatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to inject custom CSS into the document head
  useEffect(() => {
    if (activeThemeId === ThemeId.CUSTOM) {
      let styleElement = document.getElementById('custom-theme-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-styles';
        document.head.appendChild(styleElement);
      }
      styleElement.innerHTML = customCss;
    } else {
      const styleElement = document.getElementById('custom-theme-styles');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    }
  }, [activeThemeId, customCss]);



  const handleExportHtml = useCallback(async () => {
    const previewElement = document.getElementById('print-container');
    if (!previewElement) return;

    const contentHtml = previewElement.innerHTML;

    // Extract the first heading from the preview content
    const extractFirstHeading = (html: string): string => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
      return heading ? heading.textContent || '' : '';
    };

    const documentTitle = extractFirstHeading(contentHtml) || 'MatNoble Editor Export';
    const sanitizedName = documentTitle
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim() || 'matnoble-editor-export';

    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${documentTitle}</title>
  <style>
    /* Inlined Tailwind CSS */
    ${tailwindCss}
    /* Inlined KaTeX CSS */
    ${katexCss}
    /* Inlined Theme CSS */
    ${themesCss}
    /* Inlined Custom CSS (if active theme is custom) */
    ${activeThemeId === ThemeId.CUSTOM ? customCss : ''}
    /* Hide elements marked for export hiding */
    .export-hidden { display: none !important; }
    /* Ensure code blocks wrap correctly */
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body class="min-h-screen ${activeTheme.className} ${activeTheme.fontFamily} p-8 md:p-12">
  <div class="max-w-4xl mx-auto">
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml.trim()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeTheme, customCss, activeThemeId]);

  const handleFormat = useCallback(async () => {
    setIsFormatting(true);
    try {
      const formatted = await formatMarkdown(markdown);
      setMarkdown(formatted);
    } catch (error) {
      console.error("Format error", error);
    } finally {
      setIsFormatting(false);
    }
  }, [markdown]);

  const handleSmartFormat = useCallback(async () => {
    if (!import.meta.env.VITE_API_KEY) {
      showToast("请先设置 API_KEY 环境变量以使用 AI 功能", "error");
      return;
    }
    
    setShowFormatMenu(false);
    setIsSmartFormatting(true);
    try {
      const formatted = await smartFormatMarkdown(markdown);
      setMarkdown(formatted);
    } catch (error) {
      showToast("智能排版失败，请检查网络或稍后重试", "error");
    } finally {
      setIsSmartFormatting(false);
    }
  }, [markdown]);

  const handleEnhance = useCallback(async () => {
    if (!import.meta.env.VITE_API_KEY) {
      showToast("该功能正在紧急开发中", "error");
      // showToast("请先设置 API_KEY 环境变量以使用 AI 功能", "error");
      return;
    }
    
    setIsEnhancing(true);
    try {
      const improved = await enhanceMarkdown(markdown);
      setMarkdown(improved);
    } catch (error) {
      showToast("AI 润色失败，请稍后重试", "error");
    } finally {
      setIsEnhancing(false);
    }
  }, [markdown]);

  const handleSaveCustomCss = () => {
    if (customCssTextAreaRef.current) {
      setCustomCss(customCssTextAreaRef.current.value);
    }
    setShowCustomCssEditor(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300 print:h-auto print:w-auto print:overflow-visible">
      
      {/* Header / Toolbar */}
      <header className="h-16 flex-none relative overflow-hidden z-10 print:hidden glass-header">
        {/* Glass morphism background effects */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/40 dark:bg-slate-800/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/15"></div>

        {/* Floating light orbs */}
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl float-header-orb"></div>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl float-header-orb" style={{animationDelay: '2s'}}></div>

        {/* Content container */}
        <div className="relative h-full border-b border-white/30 dark:border-white/15 flex items-center justify-between px-4">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center space-x-2 mr-4">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white hidden lg:block">
            MatNoble <span className="text-blue-500">Editor</span>
          </h1>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Selector (Dropdown) */}
          <div className="relative flex items-center">
            <label htmlFor="theme-select" className="sr-only">主题</label> {/* Screen reader only label */}
            <select
              id="theme-select"
              value={activeThemeId}
              onChange={(e) => setActiveThemeId(e.target.value as ThemeId)}
              className="appearance-none block w-auto pl-3 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg text-slate-700 dark:text-white shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              {THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
          </div>

          {/* Custom Theme Button */}
          {activeThemeId === ThemeId.CUSTOM && (
            <button
              onClick={() => setShowCustomCssEditor(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
              title="编辑自定义样式"
            >
              <Brush className="w-4 h-4" />
              <span className="hidden md:inline">自定义 CSS</span>
            </button>
          )}

          <div className="h-6 w-px bg-gray-300 dark:bg-slate-600" />

          {/* Format Group Button */}
          {/* Format Group Button */}
          {/*
          <div className="relative flex items-center" ref={formatMenuRef}>
            <button
              onClick={handleFormat}
              disabled={isFormatting || isSmartFormatting}
              title="标准格式化 (Prettier)"
              className={`flex items-center space-x-2 px-3 py-1.5 md:pl-4 md:pr-2 rounded-l-lg border-r-0 text-sm font-medium transition-all ${
                isFormatting || isSmartFormatting
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
              }`}
            >
              {isFormatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
              <span className="hidden md:inline">格式化</span>
            </button>
            <button
              onClick={() => setShowFormatMenu(!showFormatMenu)}
              disabled={isFormatting || isSmartFormatting}
              className={`px-1.5 py-1.5 rounded-r-lg border-l border-slate-300 text-sm font-medium transition-all ${
                 isFormatting || isSmartFormatting
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:border-l-slate-500'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFormatMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1">
                  <button
                    onClick={() => { setShowFormatMenu(false); handleFormat(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <Eraser className="w-4 h-4 text-slate-400" />
                    <span>标准格式化</span>
                  </button>
                  <button
                    onClick={handleSmartFormat}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center space-x-2 group"
                  >
                    {isSmartFormatting ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Wand2 className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />}
                    <div>
                      <span className="block font-medium text-blue-600 dark:text-blue-400">AI 智能排版</span>
                      <span className="text-[10px] text-gray-400 leading-tight">优化中西文空格与标点</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          */}

          {/* AI Enhance Action */}
          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className={`flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all ${
              isEnhancing 
                ? 'bg-purple-100 text-purple-400 cursor-not-allowed' 
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 hover:border-purple-300'
            }`}
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden md:inline">润色中</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">AI 润色</span>
              </>
            )}
          </button>

          {/* Export HTML Button */}
          <button
            onClick={handleExportHtml}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            title="导出为 HTML"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">导出 HTML</span>
          </button>

          {/* Share Button */}
          <ShareButton />
        </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 print:hidden">
        <button
          onClick={() => setShowMobilePreview(false)}
          className={`flex-1 py-3 text-sm font-medium ${!showMobilePreview ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          编辑器
        </button>
        <button
          onClick={() => setShowMobilePreview(true)}
          className={`flex-1 py-3 text-sm font-medium ${showMobilePreview ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          预览
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative print:overflow-visible print:block print:h-auto">
        
        {/* Editor Pane */}
        <div className={`
          flex-1 h-full overflow-hidden bg-white dark:bg-slate-800 
          ${showMobilePreview ? 'hidden' : 'block'} 
          md:block md:w-1/2 md:border-r border-gray-200 dark:border-slate-700
          print:hidden
        `}>
          <Editor ref={editorRef} value={markdown} onChange={setMarkdown} onScroll={handleEditorScroll} />
        </div>

        {/* Preview Pane */}
        <div className={`
          flex-1 h-full overflow-hidden relative
          ${!showMobilePreview ? 'hidden' : 'block'}
          md:block md:w-1/2
          print:block print:w-full print:h-auto print:overflow-visible
        `}>
           <Preview ref={previewRef} markdown={markdown} theme={activeTheme} onScroll={handlePreviewScroll} />
           
           {/* Floating Theme info for preview context */}
           <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 text-[10px] text-gray-500 dark:text-gray-400 hidden md:block print:hidden">
             当前主题: {activeTheme.name}
           </div>
        </div>

      </main>

      {/* Custom CSS Editor Modal */}
      {showCustomCssEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 flex flex-col h-2/3">
            <header className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">自定义主题样式 (CSS)</h2>
              <button onClick={() => setShowCustomCssEditor(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">&times;</button>
            </header>
            <main className="flex-1 p-4 overflow-hidden">
              <textarea
                ref={customCssTextAreaRef}
                defaultValue={customCss}
                className="w-full h-full p-2 border rounded-md font-mono text-sm bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/* 在这里输入你的 CSS 代码 */&#10;.markdown-body h1 {&#10;  color: blue;&#10;}"
              />
            </main>
            <footer className="flex justify-end p-4 border-t dark:border-slate-700 space-x-4">
              <button onClick={() => setShowCustomCssEditor(false)} className="px-4 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500">取消</button>
              <button onClick={handleSaveCustomCss} className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700">保存</button>
            </footer>
          </div>
        </div>
      )}

      {/* Footer - New Component */}
      <Footer />
    </div>
  );
};

export default App;