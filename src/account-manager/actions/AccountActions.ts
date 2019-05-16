import { Alert } from 'react-native';
import { getGenericPassword, setGenericPassword } from 'react-native-keychain';
import { Action, Dispatch } from 'redux';
import { generate as ShortId } from 'shortid';

import { dateParser } from '../../eim-service/EIMServiceAdapter';
import { getConfig } from '../Config';
import { createInitAccountListState, IAccountListState } from '../states/IAccountLisState';
import { IAccountState } from '../states/IAccountState';
import { asyncLoadAccountListAfterShow } from './AccountListActions';

export const SET_ACCOUNT_ACTION = ShortId();

export interface ISetAccountAction extends Action {
    account: IAccountState;
}

export const createSetAccountAction = (account: IAccountState): ISetAccountAction => {
    return {
        account,
        type: SET_ACCOUNT_ACTION,
    };
};

const config = getConfig();

export const asyncSaveAccountAction
    = async (account: IAccountState, dispatch: Dispatch) => {
        try {
            const { siteName, siteDomain, authType, id, eimToken, lastConnect, userId, password } = account;
            // 拡張した他のプロパティが入らないように精査する
            const saveData: IAccountState = {
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
            const json = await getGenericPassword({ service: config.accountListServiceName });
            let accountList: IAccountListState = createInitAccountListState();
            if (!!json && typeof json !== 'boolean') {
                accountList = JSON.parse(json.password, dateParser) as IAccountListState;
            }
            // IDで検索しなければ追加する
            const existIndex = accountList.accounts.findIndex((a) => a.id === id);
            if (existIndex === -1) {
                accountList.accounts.push(saveData);
            } else {
                accountList.accounts[existIndex] = saveData;
            }
            await setGenericPassword('dummy', JSON.stringify(accountList), { service: config.accountListServiceName });
        } catch (error) {
            Alert.alert('error', '保存に失敗しました');
            console.error(error);
        }
        // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
        await asyncLoadAccountListAfterShow(dispatch);
    };

export const REMOVE_ACCOUNT_ACTION = ShortId();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRemoveAccountAction extends Action {
}

export const asyncRemoveAccountAction = async (
    targetId: string, dispatch: Dispatch, onSuccess: () => void) => {
    const save = async () => {
        try {
            // 現在のリストをロード
            const json = await getGenericPassword({ service: config.accountListServiceName });
            let accountList: IAccountListState = createInitAccountListState();
            if (!!json && typeof json !== 'boolean') {
                accountList = JSON.parse(json.password) as IAccountListState;
            } else {
                return;
            }
            accountList.accounts = accountList.accounts.filter((a) => a.id !== targetId);
            await setGenericPassword('dummy', JSON.stringify(accountList), { service: config.accountListServiceName });
        } catch (error) {
            Alert.alert('error', '保存に失敗しました');
            console.error(error);
        }
    };
    await save();
    // ステートを更新して、一覧に戻ったときに画面の表示が新しくなっているようにする
    await asyncLoadAccountListAfterShow(dispatch);
    onSuccess();
};
