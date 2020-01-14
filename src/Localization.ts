import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from 'react-native-localization';

export type TStrings<T extends string> = { [key in T]: string };

const getInitLangResource = (): GlobalStrings<TStrings<string>> => ({
    de: {},
    en: {},
    es: {},
    fr: {},
    it: {},
    ja: {},
    nl: {},
});

export class Localization<T extends string> {
    private langList: LocalizedStringsMethods & TStrings<T>;

    public constructor(langResource: Partial<GlobalStrings<TStrings<T>>> = getInitLangResource()) {
        const initLangResource = getInitLangResource();
        this.langList = new LocalizedStrings(langResource || initLangResource);
    }

    public replaceLang = (key: T, ...restparam: string[]): string => {
        // 可変長引数が存在する場合、その引数のリプレイスを行う。
        return (this.langList[key] || key).replace(/\{(\d+)\}/g, (...args) => {
            return restparam[args[1]];
        });
    }
}