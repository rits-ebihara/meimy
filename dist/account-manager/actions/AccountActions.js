"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_keychain_1 = require("react-native-keychain");
const shortid_1 = require("shortid");
const Config_1 = __importDefault(require("../Config"));
const IAccountLisState_1 = require("../states/IAccountLisState");
const AccountListActions_1 = require("./AccountListActions");
exports.SET_ACCOUNT_ACTION = shortid_1.generate();
exports.createSetAccountAction = (account) => {
    return {
        account,
        type: exports.SET_ACCOUNT_ACTION,
    };
};
exports.SAVE_ACCOUNT_ACTION = shortid_1.generate();
exports.asyncSaveAccountAction = async (account, dispatch) => {
    try {
        const { siteName, siteDomain, authType, id, eimToken, lastConnect, userId, password } = account;
        // 拡張した他のプロパティが入らないように精査する
        const saveData = {
            authType,
            eimToken,
            id,
            lastConnect,
            password,
            siteDomain,
            siteName,
            userId,
        };
        // 現在のリストをロード
        const json = await react_native_keychain_1.getGenericPassword({ service: Config_1.default.accountListServiceName });
        let accountList = IAccountLisState_1.createInitAccountListState();
        if (!!json && typeof json !== 'boolean') {
            accountList = JSON.parse(json.password);
        }
        // IDで検索しなければ追加する
        const existIndex = accountList.accounts.findIndex((a) => a.id === id);
        if (existIndex === -1) {
            accountList.accounts.push(saveData);
        }
        else {
            accountList.accounts[existIndex] = saveData;
        }
        await react_native_keychain_1.setGenericPassword('dummy', JSON.stringify(accountList), { service: Config_1.default.accountListServiceName });
    }
    catch (error) {
        react_native_1.Alert.alert('error', '保存に失敗しました');
        console.error(error);
    }
    // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
    await AccountListActions_1.asyncLoadAccountListAfterShow(dispatch);
};
exports.REMOVE_ACCOUNT_ACTION = shortid_1.generate();
exports.asyncRemoveAccountAction = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
targetId, nav, dispatch) => {
    try {
        // 現在のリストをロード
        const json = await react_native_keychain_1.getGenericPassword({ service: Config_1.default.accountListServiceName });
        let accountList = IAccountLisState_1.createInitAccountListState();
        if (!!json && typeof json !== 'boolean') {
            accountList = JSON.parse(json.password);
        }
        accountList.accounts = accountList.accounts.filter((a) => a.id !== targetId);
        await react_native_keychain_1.setGenericPassword('dummy', JSON.stringify(accountList), { service: Config_1.default.accountListServiceName });
    }
    catch (error) {
        react_native_1.Alert.alert('error', '保存に失敗しました');
        console.error(error);
    }
    // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
    await AccountListActions_1.asyncLoadAccountListAfterShow(dispatch);
    nav.pop();
};
