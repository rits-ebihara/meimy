import { IDoc } from '../../src/eim-service/EIMDocInterface';
import { EIMServiceAdapter } from './EIMServiceAdapter';
export declare class LangResourceController {
    private cachePath;
    private memoryCache?;
    constructor();
    getLangWord: (site: string, appKey: string, key: string, lang: "de" | "ja" | "en" | "it" | "fr" | "es" | "nl", esa: EIMServiceAdapter) => Promise<string>;
    createCacheDir: () => Promise<void>;
    convertDocLabel: <T extends object>(site: string, appKey: string, source: IDoc<T>, lang: "de" | "ja" | "en" | "it" | "fr" | "es" | "nl", esa: EIMServiceAdapter) => Promise<T>;
    private loadWordResource;
    private deleteOldCache;
    private convertPropValue;
    private createCacheFilePath;
}
export declare const getLangResourceController: () => Promise<LangResourceController>;
