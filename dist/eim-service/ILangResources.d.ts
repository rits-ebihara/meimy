interface ILangStringType {
    [key: string]: string;
}
export interface ILangResourceStrings {
    de: ILangStringType;
    ja: ILangStringType;
    en: ILangStringType;
    it: ILangStringType;
    fr: ILangStringType;
    es: ILangStringType;
    nl: ILangStringType;
}
export interface ILangResources {
    strings: ILangResourceStrings;
}
export {};
