import React from 'react';
import { EditorProps } from '../types';

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full h-full resize-none p-6 bg-transparent text-sm md:text-base font-mono outline-none text-inherit placeholder-opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="# 在此开始输入 Markdown 内容..."
      spellCheck={false}
    />
  );
};