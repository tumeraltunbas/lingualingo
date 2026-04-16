export const MESSAGES = {
  apiKeyRequired: 'Add an API key in Settings first.',
  sourceTextRequired: 'Type something to translate.',
  targetLanguageRequired: 'Pick at least one target language.',
  translationGenericError: 'Translation failed. Please try again.',
  noTranslationReturned: 'No translation returned.',
  networkError: 'Network error. Is the backend running?',
  languagesLoadError:
    'Failed to load languages. Check your API key and try again.',
} as const

export const PLACEHOLDERS = {
  sourceText:
    "Type or paste something to translate. Try 'hello, how are you?'",
  languageSearch: 'Search by name or code',
} as const

export const requestFailedMessage = (status: number): string =>
  `Request failed with status ${status}`

export const noLanguagesMatchMessage = (query: string): string =>
  `No languages match "${query}".`
