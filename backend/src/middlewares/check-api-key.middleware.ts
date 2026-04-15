import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../constants/configuration';
import { BusinessRuleError } from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { ROUTE_PATHS } from '../constants/routes';
import { ApiProviders } from '../constants/enums';
import { CustomRequest } from '../models/entities/request';

@Injectable()
export class CheckApiKeyMiddleware implements NestMiddleware {
    private apiKeyHeader: string;
    private apiProviderHeader: string;

    constructor(private configService: ConfigService) {
        this.apiKeyHeader = this.configService.get<string>(
            CONFIGURATION_KEYS.api.headers.apiKeyHeader,
        );
        this.apiProviderHeader = this.configService.get<string>(
            CONFIGURATION_KEYS.api.headers.apiProviderHeader,
        );
    }

    use(req: CustomRequest, res: Response, next: NextFunction) {
        const apiKey = req.headers[this.apiKeyHeader];
        const apiProvider = req.headers[this.apiProviderHeader];

        if (!apiKey) {
            throw new BusinessRuleError(ERROR_CODES.missingApiKey);
        }

        if (!apiProvider) {
            throw new BusinessRuleError(ERROR_CODES.missingApiProvider);
        }

        const isValidApiProvider = Object.values(ApiProviders).includes(
            apiProvider as ApiProviders,
        );

        if (!isValidApiProvider) {
            throw new BusinessRuleError(ERROR_CODES.invalidApiProvider);
        }

        const requestPath = req.url.toLowerCase();

        const isDeeplRequest = requestPath.includes(ROUTE_PATHS.DEEPL.BASE);
        const isGoogleTranslateRequest = requestPath.includes(
            ROUTE_PATHS.GOOGLE_TRANSLATE.BASE,
        );

        if (isDeeplRequest && apiProvider !== ApiProviders.DEEPL) {
            throw new BusinessRuleError(ERROR_CODES.apiProviderMismatch);
        }

        if (isGoogleTranslateRequest && apiProvider !== ApiProviders.GOOGLE) {
            throw new BusinessRuleError(ERROR_CODES.apiProviderMismatch);
        }

        req.context = {
            apiKey,
            apiProvider,
        };

        next();
    }
}
