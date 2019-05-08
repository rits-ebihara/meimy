import { IColorPalette } from '../IColorPalette';
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
export declare class Config {
    private _appKeyPrefix;
    private _appServiceId;
    private _colorPalets;
    private _theme;
    private _startPage;
    readonly appKeyPrefix: string;
    readonly appServiceId: string;
    readonly colorPalets: IColorPalette;
    readonly startPage: string;
    readonly theme: any;
    readonly accountListServiceName: string;
    readonly lastAccountServiceName: string;
    constructor();
    setConfig(params: ISetConfigParams): void;
}
export declare const config: Config;
export declare const getConfig: (userConfig?: Config | undefined) => Config;
