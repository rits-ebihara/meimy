"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_helper_1 = require("../../redux-helper/redux-helper");
const EimAppListActions_1 = require("../actions/EimAppListActions");
const IEimAppListState_1 = require("../states/IEimAppListState");
const actionToReducerMapper = redux_helper_1.createActionToReducerMapper();
actionToReducerMapper.addWork(EimAppListActions_1.SET_APP_LIST, (state, action) => {
    state.appList = action.appList;
    state.loading = false;
});
actionToReducerMapper.addWork(EimAppListActions_1.LOAD_APP_LIST, (state, _action) => {
    state.loading = true;
});
const appListReducer = (state = IEimAppListState_1.createInitEimAppList(), action) => {
    return actionToReducerMapper.execute(state, action);
};
exports.default = appListReducer;
