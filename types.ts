export enum ThemeId {
  DEFAULT = 'theme-tech-blue', // Set Tech Blue as the default
  TECH_BLUE = 'theme-tech-blue',
  MDNICE = 'theme-mdnice',
  DRACULA_PLUS = 'theme-dracula-plus',
  ACADEMIC = 'theme-academic',
}

export interface Theme {
  id: ThemeId;
  name: string;
  className: ThemeId;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface PreviewProps {
  markdown: string;
  theme: Theme;
}