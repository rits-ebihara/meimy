"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ACCOUNT_LIST = 'account_list';
const LAST_ACCOUNT = 'last_account';
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
    /*
$color-primary-0: #2F4172;	// Main Primary color
$color-primary-1: #7986AC;
$color-primary-2: #4F608F;
$color-primary-3: #162756;
$color-primary-4: #061439;

$color-secondary-1-0: #AA9839;	// Main Secondary color (1)
$color-secondary-1-1: #FFF1AA;
$color-secondary-1-2: #D4C36A;
$color-secondary-1-3: #806E15;
$color-secondary-1-4: #554700;

$color-secondary-2-0: #AA6E39;	// Main Secondary color (2)
$color-secondary-2-1: #FFD2AA;
$color-secondary-2-2: #D49C6A;
$color-secondary-2-3: #804715;
$color-secondary-2-4: #552800;

    */
    constructor() {
        this._appServiceId = '';
        this._appKeyPrefix = '';
        this._startPage = '';
        this._theme = {};
        this._colorPalets = {
            $colorPrimary0: '#2F4172',
            $colorPrimary1: '#7986AC',
            $colorPrimary2: '#4F608F',
            $colorPrimary3: '#162756',
            $colorPrimary4: '#061439',
            $colorSecondary1p0: '#AA9839',
            $colorSecondary1p1: '#FFF1AA',
            $colorSecondary1p2: '#D4C36A',
            $colorSecondary1p3: '#806E15',
            $colorSecondary1p4: '#554700',
            $colorSecondary2p0: '#AA6E39',
            $colorSecondary2p1: '#FFD2AA',
            $colorSecondary2p2: '#D49C6A',
            $colorSecondary2p3: '#804715',
            $colorSecondary2p4: '#552800',
            $frontColor: '#333',
            $frontDisabledColor: '#999',
            $invertColor: '#fff',
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
exports.getConfig = (userConfig) => {
    return userConfig || exports.config;
};
