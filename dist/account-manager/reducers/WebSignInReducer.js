"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_helper_1 = require("../../redux-helper/redux-helper");
const WebSignInActions_1 = require("../actions/WebSignInActions");
const IWebSignInState_1 = require("../states/IWebSignInState");
const actionToReducerMapper = redux_helper_1.createActionToReducerMapper();
actionToReducerMapper.addWork(WebSignInActions_1.SHOW_WEB_PAGE, (state, action) => {
    state.account = action.account;
});
const webSignInReducer = (state = IWebSignInState_1.createInitWebSignInState(), action) => {
    return actionToReducerMapper.execute(state, action);
};
exports.default = webSignInReducer;
