import React, { forwardRef } from 'react';
import { EditorProps } from '../types';

interface EditorWithScrollProps extends EditorProps {
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorWithScrollProps>(({
  value,
  onChange,
  onScroll
}, ref) => {
  return (
    <textarea
      ref={ref}
      className="w-full h-full resize-none p-6 bg-transparent text-sm md:text-base font-mono outline-none text-inherit placeholder-opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onScroll={onScroll}
      placeholder="# 在此开始输入 Markdown 内容..."
      spellCheck={false}
    />
  );
});