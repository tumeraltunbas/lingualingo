import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule } from './utils/module-loader';

@Module({
    imports: [LoggerModule, loadConfigModule()],
})
export class AppModule {}
