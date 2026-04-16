import { useCallback, useMemo, useState } from 'react'
import { ApiKeyBanner } from '@/components/ApiKeyBanner'
import { EmptyResults } from '@/components/EmptyResults'
import { SettingsDrawer } from '@/components/SettingsDrawer'
import { SourceEditor } from '@/components/SourceEditor'
import { TargetLanguagePicker } from '@/components/TargetLanguagePicker'
import { TopBar } from '@/components/TopBar'
import { TranslationGrid } from '@/components/TranslationGrid'
import { MESSAGES } from '@/constants/messages'
import { useLanguageLabels } from '@/hooks/useLanguageLabels'
import { useTranslator } from '@/hooks/useTranslator'
import { useSettings } from '@/providers/SettingsProvider'
import {
  TRANSLATION_STATUS,
  type TranslationGridItem,
} from '@/types/translation'

interface TranslateGuard {
  canTranslate: boolean
  disabledReason?: string
}

function computeTranslateGuard(
  apiKey: string | null,
  sourceText: string,
  targetLanguages: string[],
): TranslateGuard {
  if (!apiKey) return { canTranslate: false, disabledReason: MESSAGES.apiKeyRequired }
  if (!sourceText.trim())
    return { canTranslate: false, disabledReason: MESSAGES.sourceTextRequired }
  if (targetLanguages.length === 0)
    return {
      canTranslate: false,
      disabledReason: MESSAGES.targetLanguageRequired,
    }
  return { canTranslate: true }
}

function App() {
  const {
    provider,
    apiKey,
    targetLanguages,
    toggleTargetLanguage,
    setTargetLanguages,
  } = useSettings()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sourceText, setSourceText] = useState('')

  const openSettings = useCallback(() => setSettingsOpen(true), [])

  const { getLabelForCode } = useLanguageLabels(provider)

  const { translating, results, lastTranslated, runTranslate, retry } =
    useTranslator({ provider, apiKey, onMissingApiKey: openSettings })

  const { canTranslate, disabledReason } = useMemo(
    () => computeTranslateGuard(apiKey, sourceText, targetLanguages),
    [apiKey, sourceText, targetLanguages],
  )

  const handleTranslate = useCallback(() => {
    void runTranslate(sourceText.trim(), targetLanguages)
  }, [runTranslate, sourceText, targetLanguages])

  const gridItems = useMemo<TranslationGridItem[]>(() => {
    const codes = lastTranslated?.codes ?? []
    return codes.map((code) => ({
      code,
      name: getLabelForCode(code),
      state: results[code] ?? { status: TRANSLATION_STATUS.LOADING },
    }))
  }, [lastTranslated, results, getLabelForCode])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopBar onOpenSettings={openSettings} />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        {!apiKey && <ApiKeyBanner onOpenSettings={openSettings} />}

        <SourceEditor
          value={sourceText}
          onChange={setSourceText}
          onTranslate={handleTranslate}
          canTranslate={canTranslate}
          translating={translating}
          disabledReason={disabledReason}
        />

        <TargetLanguagePicker
          provider={provider}
          apiKey={apiKey}
          selected={targetLanguages}
          onToggle={toggleTargetLanguage}
          onClear={() => setTargetLanguages([])}
          onOpenSettings={openSettings}
          getLabelForCode={getLabelForCode}
        />

        {gridItems.length > 0 ? (
          <TranslationGrid items={gridItems} onRetry={retry} />
        ) : (
          <EmptyResults />
        )}
      </main>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

export default App
