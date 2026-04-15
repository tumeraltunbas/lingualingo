import { Injectable } from '@nestjs/common';
import { GoogleTranslateRequestClient } from './google-translate.request-client';
import { Logger } from '../../infrastructure/logger/logger.service';
import { TranslateTextReqDto } from '../../models/dto/req/google-translate';
import { ProcessFailureError } from '../../infrastructure/error/error';

import {
    GetSupportedLanguagesResDto,
    TranslateTextResDto,
} from '../../models/dto/res/google-translate';
import { Context } from '../../models/entities/request';
import { LanguageResult } from '@google-cloud/translate/build/src/v2';
import { Translation } from '../../models/entities/google-translate';

@Injectable()
export class GoogleTranslateService {
    constructor(
        private googleTranslateRequestClient: GoogleTranslateRequestClient,
        private logger: Logger,
    ) {}

    async getSupportedLanguages(
        context: Context,
    ): Promise<GetSupportedLanguagesResDto> {
        let languages: LanguageResult[] = null;

        try {
            languages =
                await this.googleTranslateRequestClient.getSupportedLanguages(
                    context,
                );
        } catch (error) {
            this.logger.error(
                'Google Translate Service - getSupportedLanguages - getSupportedLanguages',
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
            translatedTexts =
                await this.googleTranslateRequestClient.translateText(
                    text,
                    targetLanguages,
                    context,
                );
        } catch (error) {
            this.logger.error(
                'Google Translate Service - translateText - translateText',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const translateTextResDto: TranslateTextResDto = {
            translations: translatedTexts,
        };

        return translateTextResDto;
    }
}
