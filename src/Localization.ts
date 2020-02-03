import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from 'react-native-localization';

export type TStrings<T extends string> = { [key in T]: string };
type LocalizedStrings<T extends string> = LocalizedStringsMethods & TStrings<T>;

const getInitLangResource = (): GlobalStrings<TStrings<string>> => ({
    de: {},
    en: {},
    es: {},
    fr: {},
    it: {},
    ja: {},
    nl: {},
});

class Localization<T extends string> {
    private langList: LocalizedStrings<T>;

    public constructor() {
        this.langList = new LocalizedStrings(getInitLangResource());
    }

    public setLangList(langList: LocalizedStrings<T>) {
        this.langList = langList;
    }

    public replaceLang = (key: T, ...restparam: string[]): string => {
        // 可変長引数が存在する場合、その引数のリプレイスを行う。
        return (this.langList[key] || key).replace(/\{(\d+)\}/g, (...args) => {
            return restparam[args[1]];
        });
    }
}

export const createLocalization =
    <T extends string>(langResource: Partial<GlobalStrings<TStrings<T>>> = getInitLangResource()) => {
        const localization = new Localization<T>();
        localization.setLangList(new LocalizedStrings(langResource));
        return localization;
    }