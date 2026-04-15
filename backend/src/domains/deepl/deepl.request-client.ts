import { Injectable } from '@nestjs/common';
import * as deepl from 'deepl-node';
import { Context } from '../../models/entities/request';

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
        targetLanguage: string,
        context: Context,
    ): Promise<string> {
        const deeplClient = new deepl.DeepLClient(context.apiKey);

        const result = await deeplClient.translateText(
            text,
            null,
            targetLanguage as deepl.TargetLanguageCode,
        );

        return result.text;
    }
}
