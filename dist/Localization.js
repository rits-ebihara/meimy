"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_localization_1 = __importDefault(require("react-native-localization"));
const getInitLangResource = () => ({
    de: {},
    en: {},
    es: {},
    fr: {},
    it: {},
    ja: {},
    nl: {},
});
class Localization {
    constructor() {
        this.replaceLang = (key, ...restparam) => {
            // 可変長引数が存在する場合、その引数のリプレイスを行う。
            return (this.langList[key] || key).replace(/\{(\d+)\}/g, (...args) => {
                return restparam[args[1]];
            });
        };
        this.langList = new react_native_localization_1.default(getInitLangResource());
    }
    setLangList(langList) {
        this.langList = langList;
    }
}
exports.createLocalization = (langResource = getInitLangResource()) => {
    const localization = new Localization();
    localization.setLangList(new react_native_localization_1.default(langResource));
    return localization;
};
