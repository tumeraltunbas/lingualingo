export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT) || 8080,
    },
    path: {
        webBaseUrl: process.env.WEB_BASE_URL || 'http://localhost:5173',
    },
    api: {
        headers: {
            apiKeyHeader: 'x-api-key',
            apiProviderHeader: 'x-api-provider',
        },
    },
});

interface Config {
    app: AppConfig;
    path: PathConfig;
    api: ApiConfig;
}

export interface AppConfig {
    port: number;
}

export interface PathConfig {
    webBaseUrl: string;
}

export interface ApiConfig {
    headers: {
        apiKeyHeader: string;
        apiProviderHeader: string;
    };
}
