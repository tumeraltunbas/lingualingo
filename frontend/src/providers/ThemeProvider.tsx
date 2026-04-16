import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/constants/storage'
import { THEMES, type ResolvedTheme, type Theme } from '@/constants/theme'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
const DARK_CLASS_NAME = 'dark'
const DEFAULT_THEME: Theme = THEMES.SYSTEM

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isKnownTheme(value: unknown): value is Theme {
  return (
    value === THEMES.LIGHT ||
    value === THEMES.DARK ||
    value === THEMES.SYSTEM
  )
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return THEMES.LIGHT
  return window.matchMedia(DARK_MEDIA_QUERY).matches
    ? THEMES.DARK
    : THEMES.LIGHT
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = window.localStorage.getItem(STORAGE_KEYS.THEME)
  return isKnownTheme(stored) ? stored : DEFAULT_THEME
}

function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch {
    // ignore storage errors (e.g. private mode, quota)
  }
}

function applyDarkClass(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle(
    DARK_CLASS_NAME,
    resolved === THEMES.DARK,
  )
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  const resolvedTheme: ResolvedTheme =
    theme === THEMES.SYSTEM ? systemTheme : theme

  useEffect(() => {
    applyDarkClass(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(DARK_MEDIA_QUERY)
    const handler = () => {
      setSystemTheme(mq.matches ? THEMES.DARK : THEMES.LIGHT)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    persistTheme(next)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const current = prev === THEMES.SYSTEM ? getSystemTheme() : prev
      const next: Theme = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
      persistTheme(next)
      return next
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggle }),
    [theme, resolvedTheme, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
