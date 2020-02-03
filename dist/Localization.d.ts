import { GlobalStrings } from 'react-native-localization';
export declare type TStrings<T extends string> = {
    [key in T]: string;
};
export declare const createLocalization: <T extends string>(langResource?: Partial<GlobalStrings<TStrings<T>>>) => void;
