import { Languages } from 'lucide-react'

const BRAND_ICON_STROKE_WIDTH = 2.25

export function BrandMark() {
  return (
    <Languages
      aria-hidden="true"
      className="size-6 text-primary"
      strokeWidth={BRAND_ICON_STROKE_WIDTH}
    />
  )
}
