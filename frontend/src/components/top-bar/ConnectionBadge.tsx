import { PROVIDER_LABELS, type ProviderId } from '@/lib/providers'
import { cn } from '@/lib/utils'

interface ConnectionBadgeProps {
  provider: ProviderId
  connected: boolean
  onClick: () => void
}

export function ConnectionBadge({
  provider,
  connected,
  onClick,
}: ConnectionBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all sm:inline-flex',
        connected
          ? 'border-border bg-muted/40 text-foreground hover:bg-muted'
          : 'border-dashed border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      <ConnectionDot connected={connected} />
      {connected ? (
        <span>
          Connected to{' '}
          <span className="font-semibold">{PROVIDER_LABELS[provider]}</span>
        </span>
      ) : (
        <span>No API key</span>
      )}
    </button>
  )
}

function ConnectionDot({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        'relative flex size-2 items-center justify-center',
        connected ? 'text-primary' : 'text-muted-foreground/80',
      )}
    >
      <span
        className={cn(
          'absolute inline-flex size-full rounded-full opacity-60',
          connected ? 'animate-ping bg-primary/60' : 'bg-transparent',
        )}
      />
      <span
        className={cn(
          'relative inline-flex size-2 rounded-full',
          connected ? 'bg-primary' : 'bg-muted-foreground/40',
        )}
      />
    </span>
  )
}
