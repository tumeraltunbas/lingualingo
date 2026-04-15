import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DynamicModule } from '@nestjs/common';

export const loadConfigModule = (): Promise<DynamicModule> => {
    return ConfigModule.forRoot({
        isGlobal: true,
        skipProcessEnv: true,
        load: [configuration],
    });
};
