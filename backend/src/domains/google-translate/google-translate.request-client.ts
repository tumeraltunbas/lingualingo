import { Injectable } from '@nestjs/common';
import {
    LanguageResult,
    Translate,
} from '@google-cloud/translate/build/src/v2/index';
import { Context } from '../../models/entities/request';

@Injectable()
export class GoogleTranslateRequestClient {
    async getSupportedLanguages(context: Context): Promise<LanguageResult[]> {
        const translateClient = new Translate({ key: context.apiKey });
        const [languages] = await translateClient.getLanguages();

        return languages;
    }

    async translateText(
        text: string,
        targetLanguageCode: string,
        context: Context,
    ): Promise<string> {
        const translateClient = new Translate({ key: context.apiKey });

        const [translations] = await translateClient.translate(
            text,
            targetLanguageCode,
        );

        return translations;
    }
}
