import { Theme, ThemeId } from './types';

export const DEFAULT_MARKDOWN = `# 欢迎使用 MatNoble Editor

这是一个功能强大的 **Markdown** 编辑器，内置 **AI 智能** 辅助功能。

## 🚀 主要功能

- 🎨 **多款主题**：支持 GitHub、Dracula、学术论文等多种风格。
- 🧮 **数学公式**：完美渲染 LaTeX 数学公式。
- 🤖 **AI 润色**：利用 Gemini 优化您的写作。
- 📄 **HTML 导出**：支持导出为独立 HTML 文件。

## 🧮 数学公式示例

行内公式：$E = mc^2$

块级公式：

$$
\\frac{1}{\\sigma\\sqrt{2\\pi}} \\int_{-\\infty}^{+\\infty} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2} dx = 1
$$

## 💻 代码示例

\`\`\`typescript
interface User {
  id: number;
  name: string;
}

const greet = (user: User): string => {
  return \`你好, \${user.name}! 欢迎来到 MatNoble Editor。\`;
};
\`\`\`

> "简约是复杂的最终形式。" — 达·芬奇
`;

export const THEMES: Theme[] = [
  {
    id: ThemeId.DEFAULT,
    name: '经典白',
    className: 'bg-white text-slate-700',
    fontFamily: 'font-sans',
    proseClass: `
      prose-slate 
      prose-p:tracking-wide prose-p:leading-loose prose-p:text-justify
      prose-headings:text-slate-800 prose-headings:tracking-tight
      prose-h4:text-slate-900
      prose-li:text-slate-600 prose-li:tracking-wide prose-li:my-1
      marker:text-blue-500
    `,
    codeBlockBackground: '#1e1e1e',
    codeBlockTextColor: '#e4e4e7',
    windowHeaderColor: '#2d2d2d',
    windowBorderColor: 'rgba(0,0,0,0.1)',
    showWindowControls: true,
    boldColor: '#2563eb', // Blue-600
  },
  {
    id: ThemeId.GITHUB_LIGHT,
    name: 'GitHub',
    className: 'bg-white text-[#24292f]',
    fontFamily: 'font-sans',
    proseClass: `
      prose-zinc
      prose-p:leading-8 prose-p:tracking-wide
      prose-headings:text-[#24292f] prose-headings:font-semibold
      prose-p:text-[#24292f]
      prose-a:text-[#0969da] prose-a:no-underline hover:prose-a:underline
      prose-pre:bg-[#f6f8fa] prose-pre:text-[#24292f]
      prose-blockquote:border-l-[4px] prose-blockquote:border-[#d0d7de] prose-blockquote:text-[#57606a] prose-blockquote:not-italic
      prose-table:text-[#24292f]
      prose-th:border-[#d0d7de] prose-td:border-[#d0d7de]
    `,
    codeBlockBackground: '#f6f8fa',
    codeBlockTextColor: '#24292f',
    windowHeaderColor: '#f6f8fa',
    windowBorderColor: '#d0d7de',
    showWindowControls: true,
    boldColor: '#2563eb', // Blue-600 (Requested override, normally #d73a49)
  },
  {
    id: ThemeId.ACADEMIC,
    name: '学术论文',
    className: 'bg-white text-black',
    fontFamily: 'font-serif',
    proseClass: `
      prose-neutral
      max-w-none
      prose-p:indent-8 prose-p:leading-8 prose-p:text-justify prose-p:tracking-wide
      prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:border-b prose-h1:border-black prose-h1:pb-2
      prose-h4:font-bold prose-h4:underline prose-h4:decoration-1 prose-h4:underline-offset-4
      prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic
      prose-img:rounded-none prose-img:shadow-none prose-img:border prose-img:border-gray-200
    `,
    codeBlockBackground: '#f5f5f5',
    codeBlockTextColor: '#333',
    windowHeaderColor: '#e5e5e5',
    windowBorderColor: '#ccc',
    showWindowControls: false,
    boldColor: '#2563eb', // Blue-600
  },
  {
    id: ThemeId.DRACULA,
    name: 'Dracula',
    className: 'bg-[#282a36] text-[#f8f8f2]',
    fontFamily: 'font-sans',
    proseClass: `
      prose-invert
      prose-p:leading-loose prose-p:tracking-wide
      prose-headings:text-[#bd93f9]
      prose-a:text-[#8be9fd]
      prose-code:text-[#ff79c6]
      prose-blockquote:border-[#6272a4] prose-blockquote:bg-[#282a36]
    `,
    codeBlockBackground: '#44475a',
    codeBlockTextColor: '#f8f8f2',
    windowHeaderColor: '#6272a4',
    windowBorderColor: '#6272a4',
    showWindowControls: true,
    boldColor: '#ff79c6', // Keep Pink for Dracula (Blue is bad on dark gray)
  },
  {
    id: ThemeId.SOLARIZED,
    name: 'Solarized',
    className: 'bg-[#fdf6e3] text-[#657b83]',
    fontFamily: 'font-sans',
    proseClass: `
      prose-stone
      prose-p:leading-loose prose-p:tracking-wide
      prose-headings:text-[#b58900]
      prose-p:text-[#657b83]
      prose-a:text-[#268bd2]
      prose-blockquote:border-l-[#b58900] prose-blockquote:text-[#586e75]
    `,
    codeBlockBackground: '#eee8d5',
    codeBlockTextColor: '#586e75',
    windowHeaderColor: '#e0d8c0',
    windowBorderColor: '#d6ceb8',
    showWindowControls: true,
    boldColor: '#2563eb', // Blue
  },
  {
    id: ThemeId.CYBERPUNK,
    name: 'Cyberpunk',
    className: 'bg-black text-[#00ff41]',
    fontFamily: 'font-mono',
    proseClass: `
      prose-invert
      prose-p:leading-8 prose-p:tracking-wider
      prose-headings:text-[#ff00ff] prose-headings:font-bold prose-headings:uppercase
      prose-p:text-[#00ff41]
      prose-a:text-[#00ffff] prose-a:underline decoration-wavy
      prose-blockquote:border-l-[#ff0099] prose-blockquote:bg-black prose-blockquote:text-[#00ff41]
      prose-hr:border-[#00ff41]
    `,
    codeBlockBackground: '#1a1a1a',
    codeBlockTextColor: '#00ff41',
    windowHeaderColor: '#333',
    windowBorderColor: '#00ff41',
    showWindowControls: false,
    boldColor: '#ffff00', // Yellow
  },
];