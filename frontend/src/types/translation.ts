export const TRANSLATION_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export type TranslationStatus =
  (typeof TRANSLATION_STATUS)[keyof typeof TRANSLATION_STATUS]

export type TranslationState =
  | { status: typeof TRANSLATION_STATUS.LOADING }
  | { status: typeof TRANSLATION_STATUS.SUCCESS; text: string }
  | { status: typeof TRANSLATION_STATUS.ERROR; message: string }

export interface TranslationGridItem {
  code: string
  name: string
  state: TranslationState
}

export interface LastTranslatedRequest {
  text: string
  codes: string[]
}
