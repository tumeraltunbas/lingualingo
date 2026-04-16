import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_PROVIDER, type ProviderId } from '@/lib/providers'

interface SettingsState {
  provider: ProviderId
  apiKey: string | null
  targetLanguages: string[]
}

interface SettingsContextValue extends SettingsState {
  setProvider: (provider: ProviderId) => void
  setApiKey: (apiKey: string | null) => void
  setTargetLanguages: (codes: string[]) => void
  toggleTargetLanguage: (code: string) => void
  clearApiKey: () => void
  saveCredentials: (provider: ProviderId, apiKey: string) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>({
    provider: DEFAULT_PROVIDER,
    apiKey: null,
    targetLanguages: [],
  })

  const setProvider = useCallback((provider: ProviderId) => {
    setState((prev) =>
      prev.provider === provider
        ? prev
        : { provider, apiKey: null, targetLanguages: [] },
    )
  }, [])

  const setApiKey = useCallback((apiKey: string | null) => {
    setState((prev) => ({ ...prev, apiKey }))
  }, [])

  const setTargetLanguages = useCallback((codes: string[]) => {
    setState((prev) => ({ ...prev, targetLanguages: codes }))
  }, [])

  const toggleTargetLanguage = useCallback((code: string) => {
    setState((prev) => {
      const exists = prev.targetLanguages.includes(code)
      return {
        ...prev,
        targetLanguages: exists
          ? prev.targetLanguages.filter((c) => c !== code)
          : [...prev.targetLanguages, code],
      }
    })
  }, [])

  const clearApiKey = useCallback(() => {
    setState((prev) => ({ ...prev, apiKey: null }))
  }, [])

  const saveCredentials = useCallback(
    (provider: ProviderId, apiKey: string) => {
      setState((prev) => ({
        provider,
        apiKey,
        targetLanguages:
          prev.provider === provider ? prev.targetLanguages : [],
      }))
    },
    [],
  )

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...state,
      setProvider,
      setApiKey,
      setTargetLanguages,
      toggleTargetLanguage,
      clearApiKey,
      saveCredentials,
    }),
    [
      state,
      setProvider,
      setApiKey,
      setTargetLanguages,
      toggleTargetLanguage,
      clearApiKey,
      saveCredentials,
    ],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
