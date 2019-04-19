import Clone from 'clone';
import { NavigationContainer, NavigationScreenProp, NavigationState } from 'react-navigation';
import {
    createNavigationReducer,
    createReactNavigationReduxMiddleware,
    ReducerState,
} from 'react-navigation-redux-helpers';
import { Action, AnyAction, applyMiddleware, combineReducers, createStore, Dispatch, ReducersMapObject } from 'redux';

export interface IProps<S> {
    state: S;
}

interface INavState {
    key: string;
    params: object;
    routeName: string;
}

interface INavProps {
    navigation: NavigationScreenProp<INavState>;
    dispatch: Dispatch;
}

export interface ICombinedNavProps<S>
    extends IProps<S>,
    INavProps { }

export interface IStateAtNavigation {
    nav: ReducerState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkOfAction<S, A extends Action> = (
    state: S,
    action: A,
) => S | void;

/***
* action に対する reducer の処理を管理する
*/
class ActionToReducerMapper<S> {
    /** アクション・タイプと処理の定義を保持する。 */
    private works: { [actionKey: string]: WorkOfAction<S, AnyAction> } = {};
    /** アクション・タイプと処理の定義を追加する。 */
    public addWork = <A extends AnyAction>(
        actionType: string,
        func: WorkOfAction<S, A>,
    ): void => {
        this.works[actionType] = func as WorkOfAction<S, AnyAction>;
    }
    /*** 処理を実行する。
    * 該当するアクション・タイプがあった場合、state をクローンして指定の処理を行い、返す。
    * 該当するアクション・タイプが無い場合、何も処理を行わず、state もクローンせずにそのまま返す。
    */
    public execute = (state: S, action: Action) => {
        let newState = state;
        const process = this.works[action.type];
        if (!!process) {
            newState = Clone(state);
            const retState = process(newState, action);
            if (!!retState) {
                newState = retState;
            }
        }
        return newState;
    }
}

export const createActionToReducerMapper = <S>() => {
    return new ActionToReducerMapper<S>();
};

export const generateStore = <S>(
    navContainer: NavigationContainer,
    userMapper: ReducersMapObject<S>,
) => {
    type IMixState = S & IStateAtNavigation;
    const navReducer = createNavigationReducer(navContainer);
    const mixReducers = Object.assign(
        { nav: navReducer },
        userMapper,
    );
    const reducer = combineReducers(mixReducers);

    const middleware = createReactNavigationReduxMiddleware(
        (state: S & IStateAtNavigation) => state.nav as NavigationState,
    );
    const store = createStore(reducer, applyMiddleware(middleware));
    if ('' === '') {

    }
    return store;
};
