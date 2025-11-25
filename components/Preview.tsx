import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { PreviewProps, ThemeId } from '../types';
import { Copy, Check } from 'lucide-react';

export const Preview: React.FC<PreviewProps> = ({ markdown, theme }) => {
  // Helper to handle copy code
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 动态判断是否需要左侧边框装饰 (GitHub和Academic主题可能不需要太花哨的背景)
  const isMinimalTheme = theme.id === ThemeId.ACADEMIC || theme.id === ThemeId.CYBERPUNK;

  return (
    <div 
      className={`w-full h-full overflow-y-auto p-6 md:p-12 transition-colors duration-300 ${theme.className} ${theme.fontFamily} print:overflow-visible print:h-auto print:min-h-screen print:w-full print:p-12 print:m-0`}
      id="preview-scroll-container"
    >
      {/* Wrapper specifically for printing content */}
      <div id="print-container" className={`max-w-4xl mx-auto prose prose-lg ${theme.proseClass} print:!max-w-none`}>
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[[rehypeKatex, { output: 'html', throwOnError: false }]]}
          components={{
            // --- H1 ---
            h1: ({node, ...props}) => (
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 pb-4 border-b border-inherit opacity-90 leading-tight" {...props} />
            ),
            
            // --- H2 ---
            h2: ({node, ...props}) => (
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight first:mt-0 mt-12 pb-2 border-b border-inherit opacity-90 leading-snug" {...props} />
            ),

            // --- H3: 左侧装饰线风格 ---
            h3: ({node, ...props}) => (
              <h3 
                className={`scroll-m-20 text-2xl font-semibold tracking-tight mt-10 mb-4 flex items-center ${
                  !isMinimalTheme ? 'border-l-4 border-current pl-3 bg-gray-100/50 dark:bg-white/5 py-1 rounded-r-lg' : ''
                }`} 
                {...props} 
              />
            ),

            // --- H4: 更细腻的小标题风格 ---
            h4: ({node, ...props}) => (
              <h4 
                className={`scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4 ${
                  !isMinimalTheme ? 'flex items-center border-l-[3px] border-opacity-70 border-current pl-3' : 'underline decoration-dotted underline-offset-4'
                }`} 
                {...props} 
              />
            ),
            
            // --- Paragraph: 增加两端对齐和阅读舒适度 ---
            p: ({node, ...props}) => (
               <p className="leading-8 tracking-wide text-justify mb-6 opacity-90" {...props} />
            ),

            // --- List Items: 增加间距 ---
            li: ({node, ...props}) => (
              <li className="my-2 pl-1 leading-8 tracking-wide" {...props} />
            ),

            // --- Strong: Apply Color via Inline Style ---
            strong: ({node, ...props}) => (
              <strong 
                className="font-bold opacity-100" 
                style={{ color: theme.boldColor || 'inherit' }}
                {...props} 
              />
            ),
            
            // --- Links ---
            a: ({node, ...props}) => (
              <a className="font-medium underline underline-offset-4 decoration-current opacity-80 hover:opacity-100 transition-all" {...props} />
            ),
            
            // --- Blockquote ---
            blockquote: ({node, ...props}) => (
              <blockquote className="mt-6 border-l-4 pl-6 italic py-2 opacity-80" {...props} />
            ),

            // --- Image ---
            img: ({node, ...props}) => (
              <img className="rounded-xl shadow-lg border border-transparent mx-auto my-8 hover:shadow-xl transition-shadow duration-300 print:shadow-none max-h-[500px] object-contain" {...props} />
            ),

            // --- Table ---
            table: ({node, ...props}) => (
              <div className="my-8 w-full overflow-y-auto rounded-lg border border-inherit shadow-sm print:overflow-visible print:shadow-none">
                <table className="w-full text-sm text-left" {...props} />
              </div>
            ),
            
            th: ({node, ...props}) => (
               <th className="border-b border-inherit p-4 align-middle font-medium opacity-90" {...props} />
            ),
            
            td: ({node, ...props}) => (
               <td className="border-b border-inherit p-4 align-middle opacity-80" {...props} />
            ),

            // --- Code Block ---
            code(props) {
              const {children, className, node, ...rest} = props;
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !String(children).includes('\n');
              const codeString = String(children).replace(/\n$/, '');
              const id = Math.random().toString(36).substring(7);

              // Inline code style
              if (isInline) {
                return (
                   <code {...rest} className="px-[0.3rem] py-[0.1rem] rounded bg-gray-200/50 dark:bg-white/10 font-mono text-sm border border-black/5 dark:border-white/10 print:border-current mx-1 text-red-500 dark:text-red-400">
                    {children}
                  </code>
                );
              }

              // Block code
              return (
                <div 
                  className="relative my-8 rounded-xl overflow-hidden shadow-lg border transition-colors duration-300 group print:break-inside-avoid print:shadow-none"
                  style={{ 
                    backgroundColor: theme.codeBlockBackground, 
                    borderColor: theme.windowBorderColor 
                  }}
                >
                  {/* Window Header */}
                  <div 
                    className="flex items-center justify-between px-4 py-2 border-b transition-colors duration-300 code-block-header"
                    style={{ 
                      backgroundColor: theme.windowHeaderColor,
                      borderColor: theme.windowBorderColor
                    }}
                  >
                    <div className="flex space-x-2">
                      {theme.showWindowControls && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm" />
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm" />
                        </>
                      )}
                    </div>
                    
                    <div 
                      className="text-xs font-mono uppercase tracking-wider opacity-60"
                      style={{ color: theme.codeBlockTextColor }}
                    >
                      {match ? match[1] : 'text'}
                    </div>
                    
                    <button 
                      onClick={() => handleCopy(codeString, id)}
                      className="hover:opacity-100 opacity-60 transition-opacity print:hidden export-hidden"
                      style={{ color: theme.codeBlockTextColor }}
                      title="复制代码"
                    >
                      {copiedCode === id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  {/* Code Area */}
                  <div className="p-4 overflow-x-auto">
                    <code 
                      {...rest} 
                      className={`!bg-transparent !p-0 font-mono text-sm leading-relaxed block min-w-full`}
                      style={{ color: theme.codeBlockTextColor }}
                    >
                       {children}
                    </code>
                  </div>
                </div>
              );
            }
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </div>
  );
};