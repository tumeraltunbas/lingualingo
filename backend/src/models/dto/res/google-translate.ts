export class TranslateTextResDto {
    translatedText: string;
}

export class GetSupportedLanguagesResDto {
    languages: SupportedLanguageRes[];
}

export class SupportedLanguageRes {
    code: string;
    name: string;
}
