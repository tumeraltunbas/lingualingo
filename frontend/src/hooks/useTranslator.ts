import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { translate } from '@/api/translation'
import { MESSAGES } from '@/constants/messages'
import { resolveErrorMessage } from '@/lib/errors'
import type { ProviderId } from '@/lib/providers'
import {
  TRANSLATION_STATUS,
  type LastTranslatedRequest,
  type TranslationState,
} from '@/types/translation'

interface UseTranslatorOptions {
  provider: ProviderId
  apiKey: string | null
  onMissingApiKey?: () => void
}

type ResultsMap = Record<string, TranslationState>

function buildInitialLoadingResults(codes: string[]): ResultsMap {
  const next: ResultsMap = {}
  for (const code of codes) {
    next[code] = { status: TRANSLATION_STATUS.LOADING }
  }
  return next
}

function buildResultsFromTranslations(
  codes: string[],
  byCode: Map<string, string>,
): ResultsMap {
  const next: ResultsMap = {}
  for (const code of codes) {
    const value = byCode.get(code)
    next[code] =
      value !== undefined
        ? { status: TRANSLATION_STATUS.SUCCESS, text: value }
        : {
            status: TRANSLATION_STATUS.ERROR,
            message: MESSAGES.noTranslationReturned,
          }
  }
  return next
}

function buildErrorResults(codes: string[], message: string): ResultsMap {
  const next: ResultsMap = {}
  for (const code of codes) {
    next[code] = { status: TRANSLATION_STATUS.ERROR, message }
  }
  return next
}

export function useTranslator({
  provider,
  apiKey,
  onMissingApiKey,
}: UseTranslatorOptions) {
  const [translating, setTranslating] = useState(false)
  const [results, setResults] = useState<ResultsMap>({})
  const [lastTranslated, setLastTranslated] =
    useState<LastTranslatedRequest | null>(null)

  useEffect(() => {
    setResults({})
    setLastTranslated(null)
  }, [provider])

  const runTranslate = useCallback(
    async (text: string, codes: string[]) => {
      if (!apiKey) {
        toast.error(MESSAGES.apiKeyRequired)
        onMissingApiKey?.()
        return
      }
      if (codes.length === 0) return

      setTranslating(true)
      setLastTranslated({ text, codes })
      setResults(buildInitialLoadingResults(codes))

      try {
        const translations = await translate(provider, apiKey, {
          text,
          targetLanguages: codes,
        })
        const byCode = new Map(
          translations.map((t) => [t.code, t.translatedText]),
        )
        setResults(buildResultsFromTranslations(codes, byCode))
      } catch (err) {
        const message = resolveErrorMessage(err)
        toast.error(message)
        setResults(buildErrorResults(codes, message))
      } finally {
        setTranslating(false)
      }
    },
    [apiKey, provider, onMissingApiKey],
  )

  const retry = useCallback(
    (code: string) => {
      if (!lastTranslated || !apiKey) return
      setResults((prev) => ({
        ...prev,
        [code]: { status: TRANSLATION_STATUS.LOADING },
      }))
      translate(provider, apiKey, {
        text: lastTranslated.text,
        targetLanguages: [code],
      })
        .then((translations) => {
          const value = translations.find((t) => t.code === code)
          setResults((prev) => ({
            ...prev,
            [code]: value
              ? { status: TRANSLATION_STATUS.SUCCESS, text: value.translatedText }
              : {
                  status: TRANSLATION_STATUS.ERROR,
                  message: MESSAGES.noTranslationReturned,
                },
          }))
        })
        .catch((err: unknown) => {
          const message = resolveErrorMessage(err)
          setResults((prev) => ({
            ...prev,
            [code]: { status: TRANSLATION_STATUS.ERROR, message },
          }))
          toast.error(message)
        })
    },
    [apiKey, lastTranslated, provider],
  )

  return { translating, results, lastTranslated, runTranslate, retry }
}
