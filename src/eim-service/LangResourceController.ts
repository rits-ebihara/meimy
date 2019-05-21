import clone from 'clone';
import moment from 'moment';
import objectPath from 'object-path';
import * as rnfs from 'react-native-fs';

import { IDoc } from '../../src/eim-service/EIMDocInterface';
import { getEimAccount } from '../account-manager/EimAccount';
import { IDocModelProperty } from './EIMDocInterface';
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
    private memoryCache?: {
        site: string;
        appKey: string;
        data: ILangResourceStrings;
    };

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

    public convertDocLabel = async <T extends object>(
        site: string,
        appKey: string,
        source: IDoc<T>,
        lang: LangType,
        esa: EIMServiceAdapter): Promise<T> => {
        const cloneDoc = clone(source.document.properties);
        const langStrings = await this.loadWordResource(
            site, appKey, esa
        );
        const propertyTypes = source.form.documentModel.propertyType;
        const scanDefs = (obj: object, properties: IDocModelProperty[], parentPropPath = '') => {
            // ラベル設定してあるプロパティを変換する
            this.convertPropValue<T>(properties, parentPropPath, obj, langStrings, lang, cloneDoc);
            // 独自型を掘り下げる
            properties
                .forEach(item => {
                    if (!propertyTypes) { return; }
                    const propType = propertyTypes.find(i => i.name === item.type);
                    if (!propType) { return; }
                    const myPropPath =
                        ((!!parentPropPath) ? parentPropPath + '.' : '')
                        + item.name;
                    const childObj = objectPath.get<object | null>(obj, item.name, null);
                    if (!childObj) { return; }
                    if (Array.isArray(childObj)) {
                        childObj.forEach((arrayObj, i) => {
                            scanDefs(arrayObj, propType.properties, `${myPropPath}.${i}`);
                        });
                    } else {
                        scanDefs(childObj, propType.properties, myPropPath);
                    }
                });
        };
        const sourceProp = source.document.properties;
        const props = source.form.documentModel.documentModelProperties;

        scanDefs(sourceProp, props);
        return cloneDoc;
    }

    private loadWordResource = async (site: string, appKey: string, esa: EIMServiceAdapter) => {
        const filePath = this.createCacheFilePath(site, appKey);
        let result: ILangResourceStrings;
        const { memoryCache } = this;
        if (!!memoryCache &&
            memoryCache.site === site && memoryCache.appKey === appKey) {
            return memoryCache.data;
        }
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
            // メモリキャッシュに格納する
            this.memoryCache = {
                site,
                appKey,
                data: result,
            };
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

    private convertPropValue = <T extends object>(
        properties: IDocModelProperty[], parentPropPath: string, obj: object,
        langStrings: ILangResourceStrings, lang: LangType, cloneDoc: T) => {
        properties
            .filter(item => item.label === true && item.type === 'string')
            .forEach(item => {
                const myPropPath = ((!!parentPropPath) ? parentPropPath + '.' : '')
                    + item.name;
                const value = objectPath.get<string>(obj, item.name, '');
                if (!!value) {
                    const convertedValue = langStrings[lang][value] || value;
                    objectPath.set(cloneDoc, myPropPath, convertedValue);
                }
            });
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
