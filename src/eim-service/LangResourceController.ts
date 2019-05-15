import path from 'path';
import * as rnfs from 'react-native-fs';

import { EIMServiceAdapter } from './EIMServiceAdapter';
import { ILangResourceStrings } from './ILangResources';

const dirName = 'word_resources';

type LangType = keyof ILangResourceStrings;

export class LangResourceController {
    private cachePath: string;
    public constructor() {
        this.cachePath = path.join(rnfs.CachesDirectoryPath, dirName);
    }
    public getLangWord = async (
        _site: string,
        _appKey: string,
        key: string,
        _lang: LangType,
        esa: EIMServiceAdapter) => {
        const langStrings = await this.loadWordResource(
            _site, _appKey, esa
        );
        const langString = langStrings[_lang];
        const result = langString[key] || key;
        return result;
    }
    public createCacheDir = async () => {
        // キャッシュフォルダに 言語リソース
        const existDir = await rnfs.exists(this.cachePath);
        if (existDir) {
            await rnfs.unlink(this.cachePath);
        }
        await rnfs.mkdir(this.cachePath);
    }
    private loadWordResource = async (_site: string, _appKey: string, _esa: EIMServiceAdapter) => {
        const res: ILangResourceStrings = {
            "de": {},
            "ja": {},
            "en": {},
            "it": {},
            "fr": {},
            "es": {},
            "nl": {}
        };
        return res;
    }
}

let instance: LangResourceController | null = null;

export const getLangResourceController = async () => {
    if (!instance) {
        instance = new LangResourceController();
        await instance.createCacheDir();
    }
    return instance;
};
