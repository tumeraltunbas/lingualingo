import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DeeplController } from './deepl.controller';
import { DeeplService } from './deepl.service';
import { DeeplRequestClient } from './deepl.request-client';
import { CheckApiKeyMiddleware } from '../../middlewares/check-api-key.middleware';

@Module({
    controllers: [DeeplController],
    providers: [DeeplService, DeeplRequestClient],
    exports: [DeeplService],
})
export class DeeplModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckApiKeyMiddleware).forRoutes(DeeplController);
    }
}
