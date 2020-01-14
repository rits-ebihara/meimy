import { GlobalStrings } from 'react-native-localization';
export declare type TStrings<T extends string> = {
    [key in T]: string;
};
export declare class Localization<T extends string> {
    private langList;
    constructor(langResource?: Partial<GlobalStrings<TStrings<T>>>);
    replaceLang: (key: T, ...restparam: string[]) => string;
}
