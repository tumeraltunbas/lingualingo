import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule } from './utils/module-loader';
import { DeeplModule } from './domains/deepl/deepl.module';

@Module({
    imports: [LoggerModule, loadConfigModule(), DeeplModule],
})
export class AppModule {}
