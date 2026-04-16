import { ApiError } from '@/api/client'
import { MESSAGES } from '@/constants/messages'

export function resolveErrorMessage(
  err: unknown,
  fallback: string = MESSAGES.translationGenericError,
): string {
  return err instanceof ApiError ? err.message : fallback
}
