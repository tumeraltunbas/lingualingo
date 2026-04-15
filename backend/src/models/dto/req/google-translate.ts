import { IsString, IsNotEmpty } from 'class-validator';

export class TranslateTextReqDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    targetLanguage: string;
}
