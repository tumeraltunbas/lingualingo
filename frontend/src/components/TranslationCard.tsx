import { useState } from 'react'
import { AlertCircle, Check, Copy, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { COPY_FEEDBACK_DURATION_MS } from '@/constants/ui'
import { cn } from '@/lib/utils'
import {
  TRANSLATION_STATUS,
  type TranslationState,
} from '@/types/translation'

export type { TranslationState } from '@/types/translation'

interface TranslationCardProps {
  code: string
  name: string
  state: TranslationState
  onRetry?: () => void
}

export function TranslationCard({
  code,
  name,
  state,
  onRetry,
}: TranslationCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (state.status !== TRANSLATION_STATUS.SUCCESS) return
    try {
      await navigator.clipboard.writeText(state.text)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
    } catch {
      // Clipboard API may be unavailable; silently ignore.
    }
  }

  return (
    <article
      className={cn(
        'group relative flex min-h-[140px] flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        state.status === TRANSLATION_STATUS.ERROR &&
          'border-destructive/40 bg-destructive/5',
      )}
    >
      <CardHeader
        code={code}
        name={name}
        showCopy={state.status === TRANSLATION_STATUS.SUCCESS}
        copied={copied}
        onCopy={handleCopy}
      />

      {state.status === TRANSLATION_STATUS.LOADING && <LoadingBody />}

      {state.status === TRANSLATION_STATUS.SUCCESS && (
        <SuccessBody text={state.text} />
      )}

      {state.status === TRANSLATION_STATUS.ERROR && (
        <ErrorBody message={state.message} onRetry={onRetry} />
      )}
    </article>
  )
}

interface CardHeaderProps {
  code: string
  name: string
  showCopy: boolean
  copied: boolean
  onCopy: () => void
}

function CardHeader({
  code,
  name,
  showCopy,
  copied,
  onCopy,
}: CardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <h3 className="truncate text-sm font-semibold leading-tight">{name}</h3>
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {code}
        </span>
      </div>
      {showCopy && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={onCopy}
          aria-label="Copy translation"
        >
          {copied ? <Check className="text-primary" /> : <Copy />}
        </Button>
      )}
    </header>
  )
}

function LoadingBody() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function SuccessBody({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
      {text}
    </p>
  )
}

function ErrorBody({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-3">
      <p className="flex items-start gap-2 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{message}</span>
      </p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="self-start"
        >
          <RotateCcw className="size-3.5" />
          Retry
        </Button>
      )}
    </div>
  )
}
