import { useEffect, useRef } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PLACEHOLDERS } from '@/constants/messages'
import {
  SOURCE_TEXTAREA_MAX_HEIGHT_PX,
  SOURCE_TEXT_MAX_CHARS,
} from '@/constants/ui'

const TRANSLATE_SHORTCUT_KEY = 'Enter'

interface SourceEditorProps {
  value: string
  onChange: (value: string) => void
  onTranslate: () => void
  canTranslate: boolean
  translating: boolean
  disabledReason?: string
}

export function SourceEditor({
  value,
  onChange,
  onTranslate,
  canTranslate,
  translating,
  disabledReason,
}: SourceEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(
      el.scrollHeight,
      SOURCE_TEXTAREA_MAX_HEIGHT_PX,
    )}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === TRANSLATE_SHORTCUT_KEY) {
      e.preventDefault()
      if (canTranslate) onTranslate()
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Source text</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length.toLocaleString()} /{' '}
          {SOURCE_TEXT_MAX_CHARS.toLocaleString()}
        </span>
      </div>

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, SOURCE_TEXT_MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS.sourceText}
          className="min-h-[140px] border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-0 top-0 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Clear text"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t pt-3 sm:flex-row sm:items-center">
        <ShortcutHint />
        <Button
          onClick={onTranslate}
          disabled={!canTranslate || translating}
          title={disabledReason}
          className="sm:min-w-36"
        >
          {translating ? (
            <>
              <Loader2 className="animate-spin" />
              Translating
            </>
          ) : (
            <>
              <Sparkles />
              Translate
            </>
          )}
        </Button>
      </div>
    </section>
  )
}

function ShortcutHint() {
  return (
    <p className="text-xs text-muted-foreground">
      Tip: press <ShortcutKey>Ctrl</ShortcutKey>
      <span className="mx-1 text-muted-foreground/70">+</span>
      <ShortcutKey>Enter</ShortcutKey> to translate.
    </p>
  )
}

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
      {children}
    </kbd>
  )
}
