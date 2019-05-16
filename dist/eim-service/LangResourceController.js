"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const rnfs = __importStar(require("react-native-fs"));
const EimAccount_1 = require("../account-manager/EimAccount");
const dirName = 'word_resources';
const getInitLangResource = () => {
    return {
        de: {},
        en: {},
        es: {},
        fr: {},
        it: {},
        ja: {},
        nl: {},
    };
};
class LangResourceController {
    constructor() {
        this.getLangWord = async (site, appKey, key, lang, esa) => {
            const langStrings = await this.loadWordResource(site, appKey, esa);
            const langString = langStrings[lang];
            const result = langString[key] || key;
            return result;
        };
        this.createCacheDir = async () => {
            // キャッシュフォルダに 言語リソースフォルダを作成する
            const existDir = await rnfs.exists(this.cachePath);
            if (existDir) {
                await rnfs.unlink(this.cachePath);
            }
            await rnfs.mkdir(this.cachePath);
        };
        this.loadWordResource = async (site, appKey, esa) => {
            const filePath = this.createCacheFilePath(site, appKey);
            let result;
            try {
                this.deleteOldCache();
                if (await rnfs.exists(filePath)) {
                    // キャッシュにファイルが有る場合、それを返す
                    const data = await rnfs.readFile(filePath);
                    result = JSON.parse(data);
                }
                else {
                    // ファイルがない場合、ロードする
                    const eimAccount = EimAccount_1.getEimAccount();
                    const response = await esa.getLangResource(eimAccount.eimTokens, appKey);
                    result = response.strings;
                    // キャッシュに保存する
                    await rnfs.writeFile(filePath, JSON.stringify(result));
                }
            }
            catch (e) {
                console.warn(e);
                // エラーが発生した場合は初期値
                result = getInitLangResource();
            }
            return result;
        };
        this.deleteOldCache = async () => {
            const mDate = moment_1.default(new Date());
            mDate.add(-12, 'hours');
            const files = await rnfs.readDir(this.cachePath);
            const asyncAll = [];
            files.filter((item) => (item.mtime || new Date(0)) < mDate.toDate())
                .forEach((item) => {
                asyncAll.push(rnfs.unlink(item.path));
            });
            await Promise.all(asyncAll);
        };
        this.cachePath = `${rnfs.CachesDirectoryPath}/${dirName}`;
    }
    createCacheFilePath(site, appKey) {
        return `${this.cachePath}/${site}_${appKey}.json`;
    }
}
exports.LangResourceController = LangResourceController;
let instance = null;
exports.getLangResourceController = async () => {
    if (!instance) {
        instance = new LangResourceController();
        await instance.createCacheDir();
    }
    return instance;
};
