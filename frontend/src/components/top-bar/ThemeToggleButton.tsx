import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { THEMES } from '@/constants/theme'
import { useTheme } from '@/providers/ThemeProvider'

export function ThemeToggleButton() {
  const { resolvedTheme, toggle } = useTheme()
  const tooltip = resolvedTheme === THEMES.DARK ? 'Light mode' : 'Dark mode'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
