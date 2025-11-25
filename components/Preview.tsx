import React, { useState, useMemo, useCallback } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { PreviewProps } from '../types';
import { Copy, Check, Quote } from 'lucide-react';

interface PreviewWithScrollProps extends PreviewProps {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  previewRef?: React.Ref<HTMLDivElement>;
}

const PreviewComponent: React.FC<PreviewWithScrollProps> = ({
  markdown,
  theme,
  onScroll,
  previewRef: externalRef
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const internalRef = React.useRef<HTMLDivElement>(null);
  const previewRef = (externalRef as React.RefObject<HTMLDivElement>) || internalRef;

  const handleCopy = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const components = useMemo(() => ({
    h1: ({...props}) => <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--heading-color)] pb-4 mb-4 border-b border-b-[var(--hr-color)]" {...props} />,
    h2: ({...props}) => <h2 className="text-2xl font-bold tracking-tight text-[var(--heading-color)] mt-8 mb-4 pb-2" {...props} />,
    h3: ({...props}) => <h3 className="text-xl font-semibold tracking-tight text-[var(--heading-color)] mt-6 mb-3" {...props} />,
    h4: ({...props}) => <h4 className="text-lg font-medium text-[var(--heading-color)] mt-5 mb-2" {...props} />,
    p: ({children, ...props}) => {
      // Check if paragraph contains only KaTeX display math
      const hasOnlyDisplayMath = React.Children.count(children) === 1 &&
        React.isValidElement(children) &&
        (children.props.className?.includes('katex-display') ||
         children.props.className?.includes('katex math-display'));

      if (hasOnlyDisplayMath) {
        return <div className="flex justify-center my-6">{children}</div>;
      }

      return <p className="leading-7 text-justify mb-6 text-[var(--text-color)]" {...props}>{children}</p>;
    },
    li: ({...props}) => <li className="my-3 pl-2 leading-8 text-[var(--text-color)]" {...props} />,
    strong: ({...props}) => <strong className="font-bold text-[var(--bold-color)]" {...props} />,
    a: ({...props}) => <a className="font-medium underline underline-offset-4 decoration-[var(--link-color)] text-[var(--link-color)] hover:opacity-80 transition-opacity" {...props} />,
    hr: ({...props}) => <hr className="my-12 border-[var(--hr-color)]" {...props} />,
    blockquote: ({...props}) => (
      <blockquote 
        className="my-6 pl-6 pr-4 py-4 border-l-4 rounded-r-lg bg-[var(--quote-bg-color)] border-[var(--quote-border-color)] text-[var(--quote-text-color)]"
        {...props} 
      />
    ),
    img: ({...props}) => <img className="rounded-lg shadow-md border border-slate-200 dark:border-slate-700 mx-auto my-8 max-h-[500px] object-contain" {...props} />,
    table: ({...props}) => <div className="my-8 w-full overflow-y-auto rounded-lg border border-[var(--hr-color)] shadow-sm print:overflow-visible print:shadow-none"><table className="w-full text-sm text-left" {...props} /></div>,
    th: ({...props}) => <th className="border-b border-[var(--hr-color)] p-4 align-middle font-semibold text-[var(--heading-color)]" {...props} />,
    td: ({...props}) => <td className="border-b border-[var(--hr-color)] p-4 align-middle text-[var(--text-color)]" {...props} />,
    code(props) {
      const {children, className, ...rest} = props;
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && !String(children).includes('\n');
      const codeString = String(children).replace(/\n$/, '');
      const id = codeString + Math.random().toString(36).substring(7);

      if (isInline) {
        return <code {...rest} className="px-2 py-1 rounded-md bg-[var(--inline-code-bg-color)] text-[var(--inline-code-text-color)] text-sm font-mono">{children}</code>;
      }

      return (
        <div className="relative my-8 rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: 'var(--code-border)', backgroundColor: 'var(--code-bg)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--code-border)', backgroundColor: 'var(--code-header-bg)' }}>
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--code-header-text)' }}>{match ? match[1] : 'text'}</div>
            <button onClick={() => handleCopy(codeString, id)} className="transition-colors print:hidden export-hidden" style={{ color: 'var(--code-header-text)' }} title="复制代码">
              {copiedCode === id ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <code {...rest} className="!bg-transparent !p-0 font-mono text-sm leading-relaxed block min-w-full" style={{ color: 'var(--code-text)' }}>{children}</code>
          </div>
        </div>
      );
    }
  }), [theme, copiedCode, handleCopy]);

  return (
    <div
      ref={previewRef}
      className={`w-full h-full overflow-y-auto p-6 md:p-12 transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)] ${theme.className} ${theme.fontFamily}`}
      id="preview-scroll-container"
      onScroll={onScroll}
    >
      <div id="print-container" className="max-w-4xl mx-auto">
        <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html', throwOnError: false }]]} components={components}>
          {markdown}
        </Markdown>
      </div>
    </div>
  );
};

export const Preview = React.memo(React.forwardRef<HTMLDivElement, PreviewWithScrollProps>((props, ref) =>
  <PreviewComponent {...props} previewRef={ref} />
));