import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { DeeplService } from './deepl.service';
import { TranslateTextReqDto } from '../../models/dto/req/deepl';
import {
    GetSupportedLanguagesResDto,
    TranslateTextResDto,
} from '../../models/dto/res/deepl';
import { ROUTE_PATHS } from '../../constants/routes';
import { CustomRequest } from '../../models/entities/request';

@Controller(ROUTE_PATHS.DEEPL.BASE)
export class DeeplController {
    constructor(private deeplService: DeeplService) {}

    @Get(ROUTE_PATHS.DEEPL.LANGUAGES)
    async getSupportedLanguages(
        @Req() request: CustomRequest,
    ): Promise<GetSupportedLanguagesResDto> {
        const response = await this.deeplService.getSupportedLanguages(
            request.context,
        );

        return response;
    }

    @Post(ROUTE_PATHS.DEEPL.TRANSLATE)
    async translateText(
        @Req() request: CustomRequest,
        @Body() translateTextReqDto: TranslateTextReqDto,
    ): Promise<TranslateTextResDto> {
        const response = await this.deeplService.translateText(
            translateTextReqDto,
            request.context,
        );

        return response;
    }
}
