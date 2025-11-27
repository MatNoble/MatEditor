import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  url = window.location.href,
  title = 'MatNoble Editor - 智能 Markdown 编辑器'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: '极简设计，功能强大。支持 AI 润色、LaTeX 公式渲染与多种精美主题。',
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      setShowModal(true);
    }
  };

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
        title="分享此页面"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">分享</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              分享 MatNoble Editor
            </h3>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                微信扫码分享
              </p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48 rounded-lg shadow-md"
              />
            </div>

            {/* Copy Link */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                或复制链接分享
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      <span className="hidden sm:inline">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span className="hidden sm:inline">复制</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Buttons (Optional) */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                分享到社交平台
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-[#4267B2] hover:bg-[#365899] text-white rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
