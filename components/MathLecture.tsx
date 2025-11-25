import React from 'react';

// Math Lecture specific components for theorem, definition, proof etc.
export const TheoremBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="theorem-box my-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
    <div className="font-bold text-blue-700 mb-2">定理</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

export const DefinitionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="definition-box my-6 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
    <div className="font-bold text-green-700 mb-2">定义</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

export const ProofBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="proof-box my-6 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
    <div className="font-bold text-purple-700 mb-2">证明</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

export const ExampleBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="example-box my-6 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
    <div className="font-bold text-orange-700 mb-2">例题</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

export const RemarkBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="remark-box my-6 p-4 border-l-4 border-gray-500 bg-gray-50 rounded-r-lg">
    <div className="font-bold text-gray-700 mb-2">注记</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

// Custom math styling for lecture notes
export const MathLectureStyles = () => (
  <style>{`
    /* Math Lecture specific styles */
    .theorem-box {
      border-left: 4px solid #0066cc;
      background-color: #f8f9ff;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .definition-box {
      border-left: 4px solid #28a745;
      background-color: #f8fff8;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .proof-box {
      border-left: 4px solid #6f42c1;
      background-color: #faf8ff;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .example-box {
      border-left: 4px solid #fd7e14;
      background-color: #fff8f0;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .remark-box {
      border-left: 4px solid #6c757d;
      background-color: #f8f9fa;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Print styles for lecture boxes */
    @media print {
      .theorem-box,
      .definition-box,
      .proof-box,
      .example-box,
      .remark-box {
        page-break-inside: avoid;
        background-color: transparent !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
      }

      .theorem-box { border-left: 3px solid #000 !important; }
      .definition-box { border-left: 3px solid #000 !important; }
      .proof-box { border-left: 3px solid #000 !important; }
      .example-box { border-left: 3px solid #000 !important; }
      .remark-box { border-left: 3px solid #000 !important; }

      .theorem-box > div:first-child { color: #000 !important; }
      .definition-box > div:first-child { color: #000 !important; }
      .proof-box > div:first-child { color: #000 !important; }
      .example-box > div:first-child { color: #000 !important; }
      .remark-box > div:first-child { color: #000 !important; }
    }

    /* Enhanced math styling */
    .katex-display {
      background-color: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin: 1.5em auto;
      max-width: fit-content;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    @media print {
      .katex-display {
        background-color: transparent !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
      }
    }

    /* Numbered equations styling */
    .equation-number {
      text-align: right;
      font-style: italic;
      color: #666;
      margin-top: -0.5em;
      margin-bottom: 1.5em;
    }

    /* Enhanced list styling for math content */
    .theme-academic ol li::marker {
      font-weight: bold;
      color: var(--heading-color);
    }

    /* Section numbering */
    .theme-academic h2::before {
      content: counter(h2-counter) ". ";
      counter-increment: h2-counter;
      font-weight: bold;
      color: var(--heading-color);
    }

    .theme-academic h3::before {
      content: counter(h2-counter) "." counter(h3-counter) " ";
      counter-increment: h3-counter;
      font-weight: bold;
      color: var(--heading-color);
    }

    body {
      counter-reset: h2-counter h3-counter;
    }

    /* Page header/footer styling for print */
    @media print {
      @page {
        margin: 1in;
        @top-center {
          content: "数学讲义";
          font-size: 10pt;
        }
        @bottom-center {
          content: "第 " counter(page) " 页";
          font-size: 10pt;
        }
      }
    }
  `}</style>
);