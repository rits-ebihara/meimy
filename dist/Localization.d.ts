import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from 'react-native-localization';
export declare type TStrings<T extends string> = {
    [key in T]: string;
};
declare type LocalizedStrings<T extends string> = LocalizedStringsMethods & TStrings<T>;
declare class Localization<T extends string> {
    private langList;
    constructor();
    setLangList(langList: LocalizedStrings<T>): void;
    replaceLang: (key: T, ...restparam: string[]) => string;
}
export declare const createLocalization: <T extends string>(langResource?: Partial<GlobalStrings<TStrings<T>>>) => Localization<T>;
export {};
