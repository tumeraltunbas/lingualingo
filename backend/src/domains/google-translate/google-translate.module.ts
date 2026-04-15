import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GoogleTranslateController } from './google-translate.controller';
import { GoogleTranslateService } from './google-translate.service';
import { GoogleTranslateRequestClient } from './google-translate.request-client';
import { CheckApiKeyMiddleware } from '../../middlewares/check-api-key.middleware';

@Module({
    controllers: [GoogleTranslateController],
    providers: [GoogleTranslateService, GoogleTranslateRequestClient],
    exports: [GoogleTranslateService],
})
export class GoogleTranslateModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckApiKeyMiddleware)
            .forRoutes(GoogleTranslateController);
    }
}
