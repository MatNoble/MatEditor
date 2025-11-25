import { Theme, ThemeId } from './types';

export const THEMES: Theme[] = [
  {
    id: ThemeId.TECH_BLUE,
    name: '未来',
    className: ThemeId.TECH_BLUE,
    fontFamily: 'font-sans',
  },
  {
    id: ThemeId.ACADEMIC,
    name: '格致',
    className: ThemeId.ACADEMIC,
    fontFamily: 'font-noto-serif',
  },
  {
    id: ThemeId.MDNICE,
    name: '橘颂',
    className: ThemeId.MDNICE,
    fontFamily: 'font-sans',
  },
  {
    id: ThemeId.DRACULA_PLUS,
    name: '永夜',
    className: ThemeId.DRACULA_PLUS,
    fontFamily: 'font-mono',
  },
  {
    id: ThemeId.CUSTOM,
    name: '自定义',
    className: '', // Custom theme styles are applied via a <style> tag
    fontFamily: 'font-sans',
  },
  ];