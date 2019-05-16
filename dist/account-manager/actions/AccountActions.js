"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_keychain_1 = require("react-native-keychain");
const shortid_1 = require("shortid");
const EIMServiceAdapter_1 = require("../../eim-service/EIMServiceAdapter");
const Config_1 = require("../Config");
const IAccountLisState_1 = require("../states/IAccountLisState");
const AccountListActions_1 = require("./AccountListActions");
exports.SET_ACCOUNT_ACTION = shortid_1.generate();
exports.createSetAccountAction = (account) => {
    return {
        account,
        type: exports.SET_ACCOUNT_ACTION,
    };
};
const config = Config_1.getConfig();
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
        const json = await react_native_keychain_1.getGenericPassword({ service: config.accountListServiceName });
        let accountList = IAccountLisState_1.createInitAccountListState();
        if (!!json && typeof json !== 'boolean') {
            accountList = JSON.parse(json.password, EIMServiceAdapter_1.dateParser);
        }
        // IDで検索しなければ追加する
        const existIndex = accountList.accounts.findIndex((a) => a.id === id);
        if (existIndex === -1) {
            accountList.accounts.push(saveData);
        }
        else {
            accountList.accounts[existIndex] = saveData;
        }
        await react_native_keychain_1.setGenericPassword('dummy', JSON.stringify(accountList), { service: config.accountListServiceName });
    }
    catch (error) {
        react_native_1.Alert.alert('error', '保存に失敗しました');
        console.error(error);
    }
    // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
    await AccountListActions_1.asyncLoadAccountListAfterShow(dispatch);
};
exports.REMOVE_ACCOUNT_ACTION = shortid_1.generate();
exports.asyncRemoveAccountAction = async (targetId, dispatch, onSuccess) => {
    const save = async () => {
        try {
            // 現在のリストをロード
            const json = await react_native_keychain_1.getGenericPassword({ service: config.accountListServiceName });
            let accountList = IAccountLisState_1.createInitAccountListState();
            if (!!json && typeof json !== 'boolean') {
                accountList = JSON.parse(json.password);
            }
            else {
                return;
            }
            accountList.accounts = accountList.accounts.filter((a) => a.id !== targetId);
            await react_native_keychain_1.setGenericPassword('dummy', JSON.stringify(accountList), { service: config.accountListServiceName });
        }
        catch (error) {
            react_native_1.Alert.alert('error', '保存に失敗しました');
            console.error(error);
        }
    };
    await save();
    // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
    await AccountListActions_1.asyncLoadAccountListAfterShow(dispatch);
    onSuccess();
};
