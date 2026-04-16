import { useMemo, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageMoreDialog } from '@/components/LanguageMoreDialog'
import {
  POPULAR_LANGUAGES,
  type LanguageOption,
} from '@/lib/popular-languages'
import type { ProviderId } from '@/lib/providers'
import { cn } from '@/lib/utils'

interface TargetLanguagePickerProps {
  provider: ProviderId
  apiKey: string | null
  selected: string[]
  onToggle: (code: string) => void
  onClear: () => void
  onOpenSettings: () => void
  getLabelForCode: (code: string) => string
}

export function TargetLanguagePicker({
  provider,
  apiKey,
  selected,
  onToggle,
  onClear,
  onOpenSettings,
  getLabelForCode,
}: TargetLanguagePickerProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const popular = POPULAR_LANGUAGES[provider]

  const extraSelected = useMemo<LanguageOption[]>(() => {
    const popularCodes = new Set(popular.map((l) => l.code))
    return selected
      .filter((code) => !popularCodes.has(code))
      .map((code) => ({ code, name: getLabelForCode(code) }))
  }, [selected, popular, getLabelForCode])

  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Target languages</h2>
          <p className="text-xs text-muted-foreground">
            Pick as many as you like. Each one gets its own translation card.
          </p>
        </div>
        {selected.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        {popular.map((lang) => (
          <PopularLanguageChip
            key={lang.code}
            language={lang}
            selected={selected.includes(lang.code)}
            onToggle={onToggle}
          />
        ))}

        {extraSelected.map((lang) => (
          <ExtraLanguageChip
            key={lang.code}
            language={lang}
            onRemove={onToggle}
          />
        ))}

        <MoreLanguagesButton onClick={() => setMoreOpen(true)} />
      </div>

      <LanguageMoreDialog
        open={moreOpen}
        onOpenChange={setMoreOpen}
        provider={provider}
        apiKey={apiKey}
        selected={selected}
        onToggle={onToggle}
        onOpenSettings={onOpenSettings}
      />
    </section>
  )
}

interface PopularLanguageChipProps {
  language: LanguageOption
  selected: boolean
  onToggle: (code: string) => void
}

function PopularLanguageChip({
  language,
  selected,
  onToggle,
}: PopularLanguageChipProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(language.code)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-background hover:border-primary/40 hover:bg-accent',
      )}
    >
      {selected && <Check className="size-3.5" />}
      <span>{language.name}</span>
      <span
        className={cn(
          'font-mono text-[10px]',
          selected ? 'text-primary-foreground/70' : 'text-muted-foreground',
        )}
      >
        {language.code}
      </span>
    </button>
  )
}

interface ExtraLanguageChipProps {
  language: LanguageOption
  onRemove: (code: string) => void
}

function ExtraLanguageChip({ language, onRemove }: ExtraLanguageChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-sm">
      <Check className="size-3.5" />
      <span>{language.name}</span>
      <button
        type="button"
        onClick={() => onRemove(language.code)}
        className="-mr-1 flex size-4 items-center justify-center rounded-full hover:bg-primary-foreground/20"
        aria-label={`Remove ${language.name}`}
      >
        <X className="size-3" />
      </button>
    </span>
  )
}

function MoreLanguagesButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <Plus className="size-3.5" />
      More languages
    </button>
  )
}
