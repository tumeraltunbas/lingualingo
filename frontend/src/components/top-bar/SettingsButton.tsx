import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SettingsButtonProps {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClick}
          aria-label="Settings"
          className="rounded-full"
        >
          <Settings className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Settings</TooltipContent>
    </Tooltip>
  )
}
