import {
  API_BASE,
  API_HEADERS,
  CONTENT_TYPE_JSON,
  HTTP_METHOD,
  NETWORK_ERROR_STATUS,
} from '@/constants/api'
import { MESSAGES, requestFailedMessage } from '@/constants/messages'
import type { ProviderId } from '@/lib/providers'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  apiKey: string
  provider: ProviderId
  body?: unknown
}

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalized}`
}

function buildHeaders(
  apiKey: string,
  provider: ProviderId,
  headers: HeadersInit | undefined,
  hasBody: boolean,
): Headers {
  const merged = new Headers(headers)
  merged.set(API_HEADERS.API_KEY, apiKey)
  merged.set(API_HEADERS.API_PROVIDER, provider)
  if (hasBody && !merged.has(API_HEADERS.CONTENT_TYPE)) {
    merged.set(API_HEADERS.CONTENT_TYPE, CONTENT_TYPE_JSON)
  }
  return merged
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get(API_HEADERS.CONTENT_TYPE) ?? ''
  if (contentType.includes(CONTENT_TYPE_JSON)) {
    return response.json().catch(() => null)
  }
  return response.text().catch(() => null)
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    return String((payload as { message: unknown }).message)
  }
  return requestFailedMessage(status)
}

export async function apiFetch<T>(
  path: string,
  { apiKey, provider, body, headers, method, ...rest }: ApiFetchOptions,
): Promise<T> {
  const hasBody = body !== undefined
  const resolvedMethod =
    method ?? (hasBody ? HTTP_METHOD.POST : HTTP_METHOD.GET)

  let response: Response
  try {
    response = await fetch(buildUrl(path), {
      ...rest,
      method: resolvedMethod,
      headers: buildHeaders(apiKey, provider, headers, hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(NETWORK_ERROR_STATUS, MESSAGES.networkError, err)
  }

  const payload = await parseResponsePayload(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(payload, response.status),
      payload,
    )
  }

  return payload as T
}
