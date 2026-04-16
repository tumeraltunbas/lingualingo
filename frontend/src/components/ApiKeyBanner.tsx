import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ApiKeyBannerProps {
  onOpenSettings: () => void
}

export function ApiKeyBanner({ onOpenSettings }: ApiKeyBannerProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <KeyRound className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Add an API key to start translating
          </p>
          <p className="text-xs text-muted-foreground">
            Open Settings to pick a provider and paste your API key. It stays
            in memory and never leaves this tab.
          </p>
        </div>
      </div>
      <Button onClick={onOpenSettings}>Open settings</Button>
    </div>
  )
}
