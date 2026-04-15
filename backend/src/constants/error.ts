export const ERROR_CODES = {
    processFailureError: 'process_failure_error',
    validationError: 'validation_error',
    notFound: 'not_found',
    missingApiKey: 'missing_api_key',
    missingApiProvider: 'missing_api_provider',
    invalidApiProvider: 'invalid_api_provider',
    apiProviderMismatch: 'api_provider_mismatch',
};

export const ERROR_MESSAGES = {
    process_failure_error: 'Process failure error.',
    validation_error: 'Validation error.',
    not_found: 'Not found.',
    missing_api_key: 'Missing required header: x-api-key',
    missing_api_provider: 'Missing required header: x-api-provider',
    invalid_api_provider: 'Invalid API provider. Valid values: deepl, google',
    api_provider_mismatch: 'API provider mismatch.',
};
