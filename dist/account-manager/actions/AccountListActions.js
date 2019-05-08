"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_keychain_1 = require("react-native-keychain");
const shortid_1 = __importDefault(require("shortid"));
const Config_1 = require("../Config");
const IAccountLisState_1 = require("../states/IAccountLisState");
const config = Config_1.getConfig();
exports.SHOW_ACCOUNT_LIST = shortid_1.default();
exports.asyncLoadAccountListAfterShow = async (dispatch) => {
    let accountList = IAccountLisState_1.createInitAccountListState();
    const json = await react_native_keychain_1.getGenericPassword({ service: config.accountListServiceName });
    if (!!json && typeof json !== 'boolean') {
        const _accountList = JSON.parse(json.password);
        if (('accounts' in _accountList)) {
            accountList = _accountList;
        }
    }
    const action = {
        accountList,
        type: exports.SHOW_ACCOUNT_LIST,
    };
    dispatch(action);
};
exports.SET_AUTH_STATE = shortid_1.default();
exports.createSetAuthState = (authState) => {
    return {
        authState,
        type: exports.SET_AUTH_STATE,
    };
};
