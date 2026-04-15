import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule } from './utils/module-loader';
import { DeeplModule } from './domains/deepl/deepl.module';
import { GoogleTranslateModule } from './domains/google-translate/google-translate.module';

@Module({
    imports: [
        LoggerModule,
        loadConfigModule(),
        DeeplModule,
        GoogleTranslateModule,
    ],
})
export class AppModule {}
