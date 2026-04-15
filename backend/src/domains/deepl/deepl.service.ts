import { Injectable } from '@nestjs/common';
import { DeeplRequestClient } from './deepl.request-client';
import { Logger } from '../../infrastructure/logger/logger.service';
import { TranslateTextReqDto } from '../../models/dto/req/deepl';
import { ProcessFailureError } from '../../infrastructure/error/error';

import {
    GetSupportedLanguagesResDto,
    TranslateTextResDto,
} from '../../models/dto/res/deepl';
import * as deepl from 'deepl-node';
import { Context } from '../../models/entities/request';
import { Translation } from '../../models/entities/deepl';

@Injectable()
export class DeeplService {
    constructor(
        private deeplRequestClient: DeeplRequestClient,
        private logger: Logger,
    ) {}

    async getSupportedLanguages(
        context: Context,
    ): Promise<GetSupportedLanguagesResDto> {
        let languages: readonly deepl.Language[] = null;

        try {
            languages =
                await this.deeplRequestClient.getSupportedLanguages(context);
        } catch (error) {
            this.logger.error(
                'DeepL Service - getSupportedLanguages - getSupportedLanguages',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const getSupportedLanguagesResDto: GetSupportedLanguagesResDto = {
            languages: languages.map((language) => ({
                code: language.code,
                name: language.name,
            })),
        };

        return getSupportedLanguagesResDto;
    }

    async translateText(
        translateTextReqDto: TranslateTextReqDto,
        context: Context,
    ): Promise<TranslateTextResDto> {
        const { text, targetLanguages } = translateTextReqDto;

        let translatedTexts: Translation[] = null;

        try {
            translatedTexts = await this.deeplRequestClient.translateText(
                text,
                targetLanguages,
                context,
            );
        } catch (error) {
            this.logger.error('DeepL Service - translateText - translateText', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        const translateTextResDto: TranslateTextResDto = {
            translations: translatedTexts,
        };

        return translateTextResDto;
    }
}
