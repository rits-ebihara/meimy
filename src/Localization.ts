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

export class Localization<T extends string> {
    private langList: LocalizedStrings<T>;

    private constructor() {
        this.langList = new LocalizedStrings(getInitLangResource());
    }

    private setLangList(langList: LocalizedStrings<T>) {
        this.langList = langList;
    }

    public static create<T extends string>(langResource: Partial<GlobalStrings<TStrings<T>>> = getInitLangResource()) {
        const localization = new Localization<T>();
        localization.setLangList(new LocalizedStrings(langResource));
        return localization;
    }

    public replaceLang(key: T, ...restparam: string[]): string {
        // 可変長引数が存在する場合、その引数のリプレイスを行う。
        return (this.langList[key] || key).replace(/\{(\d+)\}/g, (...args) => {
            return restparam[args[1]];
        });
    }
}