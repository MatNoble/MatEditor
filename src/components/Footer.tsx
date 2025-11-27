import React from 'react';
import { Github, BookOpen, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand & Description */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 MatNoble Editor · 智能 Markdown 编辑器 · 支持 AI 润色 · LaTeX 公式 · 实时预览 · 精美主题 · 一键导出
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            {/* Blog Link */}
            <a
              href="https://blog.matnoble.top?utm_source=editor&utm_medium=footer&utm_campaign=traffic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="访问 MatNoble 博客"
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">博客</span>
            </a>

            {/* WeChat QR Code (Hover to show) */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                title="微信公众号"
              >
                <MessageCircle size={18} />
                <span className="hidden sm:inline">公众号</span>
              </button>
              
              {/* QR Code Popup */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center whitespace-nowrap">
                    数学思维研究社
                  </p>
                  {/* Replace with your actual WeChat QR code */}
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <img 
                      src="/qrcode_for_wechat.jpg" 
                      alt="WeChat QR Code"
                      className="w-full h-full rounded"
                    />
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-8 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/MatNoble/MatEditor?utm_source=editor&utm_medium=footer&utm_campaign=traffic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="GitHub 仓库"
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
