"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortid_1 = __importDefault(require("shortid"));
const EIMServiceAdapter_1 = require("../../eim-service/EIMServiceAdapter");
exports.SET_APP_LIST = shortid_1.default();
exports.createSetAppListAction = (appList) => {
    return {
        appList,
        type: exports.SET_APP_LIST,
    };
};
exports.LOAD_APP_LIST = shortid_1.default();
exports.createLoadAppListAction = async (dispatch, navigateActions, onError) => {
    const { siteDomain, siteName, tokens, appKeyPrefix } = navigateActions.getLinkState();
    if (!siteDomain || !tokens || !appKeyPrefix) {
        return;
    }
    dispatch({
        type: exports.LOAD_APP_LIST,
    });
    // アプリ一覧の取得
    await (async () => {
        const sa = new EIMServiceAdapter_1.EIMServiceAdapter(siteDomain);
        try {
            const response = await sa.getAppList(tokens);
            const responseObj = JSON.parse(response.body);
            const appList = responseObj.apps
                .filter((a) => a.properties.id.startsWith(appKeyPrefix))
                .map((sourceApp) => {
                const { properties } = sourceApp;
                return {
                    appKey: properties.id,
                    appName: properties.name,
                    description: properties.description,
                    siteDomain,
                    siteName: siteName || siteDomain,
                    tokens,
                };
            });
            dispatch(exports.createSetAppListAction(appList));
        }
        catch (e) {
            console.error(e);
            onError();
        }
    })();
};
