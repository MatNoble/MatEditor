import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
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
import themesCss from './src/themes.css?inline';

const App: React.FC = () => {
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
      alert("请先设置 API_KEY 环境变量以使用 AI 功能。");
      return;
    }
    
    setShowFormatMenu(false);
    setIsSmartFormatting(true);
    try {
      const formatted = await smartFormatMarkdown(markdown);
      setMarkdown(formatted);
    } catch (error) {
      console.error("Smart format error", error);
      alert("智能排版失败，请检查网络或稍后重试。");
    } finally {
      setIsSmartFormatting(false);
    }
  }, [markdown]);

  const handleEnhance = useCallback(async () => {
    if (!import.meta.env.VITE_API_KEY) {
      alert("请先设置 API_KEY 环境变量以使用 AI 功能。");
      return;
    }
    
    setIsEnhancing(true);
    try {
      const improved = await enhanceMarkdown(markdown);
      setMarkdown(improved);
    } catch (error) {
      alert("AI 润色失败，请稍后重试。");
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

          {/* Export HTML Action (Simplified) */}
          <button
            onClick={handleExportHtml}
            className="flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">导出 HTML</span>
          </button>
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

      {/* Footer */}
      <footer className={`flex-none print:hidden transition-all duration-500 ease-in-out ${isFooterCollapsed ? 'py-2' : 'py-8'}`}>
        <div className="max-w-sm mx-auto">
          {/* Toggle Button */}
          <button
            onClick={() => setIsFooterCollapsed(!isFooterCollapsed)}
            className="w-full flex items-center justify-center py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-2 group"
          >
            <span className="mr-2 opacity-70">
              {isFooterCollapsed ? '展开作者信息' : '收起'}
            </span>
            {isFooterCollapsed ? (
              <ChevronUp className="w-3 h-3 transform transition-transform group-hover:scale-110" />
            ) : (
              <ChevronDown className="w-3 h-3 transform transition-transform group-hover:scale-110" />
            )}
          </button>

          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFooterCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
            {/* Liquid glass container */}
            <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-slate-800/20 rounded-3xl border border-white/30 dark:border-white/15 shadow-2xl overflow-hidden glass-container hover-glow">
              {/* Multi-layer background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/8 to-pink-500/10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

              {/* Animated floating orbs */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-400/25 rounded-full blur-3xl float-orb"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-400/25 rounded-full blur-3xl float-orb" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl float-orb" style={{animationDelay: '2s'}}></div>

              {/* Dynamic light trail effect */}
              <div className="absolute inset-0 light-trail"></div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/20 hover:scale-110 transition-transform">
                    M
                  </div>
                  <span className="ml-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">MatNoble</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 opacity-90">
                  Mathematical elegance meets digital creativity
                </p>

                <div className="flex items-center justify-center space-x-4 text-xs">
                <a
                  href="https://blog.matnoble.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.3 2.7A2 2 0 003 4.5v11a2 2 0 002.3 2.2l11-2.5a2 2 0 001.7-2V4.8a2 2 0 00-1.7-2l-11-2z" clipRule="evenodd"/>
                  </svg>
                  <span>Blog</span>
                </a>

                <span className="text-slate-400 dark:text-slate-500">•</span>

                <span className="text-slate-600 dark:text-slate-300">数学思维研究社</span>

                <span className="text-slate-400 dark:text-slate-500">•</span>

                <a
                  href="https://github.com/MatNoble"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.169 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Animated shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
          </div>
        </div>
        </div>

        {/* CSS for enhanced liquid glass effects */}
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes float-orb {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.6;
            }
            25% {
              transform: translate(10px, -15px) scale(1.1);
              opacity: 0.8;
            }
            50% {
              transform: translate(-5px, -10px) scale(0.95);
              opacity: 0.7;
            }
            75% {
              transform: translate(-10px, 5px) scale(1.05);
              opacity: 0.9;
            }
          }

          @keyframes float-header-orb {
            0%, 100% {
              transform: translateY(-50%) translateX(0) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-50%) translateX(5px) scale(1.2);
              opacity: 0.5;
            }
          }

          @keyframes glow-pulse {
            0%, 100% {
              box-shadow:
                0 8px 32px rgba(31, 38, 135, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            }
            50% {
              box-shadow:
                0 12px 48px rgba(31, 38, 135, 0.25),
                0 0 20px rgba(59, 130, 246, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.2) inset;
            }
          }

          .shimmer {
            animation: shimmer 4s ease-in-out infinite;
          }

          .float-orb {
            animation: float-orb 6s ease-in-out infinite;
          }

          .float-header-orb {
            animation: float-header-orb 8s ease-in-out infinite;
          }

          .glass-container {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            backdrop-filter: blur(20px) saturate(1.8);
          }

          .glass-container:hover {
            transform: translateY(-4px) scale(1.02);
            animation: glow-pulse 2s ease-in-out infinite;
          }

          .glass-header {
            backdrop-filter: blur(16px) saturate(1.6);
            transition: all 0.3s ease;
          }

          .glass-header:hover {
            backdrop-filter: blur(20px) saturate(1.8);
          }

          .hover-glow {
            position: relative;
          }

          .hover-glow::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg,
              transparent 30%,
              rgba(59, 130, 246, 0.1) 50%,
              transparent 70%);
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
          }

          .hover-glow:hover::before {
            opacity: 1;
            animation: shimmer 2s ease-in-out infinite;
          }

          /* Enhanced light trail effect */
          .light-trail {
            background: radial-gradient(
              ellipse 80% 50% at 50% 120%,
              rgba(59, 130, 246, 0.05) 0%,
              transparent 50%
            );
            mix-blend-mode: screen;
          }

          /* Header shimmer effect */
          .glass-header::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.08) 50%,
              transparent 100%
            );
            transform: translateX(-100%);
            animation: header-shimmer 6s infinite;
          }

          @keyframes header-shimmer {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          /* Interactive ripple effect */
          .glass-container:active::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(255, 255, 255, 0.1) 0%,
              transparent 40%
            );
            border-radius: inherit;
            opacity: 0;
            animation: ripple 0.6s ease-out;
          }

          @keyframes ripple {
            0% {
              opacity: 1;
              transform: scale(0.8);
            }
            100% {
              opacity: 0;
              transform: scale(1.2);
            }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default App;