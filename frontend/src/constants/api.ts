export const API_BASE = '/api'

export const API_HEADERS = {
  API_KEY: 'x-api-key',
  API_PROVIDER: 'x-api-provider',
  CONTENT_TYPE: 'Content-Type',
} as const

export const CONTENT_TYPE_JSON = 'application/json'

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
} as const

export const API_ROUTES = {
  LANGUAGES: '/languages',
  TRANSLATE: '/translate',
} as const

export const NETWORK_ERROR_STATUS = 0
