"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const react_navigation_redux_helpers_1 = require("react-navigation-redux-helpers");
const redux_1 = require("redux");
/***
* action に対する reducer の処理を管理する
*/
class ActionToReducerMapper {
    constructor() {
        /** アクション・タイプと処理の定義を保持する。 */
        this.works = {};
        /** アクション・タイプと処理の定義を追加する。 */
        this.addWork = (actionType, func) => {
            this.works[actionType] = func;
        };
        /*** 処理を実行する。
        * 該当するアクション・タイプがあった場合、state をクローンして指定の処理を行い、返す。
        * 該当するアクション・タイプが無い場合、何も処理を行わず、state もクローンせずにそのまま返す。
        */
        this.execute = (state, action) => {
            let newState = state;
            const process = this.works[action.type];
            if (!!process) {
                newState = clone_1.default(state);
                const retState = process(newState, action);
                if (!!retState) {
                    newState = retState;
                }
            }
            return newState;
        };
    }
}
exports.createActionToReducerMapper = () => {
    return new ActionToReducerMapper();
};
exports.generateStore = (navContainer, userMapper) => {
    const navReducer = react_navigation_redux_helpers_1.createNavigationReducer(navContainer);
    const mixReducers = Object.assign({ nav: navReducer }, userMapper);
    const reducer = redux_1.combineReducers(mixReducers);
    const middleware = react_navigation_redux_helpers_1.createReactNavigationReduxMiddleware((state) => state.nav);
    const store = redux_1.createStore(reducer, redux_1.applyMiddleware(middleware));
    if ('' === '') {
    }
    return store;
};
