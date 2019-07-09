import { ISetAppListAction, LOAD_APP_LIST, SET_APP_LIST } from '../../../account-manager/actions/EimAppListActions';
import appListReducer from '../../../account-manager/reducers/EimAppListReducer';
import { IEimApp } from '../../../account-manager/states/IEimAppListState';

describe('', () => {
    test('init', () => {
        const initState = {
            appList: [],
            loading: false,
        };
        const state = appListReducer(undefined, { type: '' });
        expect(state).toEqual(initState);
    });
    test('SET_APP_LIST', () => {
        const initState = {
            appList: [],
            loading: true,
        };
        const appList: IEimApp[] = [
            {
                appKey: 'app-key',
                appName: 'app-name',
                description: 'desc',
                siteDomain: 'site-domain',
                siteName: 'site-name',
                tokens: ['token'],
            },
        ];
        const action: ISetAppListAction = {
            appList,
            type: SET_APP_LIST,
        };
        const state = appListReducer(initState, action);
        expect(state).toEqual({
            appList,
            loading: false,
        });
    });
    test('LOAD_APP_LIST', () => {
        const initStae = {
            appList: [],
            loading: false,
        };
        const action = { type: LOAD_APP_LIST };
        const state = appListReducer(initStae, action);
        expect(state).toEqual({
            appList: [],
            loading: true,
        });
    });
});
