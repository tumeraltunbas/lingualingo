import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class TranslateTextReqDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsArray()
    @IsNotEmpty()
    targetLanguages: string[];
}
