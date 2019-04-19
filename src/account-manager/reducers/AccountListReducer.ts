import { AnyAction, Reducer } from 'redux';

import { createActionToReducerMapper } from '../../redux-helper/redux-helper';
import {
    ISetAuthState,
    IShowAccountListAction,
    SET_AUTH_STATE,
    SHOW_ACCOUNT_LIST,
} from '../actions/AccountListActions';
import { createInitAccountListState, IAccountListState } from '../states/IAccountLisState';

const actionToReducerMapper = createActionToReducerMapper<IAccountListState>();

actionToReducerMapper.addWork<IShowAccountListAction>(
    SHOW_ACCOUNT_LIST,
    (state, action) => {
        state.accounts = action.accountList.accounts;
    },
);

actionToReducerMapper.addWork<ISetAuthState>(
    SET_AUTH_STATE,
    (state, action) => {
        state.authState = action.authState;
    },
);

const accountListReducer: Reducer<IAccountListState, AnyAction> = (state = createInitAccountListState(), action) => {
    return actionToReducerMapper.execute(state, action);
};

export default accountListReducer;
