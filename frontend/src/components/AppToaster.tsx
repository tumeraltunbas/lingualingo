import { Toaster } from 'sonner'
import { TOAST_POSITION } from '@/constants/ui'
import { useTheme } from '@/providers/ThemeProvider'

export function AppToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster theme={resolvedTheme} richColors position={TOAST_POSITION} />
}
