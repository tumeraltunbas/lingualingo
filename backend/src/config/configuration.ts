export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT) || 8080,
    },
    path: {
        webBaseUrl: process.env.WEB_BASE_URL,
    },
});

interface Config {
    app: AppConfig;
    path: PathConfig;
}

export interface AppConfig {
    port: number;
}

export interface PathConfig {
    webBaseUrl: string;
}
