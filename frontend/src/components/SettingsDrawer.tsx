import { useState } from 'react'
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettings } from '@/providers/SettingsProvider'
import {
  PROVIDER_API_KEY_PLACEHOLDERS,
  PROVIDER_IDS,
  PROVIDER_LABELS,
  type ProviderId,
} from '@/lib/providers'

const INPUT_TYPES = {
  TEXT: 'text',
  PASSWORD: 'password',
} as const

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { provider, apiKey, saveCredentials, clearApiKey } = useSettings()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Choose a translation provider and paste its API key. Your key is
            kept in memory only and never stored in your browser.
          </SheetDescription>
        </SheetHeader>

        {open && (
          <SettingsForm
            key={`${provider}-${apiKey ?? ''}`}
            activeProvider={provider}
            activeApiKey={apiKey}
            onSave={(nextProvider, trimmedKey) => {
              saveCredentials(nextProvider, trimmedKey)
              onOpenChange(false)
            }}
            onClear={clearApiKey}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

interface SettingsFormProps {
  activeProvider: ProviderId
  activeApiKey: string | null
  onSave: (provider: ProviderId, apiKey: string) => void
  onClear: () => void
  onCancel: () => void
}

function SettingsForm({
  activeProvider,
  activeApiKey,
  onSave,
  onClear,
  onCancel,
}: SettingsFormProps) {
  const [localProvider, setLocalProvider] = useState<ProviderId>(activeProvider)
  const [localKey, setLocalKey] = useState(activeApiKey ?? '')
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    const trimmed = localKey.trim()
    if (!trimmed) return
    onSave(localProvider, trimmed)
  }

  const handleClear = () => {
    onClear()
    setLocalKey('')
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <ProviderSelect value={localProvider} onChange={setLocalProvider} />

        <ApiKeyField
          provider={localProvider}
          value={localKey}
          onChange={setLocalKey}
          visible={showKey}
          onToggleVisibility={() => setShowKey((s) => !s)}
        />

        {activeApiKey && <ActiveKeyNotice provider={activeProvider} />}
      </div>

      <div className="flex items-center justify-between gap-2 border-t px-6 py-4">
        <Button
          variant="ghost"
          onClick={handleClear}
          disabled={!activeApiKey && !localKey}
        >
          Clear
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!localKey.trim()}>
            Save
          </Button>
        </div>
      </div>
    </>
  )
}

interface ProviderSelectProps {
  value: ProviderId
  onChange: (value: ProviderId) => void
}

function ProviderSelect({ value, onChange }: ProviderSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="provider">Provider</Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as ProviderId)}
      >
        <SelectTrigger id="provider">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_IDS.map((id) => (
            <SelectItem key={id} value={id}>
              {PROVIDER_LABELS[id]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface ApiKeyFieldProps {
  provider: ProviderId
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggleVisibility: () => void
}

function ApiKeyField({
  provider,
  value,
  onChange,
  visible,
  onToggleVisibility,
}: ApiKeyFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="api-key">API key</Label>
      <div className="relative">
        <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="api-key"
          type={visible ? INPUT_TYPES.TEXT : INPUT_TYPES.PASSWORD}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PROVIDER_API_KEY_PLACEHOLDERS[provider]}
          className="pl-9 pr-10 font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={visible ? 'Hide API key' : 'Show API key'}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
        Memory-only. Reloading the page clears the key.
      </p>
    </div>
  )
}

function ActiveKeyNotice({ provider }: { provider: ProviderId }) {
  return (
    <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
      An API key is currently active for{' '}
      <span className="font-medium text-foreground">
        {PROVIDER_LABELS[provider]}
      </span>
      .
    </div>
  )
}
