export enum ThemeId {
  DEFAULT = 'theme-tech-blue', // Set Tech Blue as the default
  TECH_BLUE = 'theme-tech-blue',
  MDNICE = 'theme-mdnice',
  DRACULA_PLUS = 'theme-dracula-plus',
  ACADEMIC = 'theme-academic',
  CUSTOM = 'theme-custom',
}

export interface Theme {
  id: ThemeId;
  name: string;
  className: ThemeId | string;
  fontFamily: 'font-sans' | 'font-serif' | 'font-caveat' | 'font-mono' | 'font-noto-serif';
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface PreviewProps {
  markdown: string;
  theme: Theme;
}