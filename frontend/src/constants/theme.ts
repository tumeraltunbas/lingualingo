export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]
export type ResolvedTheme = typeof THEMES.LIGHT | typeof THEMES.DARK
