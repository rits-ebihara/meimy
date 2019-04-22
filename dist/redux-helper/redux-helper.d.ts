import { NavigationContainer, NavigationScreenProp } from 'react-navigation';
import { ReducerState } from 'react-navigation-redux-helpers';
import { Action, AnyAction, Dispatch, ReducersMapObject } from 'redux';
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
export interface ICombinedNavProps<S> extends IProps<S>, INavProps {
}
export interface IStateAtNavigation {
    nav: ReducerState;
}
declare type WorkOfAction<S, A extends Action> = (state: S, action: A) => S | void;
/***
* action に対する reducer の処理を管理する
*/
declare class ActionToReducerMapper<S> {
    /** アクション・タイプと処理の定義を保持する。 */
    private works;
    /** アクション・タイプと処理の定義を追加する。 */
    addWork: <A extends AnyAction>(actionType: string, func: WorkOfAction<S, A>) => void;
    /*** 処理を実行する。
    * 該当するアクション・タイプがあった場合、state をクローンして指定の処理を行い、返す。
    * 該当するアクション・タイプが無い場合、何も処理を行わず、state もクローンせずにそのまま返す。
    */
    execute: (state: S, action: Action<any>) => S;
}
export declare const createActionToReducerMapper: <S>() => ActionToReducerMapper<S>;
export declare const generateStore: <S>(navContainer: NavigationContainer, userMapper: ReducersMapObject<S, Action<any>>) => import("redux").Store<{
    nav: any;
}, AnyAction> & {
    dispatch: {};
};
export {};
