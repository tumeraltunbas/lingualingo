import { Injectable } from '@nestjs/common';
import * as deepl from 'deepl-node';
import { Context } from '../../models/entities/request';
import { Translation } from '../../models/entities/deepl';

@Injectable()
export class DeeplRequestClient {
    async getSupportedLanguages(
        context: Context,
    ): Promise<readonly deepl.Language[]> {
        const deeplClient = new deepl.DeepLClient(context.apiKey);
        const targetLanguages = await deeplClient.getTargetLanguages();
        return targetLanguages;
    }

    async translateText(
        text: string,
        targetLanguages: string[],
        context: Context,
    ): Promise<Translation[]> {
        const deeplClient = new deepl.DeepLClient(context.apiKey);

        const translationPromises = targetLanguages.map((targetLanguage) =>
            deeplClient.translateText(
                text,
                null,
                targetLanguage as deepl.TargetLanguageCode,
            ),
        );

        const results = await Promise.all(translationPromises);

        return results.map((result, index) => ({
            code: targetLanguages[index],
            translatedText: result.text,
        }));
    }
}
