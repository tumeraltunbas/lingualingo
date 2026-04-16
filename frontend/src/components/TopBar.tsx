import { BrandMark } from '@/components/top-bar/BrandMark'
import { ConnectionBadge } from '@/components/top-bar/ConnectionBadge'
import { SettingsButton } from '@/components/top-bar/SettingsButton'
import { ThemeToggleButton } from '@/components/top-bar/ThemeToggleButton'
import { useSettings } from '@/providers/SettingsProvider'

const BRAND_NAME = 'Lingualingo'

interface TopBarProps {
  onOpenSettings: () => void
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  const { provider, apiKey } = useSettings()
  const connected = Boolean(apiKey)

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="/"
          className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <BrandMark />
          <span className="text-[15px] font-semibold tracking-tight">
            <span>{BRAND_NAME}</span>
          </span>
        </a>

        <div className="flex items-center gap-1.5">
          <ConnectionBadge
            provider={provider}
            connected={connected}
            onClick={onOpenSettings}
          />
          <div className="mx-1 hidden h-6 w-px bg-border/60 sm:block" />
          <ThemeToggleButton />
          <SettingsButton onClick={onOpenSettings} />
        </div>
      </div>
    </header>
  )
}
