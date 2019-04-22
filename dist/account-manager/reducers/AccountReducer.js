"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_helper_1 = require("../../redux-helper/redux-helper");
const AccountActions_1 = require("../actions/AccountActions");
const IAccountState_1 = require("../states/IAccountState");
const actionToReducerMapper = redux_helper_1.createActionToReducerMapper();
actionToReducerMapper.addWork(AccountActions_1.SET_ACCOUNT_ACTION, (_state, action) => {
    return action.account;
});
const accountReducer = (state = IAccountState_1.createInitAccountState(), action) => {
    return actionToReducerMapper.execute(state, action);
};
exports.default = accountReducer;
