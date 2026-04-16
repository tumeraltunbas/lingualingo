import { useCallback, useMemo, useState } from 'react'
import { POPULAR_LANGUAGES } from '@/lib/popular-languages'
import type { ProviderId } from '@/lib/providers'

/**
 * Provides a `code -> display name` lookup for any language code the user
 * touches. Popular labels are derived directly from the provider's curated
 * list; labels coming from other surfaces (e.g. the full-language dialog)
 * can be added via {@link registerLabels}.
 */
export function useLanguageLabels(provider: ProviderId) {
  const popularLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const lang of POPULAR_LANGUAGES[provider]) {
      map[lang.code] = lang.name
    }
    return map
  }, [provider])

  const [extraLabels, setExtraLabels] = useState<Record<string, string>>({})

  const registerLabels = useCallback((entries: Record<string, string>) => {
    setExtraLabels((prev) => ({ ...prev, ...entries }))
  }, [])

  const getLabelForCode = useCallback(
    (code: string) => popularLabels[code] ?? extraLabels[code] ?? code,
    [popularLabels, extraLabels],
  )

  return { getLabelForCode, registerLabels }
}
