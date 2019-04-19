import { createActionToReducerMapper } from '../../redux-helper/redux-helper';
import { AnyAction, Reducer } from 'redux';
import { IShowWebPageAction, SHOW_WEB_PAGE } from '../actions/WebSignInActions';
import IWebSignInState, { createInitWebSignInState } from '../states/IWebSignInState';

const actionToReducerMapper = createActionToReducerMapper<IWebSignInState>();

actionToReducerMapper.addWork<IShowWebPageAction>(
    SHOW_WEB_PAGE,
    (state, action) => {
        state.account = action.account;
    },
);

const webSignInReducer: Reducer<IWebSignInState, AnyAction> = (state = createInitWebSignInState(), action) => {
    return actionToReducerMapper.execute(state, action);
};

export default webSignInReducer;
