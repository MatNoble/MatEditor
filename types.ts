export enum ThemeId {
  DEFAULT = 'default',
  GITHUB_LIGHT = 'github-light',
  DRACULA = 'dracula',
  SOLARIZED = 'solarized',
  ACADEMIC = 'academic',
  CYBERPUNK = 'cyberpunk'
}

export interface Theme {
  id: ThemeId;
  name: string;
  className: string; // Container background/text
  proseClass: string; // Typography plugin overrides or custom CSS mapping
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  
  // Code block specific styling
  codeBlockBackground: string;
  codeBlockTextColor: string;
  windowHeaderColor: string;
  windowBorderColor: string;
  showWindowControls: boolean; // Show Mac-style red/yellow/green dots
  
  // Inline styles
  boldColor?: string;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface PreviewProps {
  markdown: string;
  theme: Theme;
}