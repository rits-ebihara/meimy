import { createActionToReducerMapper } from '../../redux-helper/redux-helper';
import { AnyAction, Reducer } from 'redux';
import { ISetAccountAction, SET_ACCOUNT_ACTION } from '../actions/AccountActions';
import { createInitAccountState, IAccountState } from '../states/IAccountState';

const actionToReducerMapper = createActionToReducerMapper<IAccountState>();

actionToReducerMapper.addWork<ISetAccountAction>(SET_ACCOUNT_ACTION, (_state, action) => {
    return action.account;
});

const accountReducer: Reducer<IAccountState, AnyAction> = (state = createInitAccountState(), action) => {
    return actionToReducerMapper.execute(state, action);
};

export default accountReducer;
