import { EIMServiceAdapter } from './EIMServiceAdapter';
export declare class LangResourceController {
    private cachePath;
    constructor();
    getLangWord: (site: string, appKey: string, key: string, lang: "de" | "ja" | "en" | "it" | "fr" | "es" | "nl", esa: EIMServiceAdapter) => Promise<string>;
    createCacheDir: () => Promise<void>;
    private loadWordResource;
    private deleteOldCache;
    private createCacheFilePath;
}
export declare const getLangResourceController: () => Promise<LangResourceController>;
