import { Sparkles } from 'lucide-react'

export function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-5" />
      </div>
      <p className="text-sm font-medium">
        Your translations will appear here
      </p>
      <p className="max-w-md text-xs text-muted-foreground">
        Enter text, pick a few target languages, and hit Translate to see every
        language side by side.
      </p>
    </div>
  )
}
