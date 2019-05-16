import moment from 'moment';
import * as rnfs from 'react-native-fs';

import { getEimAccount } from '../account-manager/EimAccount';
import { EIMServiceAdapter } from './EIMServiceAdapter';
import { ILangResourceStrings } from './ILangResources';

const dirName = 'word_resources';

type LangType = keyof ILangResourceStrings;

const getInitLangResource = (): ILangResourceStrings => {
    return {
        de: {},
        en: {},
        es: {},
        fr: {},
        it: {},
        ja: {},
        nl: {},
    }
};

export class LangResourceController {
    private cachePath: string;
    public constructor() {
        this.cachePath = `${rnfs.CachesDirectoryPath}/${dirName}`;
    }
    public getLangWord = async (
        site: string,
        appKey: string,
        key: string,
        lang: LangType,
        esa: EIMServiceAdapter) => {
        const langStrings = await this.loadWordResource(
            site, appKey, esa
        );
        const langString = langStrings[lang];
        const result = langString[key] || key;
        return result;
    }
    public createCacheDir = async () => {
        // キャッシュフォルダに 言語リソースフォルダを作成する
        const existDir = await rnfs.exists(this.cachePath);
        if (existDir) {
            await rnfs.unlink(this.cachePath);
        }
        await rnfs.mkdir(this.cachePath);
    }
    private loadWordResource = async (site: string, appKey: string, esa: EIMServiceAdapter) => {
        const filePath = this.createCacheFilePath(site, appKey);
        let result: ILangResourceStrings;
        try {
            this.deleteOldCache();
            if (await rnfs.exists(filePath)) {
                // キャッシュにファイルが有る場合、それを返す
                const data = await rnfs.readFile(filePath);
                result = JSON.parse(data) as ILangResourceStrings
            } else {
                // ファイルがない場合、ロードする
                const eimAccount = getEimAccount();
                const response = await esa.getLangResource(eimAccount.eimTokens, appKey);
                result = response.strings;
                // キャッシュに保存する
                await rnfs.writeFile(filePath, JSON.stringify(result));
            }
        } catch (e) {
            console.warn(e);
            // エラーが発生した場合は初期値
            result = getInitLangResource();
        }
        return result;
    }

    private deleteOldCache = async () => {
        const mDate = moment(new Date());
        mDate.add(-12, 'hours');
        const files = await rnfs.readDir(this.cachePath);
        const asyncAll: Promise<void>[] = [];
        files.filter((item) => (item.mtime || new Date(0)) < mDate.toDate())
            .forEach((item) => {
                asyncAll.push(rnfs.unlink(item.path));
            });
        await Promise.all(asyncAll);
    }

    private createCacheFilePath(site: string, appKey: string) {
        return `${this.cachePath}/${site}_${appKey}.json`;
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
