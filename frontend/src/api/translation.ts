import { apiFetch } from './client'
import { API_ROUTES } from '@/constants/api'
import { PROVIDER_API_PATHS, type ProviderId } from '@/lib/providers'

export interface SupportedLanguage {
  code: string
  name: string
}

export interface Translation {
  code: string
  translatedText: string
}

interface GetSupportedLanguagesResponse {
  languages: SupportedLanguage[]
}

interface TranslateTextResponse {
  translations: Translation[]
}

interface TranslateRequest {
  text: string
  targetLanguages: string[]
}

function buildProviderPath(provider: ProviderId, route: string): string {
  return `${PROVIDER_API_PATHS[provider]}${route}`
}

export async function getLanguages(
  provider: ProviderId,
  apiKey: string,
): Promise<SupportedLanguage[]> {
  const res = await apiFetch<GetSupportedLanguagesResponse>(
    buildProviderPath(provider, API_ROUTES.LANGUAGES),
    { apiKey, provider },
  )
  return res.languages
}

export async function translate(
  provider: ProviderId,
  apiKey: string,
  payload: TranslateRequest,
): Promise<Translation[]> {
  const res = await apiFetch<TranslateTextResponse>(
    buildProviderPath(provider, API_ROUTES.TRANSLATE),
    { apiKey, provider, body: payload },
  )
  return res.translations
}
