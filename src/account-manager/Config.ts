/* eslint-disable @typescript-eslint/no-explicit-any */
import { IColorPalette } from '../IColorPalette';

const ACCOUNT_LIST = 'account_list';
const LAST_ACCOUNT = 'last_account';
const MOBILE_APP_KEY = 'decision-form';

/**
 * Configを設定するときの引数の型
 */
export interface ISetConfigParams {
    /**
     * モバイルアプリを一意に判別するID
     * @example 'jp.co.ricoh.jrits.eim.decisionformat'
     */
    appServiceId: string;
    /**
     * EIMアプリキーのプレフィックス
     * @description アプリ一覧画面で、ここで指定した文字列で始まるキーのアプリを表示する
     * @example 'DWS'
     */
    appKeyPrefix: string;
    /**
     * カラーパレット
     * @description http://paletton.com で作成した配色を指定します。Triad(3-colors)のみ使用可能。
     */
    colorPalets: IColorPalette;
    /**
     * 認証が終わった後のアプリのページ名
     * @description React Navigation でのページ名を指定します。
     */
    startPage: string;
    /**
     * Native Baseのテーマ
     * @description ```node node_modules/native-base/ejectTheme.js``` で出力したテーマを指定します。
     * 詳しくは、https://qiita.com/keneo/items/a03d8f28ceb584bc3ff6 を参照
     */
    theme: any;
}

export class Config {
    private _appKeyPrefix: string;
    private _appServiceId: string;
    private _colorPalets: IColorPalette;
    private _theme: any;
    private _startPage: string;
    public get appKeyPrefix() { return this._appKeyPrefix; }
    public get appServiceId() { return this._appServiceId; }
    public get colorPalets() { return this._colorPalets; }
    public get startPage() { return this._startPage; }
    public get theme() { return this._theme; }
    public get accountListServiceName() {
        return `${this._appServiceId}.${ACCOUNT_LIST}`;
    }
    public get lastAccountServiceName() {
        return `${this._appServiceId}.${LAST_ACCOUNT}`;
    }
    public get mobileAppKey() { return MOBILE_APP_KEY; }
    public constructor() {
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
    public setConfig(params: ISetConfigParams) {
        this._appKeyPrefix = params.appKeyPrefix;
        this._appServiceId = params.appServiceId;
        this._colorPalets = params.colorPalets;
        this._startPage = params.startPage;
        this._theme = params.theme;
    }
}

export const config = new Config();
export const getConfig = (userConfig?: Config) => {
    return userConfig || config;
};
