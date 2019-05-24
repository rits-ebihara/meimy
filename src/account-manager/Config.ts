/* eslint-disable @typescript-eslint/no-explicit-any */
import { IColorPalette } from '../IColorPalette';

const ACCOUNT_LIST = 'account_list';
const LAST_ACCOUNT = 'last_account';

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
    public constructor() {
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
