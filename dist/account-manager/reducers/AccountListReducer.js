"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_helper_1 = require("../../redux-helper/redux-helper");
const AccountListActions_1 = require("../actions/AccountListActions");
const IAccountLisState_1 = require("../states/IAccountLisState");
const actionToReducerMapper = redux_helper_1.createActionToReducerMapper();
actionToReducerMapper.addWork(AccountListActions_1.SHOW_ACCOUNT_LIST, (state, action) => {
    state.accounts = action.accountList.accounts;
});
actionToReducerMapper.addWork(AccountListActions_1.SET_AUTH_STATE, (state, action) => {
    state.authState = action.authState;
});
const accountListReducer = (state = IAccountLisState_1.createInitAccountListState(), action) => {
    return actionToReducerMapper.execute(state, action);
};
exports.default = accountListReducer;
