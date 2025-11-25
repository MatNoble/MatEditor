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
    fontFamily: 'font-serif',
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
];