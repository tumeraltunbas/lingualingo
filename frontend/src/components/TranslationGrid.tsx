import { TranslationCard } from './TranslationCard'
import type { TranslationGridItem } from '@/types/translation'

interface TranslationGridProps {
  items: TranslationGridItem[]
  onRetry?: (code: string) => void
}

export function TranslationGrid({ items, onRetry }: TranslationGridProps) {
  if (items.length === 0) return null
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <TranslationCard
          key={item.code}
          code={item.code}
          name={item.name}
          state={item.state}
          onRetry={onRetry ? () => onRetry(item.code) : undefined}
        />
      ))}
    </section>
  )
}
