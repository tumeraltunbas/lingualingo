import { Injectable } from '@nestjs/common';
import {
    LanguageResult,
    Translate,
} from '@google-cloud/translate/build/src/v2/index';
import { Context } from '../../models/entities/request';
import { Translation } from '../../models/entities/google-translate';

@Injectable()
export class GoogleTranslateRequestClient {
    async getSupportedLanguages(context: Context): Promise<LanguageResult[]> {
        const translateClient = new Translate({ key: context.apiKey });
        const [languages] = await translateClient.getLanguages();

        return languages;
    }

    async translateText(
        text: string,
        targetLanguageCodes: string[],
        context: Context,
    ): Promise<Translation[]> {
        const translateClient = new Translate({ key: context.apiKey });

        const translationPromises = targetLanguageCodes.map(
            (targetLanguageCode) =>
                translateClient.translate(text, targetLanguageCode),
        );

        const results = await Promise.all(translationPromises);

        return results.map((result, index) => ({
            code: targetLanguageCodes[index],
            translatedText: result[0],
        }));
    }
}
