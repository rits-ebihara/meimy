"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ACCOUNT_LIST = 'account_list';
const LAST_ACCOUNT = 'last_account';
const MOBILE_APP_KEY = 'decision-form';
class Config {
    get appKeyPrefix() { return this._appKeyPrefix; }
    get appServiceId() { return this._appServiceId; }
    get colorPalets() { return this._colorPalets; }
    get startPage() { return this._startPage; }
    get theme() { return this._theme; }
    get accountListServiceName() {
        return `${this._appServiceId}.${ACCOUNT_LIST}`;
    }
    get lastAccountServiceName() {
        return `${this._appServiceId}.${LAST_ACCOUNT}`;
    }
    get mobileAppKey() { return MOBILE_APP_KEY; }
    constructor() {
        this._appServiceId = '';
        this._appKeyPrefix = '';
        this._startPage = '';
        this._theme = {};
        this._colorPalets = {
            $colorPrimary0: '',
            $colorPrimary1: '',
            $colorPrimary2: '',
            $colorPrimary3: '',
            $colorPrimary4: '',
            $colorSecondary1p0: '',
            $colorSecondary1p1: '',
            $colorSecondary1p2: '',
            $colorSecondary1p3: '',
            $colorSecondary1p4: '',
            $colorSecondary2p0: '',
            $colorSecondary2p1: '',
            $colorSecondary2p2: '',
            $colorSecondary2p3: '',
            $colorSecondary2p4: '',
            $frontColor: '',
            $frontDisabledColor: '',
            $invertColor: '',
        };
    }
    setConfig(params) {
        this._appKeyPrefix = params.appKeyPrefix;
        this._appServiceId = params.appServiceId;
        this._colorPalets = params.colorPalets;
        this._startPage = params.startPage;
        this._theme = params.theme;
    }
}
exports.Config = Config;
exports.config = new Config();
exports.default = exports.config;
