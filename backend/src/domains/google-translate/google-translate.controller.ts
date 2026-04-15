import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { GoogleTranslateService } from './google-translate.service';
import { TranslateTextReqDto } from '../../models/dto/req/google-translate';
import {
    GetSupportedLanguagesResDto,
    TranslateTextResDto,
} from '../../models/dto/res/google-translate';
import { ROUTE_PATHS } from '../../constants/routes';
import { CustomRequest } from '../../models/entities/request';

@Controller(ROUTE_PATHS.GOOGLE_TRANSLATE.BASE)
export class GoogleTranslateController {
    constructor(private googleTranslateService: GoogleTranslateService) {}

    @Get(ROUTE_PATHS.GOOGLE_TRANSLATE.LANGUAGES)
    async getSupportedLanguages(
        @Req() request: CustomRequest,
    ): Promise<GetSupportedLanguagesResDto> {
        const response =
            await this.googleTranslateService.getSupportedLanguages(
                request.context,
            );

        return response;
    }

    @Post(ROUTE_PATHS.GOOGLE_TRANSLATE.TRANSLATE)
    async translateText(
        @Req() request: CustomRequest,
        @Body() translateTextReqDto: TranslateTextReqDto,
    ): Promise<TranslateTextResDto> {
        const response = await this.googleTranslateService.translateText(
            translateTextReqDto,
            request.context,
        );

        return response;
    }
}
