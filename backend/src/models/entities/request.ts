import { ApiProviders } from '../../constants/enums';

export class CustomRequest extends Request {
    context: Context;
}

export interface Context {
    apiProvider: ApiProviders;
    apiKey: string;
}
