/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Toast } from 'native-base';
import React from 'react';
import Cookies from 'react-native-cookies';
import { mocked } from 'ts-jest/utils';

import { asyncSaveAccountAction } from '../../../../src/account-manager/actions/AccountActions';
import { IAccountState } from '../../../../src/account-manager/states/IAccountState';
import {
    __private__,
    _WebSignIn as WebSignIn,
    ILocalState,
    ThisProps,
} from '../../../../src/account-manager/views/containers/WebSignIn';

Enzyme.configure({ adapter: new EnzymeAdapter() });

// const config = getConfig();

jest.mock('native-base', () => ({
    ...jest.requireActual('native-base'),
    Toast: {
        show: jest.fn().mockReturnValue({}),
    },
}));

jest.mock('react-native-cookies', () => ({
    clearAll: jest.fn(),
    get: jest.fn(async () => { return {}; }),
}));

jest.mock('../../../../src/account-manager/actions/AccountActions', () => ({
    asyncSaveAccountAction: jest.fn(async () => { }),
}));

jest.mock('../../../../src/account-manager/actions/NavigateActions', () => ({
    navigateForLink: jest.fn(),
}));

const createWebView = () => ({
    stopLoading: jest.fn(),
});

const createProps = (): ThisProps => {
    return {
        dispatch: jest.fn(),
        navigation: {
            pop: jest.fn(),
        } as any,
        state: {
            accountListState: {
                accounts: [],
                authState: {
                },
            },
            account: {
                authType: 'password',
                eimToken: [],
                id: 'site001',
                lastConnect: null,
                password: 'pass001',
                siteDomain: 'site-domain',
                siteName: 'site-name',
                userId: 'user001',
            },
        },
    };
};

describe('init', () => {
    test('auth type: password', () => {
        const wrapper = shallow<WebSignIn>(<WebSignIn {...createProps()} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        const state = wrapper.state();
        expect(state.uriSource).toEqual({ uri: 'https://site-domain/services/login' })
    });
    test('auth type: o365', () => {
        const props = createProps();
        props.state.account!.authType = 'o365';
        const wrapper = shallow<WebSignIn>(<WebSignIn {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        const state = wrapper.state();
        expect(state.uriSource).toEqual({ uri: 'https://site-domain' })
    });
    test('no account', () => {
        const props = createProps();
        props.state.account = undefined;
        const wrapper = shallow<WebSignIn>(<WebSignIn {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        const state = wrapper.state();
        expect(state.uriSource).toEqual({ uri: 'https://' })
    });
});

describe('events', () => {
    let wrapper: Enzyme.ShallowWrapper<ThisProps, ILocalState, WebSignIn>;
    let instance: WebSignIn;
    let props: ThisProps;
    let account: IAccountState;
    beforeEach(() => {
        props = createProps();
        wrapper = shallow(<WebSignIn {...props} />);
        instance = wrapper.instance();
        account = props.state.account!;
    });
    test('onMessage', () => {
        instance['onMessage']({
            nativeEvent: {
                data: '{"userId": "user-id", "password": "pass-word"}'
            },
        } as any);
        const account = props.state.account!;
        account.userId = 'user-id';
        account.password = 'pass-word';
        expect(asyncSaveAccountAction).toBeCalledWith(account, props.dispatch);
    });
    test('set ref', () => {
        const dummy = createWebView();
        instance['setRef'](dummy as any);
        expect(instance['webview']).toEqual(dummy);
    });
    describe('postIdPassEimForm', () => {
        test('url is not applicable', () => {
            const result = instance['postIdPassEimForm']('https://exsample.com/', account);
            expect(result).toBeFalsy();
        });
        test('userid no set', () => {
            // ユーザー パスワードが指定されていない
            account.userId = undefined;
            expect(instance['postedIdPass']).toBeFalsy();
            const result = instance['postIdPassEimForm']('https://exsample.com/services/login', account);
            expect(result).toBeFalsy();
            expect(instance['postedIdPass']).toBeTruthy();
        });
        test('password id no set', () => {
            // パスワードが設定されていない
            account.password = undefined;
            expect(instance['postedIdPass']).toBeFalsy();
            const result = instance['postIdPassEimForm']('https://exsample.com/services/login', account);
            expect(result).toBeFalsy();
            expect(instance['postedIdPass']).toBeTruthy();
        });
        test('success', () => {
            account.userId = 'user%001';
            account.password = 'p@ssword';
            expect(instance['postedIdPass']).toBeFalsy();
            const result = instance['postIdPassEimForm']('https://exsample.com/services/login', account);
            expect(result).toBeTruthy();
            expect(instance['postedIdPass']).toBeTruthy();
            const state = wrapper.state();
            expect(state.uriSource).toEqual({
                body: 'userName=user%25001&password=p%40ssword',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                method: 'POST',
                uri: 'https://exsample.com/services/v1/login',
            });
            // 次回以降は実行されない
            const result2 = instance['postIdPassEimForm']('https://exsample.com/services/login', account);
            expect(result2).toBeFalsy();
        });
    });
    describe('postIdPassFor365', () => {
        //https://adfs.jp.ricoh.com/adfs/ls/
        test('url is not applicable', () => {
            const result = instance['postIdPassFor365'](
                'https://exsample.com/', account);
            expect(result).toBeFalsy();
        });
        test('userid no set', () => {
            expect(instance['postedIdPass']).toBeFalsy();
            account.userId = undefined;
            const result = instance['postIdPassFor365'](
                'https://adfs.jp.ricoh.com/adfs/ls/', account);
            expect(result).toBeFalsy();
            expect(instance['postedIdPass']).toBeTruthy();
        });
        test('password no set', () => {
            expect(instance['postedIdPass']).toBeFalsy();
            account.password = undefined;
            const result = instance['postIdPassFor365'](
                'https://adfs.jp.ricoh.com/adfs/ls/', account);
            expect(result).toBeFalsy();
            expect(instance['postedIdPass']).toBeTruthy();
        });
        test('success', () => {
            expect(instance['postedIdPass']).toBeFalsy();
            account.userId = 'user%001';
            account.password = 'p@ssword';
            const result = instance['postIdPassFor365'](
                'https://adfs.jp.ricoh.com/adfs/ls/', account);
            expect(result).toBeTruthy();
            expect(instance['postedIdPass']).toBeTruthy();
            const state = wrapper.state();
            expect(state.uriSource).toEqual({
                body: 'AuthMethod=FormsAuthentication' +
                    '&UserName=user%25001&Password=p%40ssword',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                method: 'POST',
                uri: 'https://adfs.jp.ricoh.com/adfs/ls/',
            });
            // 2回目は実施しない
            const result2 = instance['postIdPassFor365'](
                'https://adfs.jp.ricoh.com/adfs/ls/', account);
            expect(result2).toBeFalsy();
        });
    });
    describe('onLoadStartWebView', () => {
        beforeEach(() => {
            mocked(Cookies.get as jest.Mock).mockClear();
            mocked(Toast.show).mockClear();
            mocked(asyncSaveAccountAction).mockClear();
            instance['postIdPassEimForm'] = jest.fn().mockReturnValue(true);
            instance['postIdPassFor365'] = jest.fn().mockReturnValue(true);
            instance['webview'] = { stopLoading: jest.fn() } as any;
            wrapper.update();
        });
        test('no url', async () => {
            const dummyNavEvent = {
                nativeEvent: {
                    url: undefined
                },
            };
            await instance['onLoadStartWebView'](dummyNavEvent as any);
            expect(instance['postIdPassFor365']).not.toBeCalled();
            expect(instance['postIdPassEimForm']).not.toBeCalled();
            expect(instance['webview']!.stopLoading).not.toBeCalled();
        });

        test('auth o365', async () => {
            instance['saveProp']!.state.account!.authType = 'o365';
            wrapper.update();
            const dummyNavEvent = {
                nativeEvent: {
                    url: 'https://exsample.com/'
                },
            };
            await instance['onLoadStartWebView'](dummyNavEvent as any);
            expect(instance['postIdPassFor365']).toBeCalled();
            expect(instance['postIdPassEimForm']).not.toBeCalled();
            expect(instance['webview']!.stopLoading).toBeCalled();
        });

        test('auth password', async () => {
            instance['saveProp']!.state.account!.authType = 'password';
            wrapper.update();
            const dummyNavEvent = {
                nativeEvent: {
                    url: 'https://exsample.com/'
                },
            };
            await instance['onLoadStartWebView'](dummyNavEvent as any);
            expect(instance['postIdPassFor365']).not.toBeCalled();
            expect(instance['postIdPassEimForm']).toBeCalled();
            expect(instance['webview']!.stopLoading).toBeCalled();
        });

        test('no auto auth to success - password', async () => {
            instance['saveProp']!.state.account!.authType = 'password';
            instance['postIdPassEimForm'] = jest.fn().mockReturnValue(false);
            mocked(Cookies.get as jest.Mock).mockImplementation(async () => {
                return { APISID: 'got_token' };
            });
            wrapper.update();
            const dummyNavEvent = {
                nativeEvent: {
                    url: 'https://exsample.com/'
                },
            };
            await instance['onLoadStartWebView'](dummyNavEvent as any);
            expect(instance['postIdPassFor365']).not.toBeCalled();
            expect(instance['webview']!.stopLoading).toBeCalled();
            expect(Toast.show).toBeCalledWith({
                text: '認証に成功しました。',
                type: 'success',
            });
            const account = instance['saveProp']!.state.account!;
            expect(account.eimToken).toEqual(['APISID=got_token']);
            expect(asyncSaveAccountAction).toBeCalledWith(
                account, props.dispatch);
        });

        test('no auto auth to get not token - o365', async () => {
            instance['saveProp']!.state.account!.authType = 'o365';
            instance['postIdPassFor365'] = jest.fn().mockReturnValue(false);
            mocked(Cookies.get as jest.Mock).mockImplementation(async () => {
                return {};
            });
            wrapper.update();
            const dummyNavEvent = {
                nativeEvent: {
                    url: 'https://exsample.com/'
                },
            };
            await instance['onLoadStartWebView'](dummyNavEvent as any);
            expect(instance['postIdPassEimForm']).not.toBeCalled();
            expect(instance['webview']!.stopLoading).not.toBeCalled();
            expect(Toast.show).not.toBeCalled();
            expect(asyncSaveAccountAction).not.toBeCalled();
        });
    })
});


describe('navigationOptions', () => {
    test('', () => {
        const options = WebSignIn.navigationOptions();
        expect(options).toEqual({
            headerStyle: {
                backgroundColor: '#162756',
            },
            headerTintColor: '#fff',
            headerTitle: '',
        });
    })
});

describe('mapStateToProps', () => {
    test('', () => {
        const state = createProps().state;
        const result = __private__.mapStateToProps({
            webSignIn: { account: state.account },
            accountList: state.accountListState,
        } as any);
        expect(result).toStrictEqual({
            state,
        });
    });
});
