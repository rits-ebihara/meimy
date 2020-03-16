import { GlobalStrings } from 'react-native-localization';
export declare type TStrings<T extends string> = {
    [key in T]: string;
};
export declare class Localization<T extends string> {
    private langList;
    private constructor();
    private setLangList;
    static create<T extends string>(langResource?: Partial<GlobalStrings<TStrings<T>>>): Localization<T>;
    replaceLang(key: T, ...restparam: string[]): string;
}
