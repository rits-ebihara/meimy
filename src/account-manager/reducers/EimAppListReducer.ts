import { AnyAction, Reducer } from 'redux';

import { createActionToReducerMapper } from '../../redux-helper/redux-helper';
import { ILoadAppListAction, ISetAppListAction, LOAD_APP_LIST, SET_APP_LIST } from '../actions/EimAppListActions';
import IEimAppList, { createInitEimAppList } from '../states/IEimAppListState';

const actionToReducerMapper = createActionToReducerMapper<IEimAppList>();

actionToReducerMapper.addWork<ISetAppListAction>(
    SET_APP_LIST,
    (state, action) => {
        state.appList = action.appList;
        state.loading = false;
    },
);

actionToReducerMapper.addWork<ILoadAppListAction>(
    LOAD_APP_LIST,
    (state, _action) => {
        state.loading = true;
    },
);

const appListReducer: Reducer<IEimAppList, AnyAction> = (state = createInitEimAppList(), action) => {
    return actionToReducerMapper.execute(state, action);
};

export default appListReducer;
