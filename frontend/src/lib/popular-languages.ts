import { PROVIDERS, type ProviderId } from '@/lib/providers'

export interface LanguageOption {
  code: string
  name: string
}

/**
 * Curated popular targets per provider. Codes are the exact target codes the
 * backend forwards to the upstream API. DeepL uses uppercase BCP-47-ish codes
 * (EN-US, PT-BR, ZH-HANS); Google uses lowercase ISO-639-1.
 */
export const POPULAR_LANGUAGES: Record<ProviderId, LanguageOption[]> = {
  [PROVIDERS.DEEPL]: [
    { code: 'EN-US', name: 'English (US)' },
    { code: 'ES', name: 'Spanish' },
    { code: 'FR', name: 'French' },
    { code: 'DE', name: 'German' },
    { code: 'IT', name: 'Italian' },
    { code: 'PT-BR', name: 'Portuguese (BR)' },
    { code: 'JA', name: 'Japanese' },
    { code: 'ZH-HANS', name: 'Chinese' },
    { code: 'TR', name: 'Turkish' },
    { code: 'RU', name: 'Russian' },
  ],
  [PROVIDERS.GOOGLE]: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
  ],
}
