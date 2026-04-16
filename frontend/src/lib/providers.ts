export const PROVIDERS = {
  DEEPL: 'deepl',
  GOOGLE: 'google',
} as const

export type ProviderId = (typeof PROVIDERS)[keyof typeof PROVIDERS]

export const PROVIDER_IDS: readonly ProviderId[] = Object.values(PROVIDERS)

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  [PROVIDERS.DEEPL]: 'DeepL',
  [PROVIDERS.GOOGLE]: 'Google Translate',
}

export const PROVIDER_API_PATHS: Record<ProviderId, string> = {
  [PROVIDERS.DEEPL]: '/deepl',
  [PROVIDERS.GOOGLE]: '/google',
}

export const PROVIDER_API_KEY_PLACEHOLDERS: Record<ProviderId, string> = {
  [PROVIDERS.DEEPL]: 'DeepL Authentication Key',
  [PROVIDERS.GOOGLE]: 'Google Cloud API key',
}

export const DEFAULT_PROVIDER: ProviderId = PROVIDERS.DEEPL
