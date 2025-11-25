import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { THEMES, DEFAULT_MARKDOWN } from './constants';
import { ThemeId } from './types';
import { enhanceMarkdown, smartFormatMarkdown } from './services/geminiService';
import { formatMarkdown } from './services/formatService';
import { 
  Sparkles, 
  FileText,
  Loader2,
  Eraser,
  ChevronDown,
  Wand2,
  Download
} from 'lucide-react';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(ThemeId.DEFAULT);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isSmartFormatting, setIsSmartFormatting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const formatMenuRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

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

  const handleExportHtml = useCallback(() => {
    const previewElement = document.getElementById('print-container');
    if (!previewElement) return;

    // 获取渲染后的 HTML 内容
    const contentHtml = previewElement.innerHTML;

    // 构建完整的 HTML 文档
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MatNoble Editor Export</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          typography: (theme) => ({
            DEFAULT: {
              css: {
                color: theme('colors.slate.700'),
              },
            },
          }),
          fontFamily: {
            sans: ['"Noto Sans SC"', 'Inter', 'sans-serif'],
            mono: ['"Fira Code"', 'monospace'],
            serif: ['"Lora"', '"Noto Serif SC"', 'serif'],
          },
        },
      },
    }
  </script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <!-- KaTeX CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    /* Hide elements marked for export hiding */
    .export-hidden { display: none !important; }
    /* Ensure code blocks wrap correctly */
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body class="min-h-screen ${activeTheme.className} ${activeTheme.fontFamily} p-8 md:p-12">
  <div class="max-w-4xl mx-auto prose prose-lg ${activeTheme.proseClass}">
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml.trim()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'matnoble-editor-export.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeTheme]);

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300 print:h-auto print:w-auto print:overflow-visible">
      
      {/* Header / Toolbar */}
      <header className="h-16 flex-none bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-sm z-10 print:hidden">
        <div className="flex items-center space-x-2 mr-4">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white hidden lg:block">
            MatNoble <span className="text-blue-500">Editor</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 flex-1 justify-end md:justify-between">
          
          {/* Theme Selector (Scrollable) */}
          <div className="flex-1 overflow-x-auto max-w-[200px] md:max-w-xl mx-2 no-scrollbar">
             <div className="flex space-x-1 p-1">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all border ${
                    activeThemeId === theme.id
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-400'
                      : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-1 md:mx-2" />

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
                {isFormatting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eraser className="w-4 h-4" />
                )}
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

              {/* Dropdown Menu */}
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
                      {isSmartFormatting ? (
                         <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                         <Wand2 className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                      )}
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
          <Editor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Preview Pane */}
        <div className={`
          flex-1 h-full overflow-hidden relative
          ${!showMobilePreview ? 'hidden' : 'block'}
          md:block md:w-1/2
          print:block print:w-full print:h-auto print:overflow-visible
        `}>
           <Preview markdown={markdown} theme={activeTheme} />
           
           {/* Floating Theme info for preview context */}
           <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 text-[10px] text-gray-500 dark:text-gray-400 hidden md:block print:hidden">
             当前主题: {activeTheme.name}
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;