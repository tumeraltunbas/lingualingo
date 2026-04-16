import { useEffect, useMemo, useState } from 'react'
import { Check, KeyRound, Loader2, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getLanguages, type SupportedLanguage } from '@/api/translation'
import {
  MESSAGES,
  PLACEHOLDERS,
  noLanguagesMatchMessage,
} from '@/constants/messages'
import { LANGUAGES_DIALOG_SCROLL_HEIGHT_PX } from '@/constants/ui'
import { resolveErrorMessage } from '@/lib/errors'
import type { ProviderId } from '@/lib/providers'
import { cn } from '@/lib/utils'

interface LanguageMoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: ProviderId
  apiKey: string | null
  selected: string[]
  onToggle: (code: string) => void
  onOpenSettings: () => void
}

type LanguagesByProvider = Partial<Record<ProviderId, SupportedLanguage[]>>

function filterLanguages(
  languages: SupportedLanguage[],
  query: string,
): SupportedLanguage[] {
  const q = query.trim().toLowerCase()
  if (!q) return languages
  return languages.filter(
    (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
  )
}

export function LanguageMoreDialog({
  open,
  onOpenChange,
  provider,
  apiKey,
  selected,
  onToggle,
  onOpenSettings,
}: LanguageMoreDialogProps) {
  const [languagesByProvider, setLanguagesByProvider] =
    useState<LanguagesByProvider>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const languages = useMemo(
    () => languagesByProvider[provider] ?? [],
    [languagesByProvider, provider],
  )
  const hasCachedLanguages = provider in languagesByProvider

  useEffect(() => {
    if (!open || !apiKey || hasCachedLanguages) return

    const state = { cancelled: false }

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const langs = await getLanguages(provider, apiKey)
        if (state.cancelled) return
        setLanguagesByProvider((prev) => ({ ...prev, [provider]: langs }))
      } catch (err: unknown) {
        if (state.cancelled) return
        setError(resolveErrorMessage(err, MESSAGES.languagesLoadError))
      } finally {
        if (!state.cancelled) setLoading(false)
      }
    }

    void run()

    return () => {
      state.cancelled = true
    }
  }, [open, provider, apiKey, hasCachedLanguages])

  const filtered = useMemo(
    () => filterLanguages(languages, query),
    [languages, query],
  )

  const handleOpenChange = (next: boolean) => {
    if (!next) setQuery('')
    onOpenChange(next)
  }

  const handleRetryFetch = () => {
    setError(null)
    setLanguagesByProvider((prev) => {
      if (!(provider in prev)) return prev
      const next = { ...prev }
      delete next[provider]
      return next
    })
  }

  const handleOpenSettings = () => {
    onOpenChange(false)
    onOpenSettings()
  }

  const hasKey = Boolean(apiKey)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>All languages</DialogTitle>
          <DialogDescription>
            Search and pick the target languages you want to translate into.
          </DialogDescription>
        </DialogHeader>

        {!hasKey ? (
          <MissingKeyState onOpenSettings={handleOpenSettings} />
        ) : (
          <>
            <SearchBar value={query} onChange={setQuery} />

            <div className="flex-1 overflow-hidden">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} onRetry={handleRetryFetch} />
              ) : filtered.length === 0 ? (
                <NoResultsState query={query} />
              ) : (
                <LanguageList
                  languages={filtered}
                  selected={selected}
                  onToggle={onToggle}
                />
              )}
            </div>

            <DialogFooter className="border-t px-6 py-3">
              <span className="mr-auto text-xs text-muted-foreground">
                {selected.length} selected
              </span>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MissingKeyState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <KeyRound className="size-5" />
      </div>
      <div>
        <p className="text-sm font-medium">Add an API key first</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The full language list comes from the provider and needs your API
          key.
        </p>
      </div>
      <Button size="sm" onClick={onOpenSettings}>
        Open settings
      </Button>
    </div>
  )
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="border-b px-6 py-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDERS.languageSearch}
          className="pl-9"
          autoFocus
        />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Loading languages
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-60 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-destructive">
      <p>{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
      {noLanguagesMatchMessage(query)}
    </div>
  )
}

interface LanguageListProps {
  languages: SupportedLanguage[]
  selected: string[]
  onToggle: (code: string) => void
}

function LanguageList({ languages, selected, onToggle }: LanguageListProps) {
  return (
    <ScrollArea style={{ height: LANGUAGES_DIALOG_SCROLL_HEIGHT_PX }}>
      <ul className="divide-y">
        {languages.map((lang) => (
          <LanguageListItem
            key={lang.code}
            language={lang}
            selected={selected.includes(lang.code)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </ScrollArea>
  )
}

interface LanguageListItemProps {
  language: SupportedLanguage
  selected: boolean
  onToggle: (code: string) => void
}

function LanguageListItem({
  language,
  selected,
  onToggle,
}: LanguageListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(language.code)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-6 py-2.5 text-left text-sm transition-colors hover:bg-accent',
          selected && 'bg-accent/50',
        )}
      >
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{language.name}</span>
          <span className="text-xs text-muted-foreground">{language.code}</span>
        </div>
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border',
          )}
        >
          {selected && <Check className="size-3" />}
        </span>
      </button>
    </li>
  )
}
