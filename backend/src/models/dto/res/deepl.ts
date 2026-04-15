export class TranslateTextResDto {
    translations: TranslationRes[];
}

export class TranslationRes {
    code: string;
    translatedText: string;
}

export class GetSupportedLanguagesResDto {
    languages: SupportedLanguageRes[];
}

export class SupportedLanguageRes {
    code: string;
    name: string;
}
