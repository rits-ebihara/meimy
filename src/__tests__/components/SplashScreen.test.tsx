import Enzyme, { shallow, ShallowWrapper } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Toast } from 'native-base';
import React from 'react';
import { AppState, Linking } from 'react-native';
import { mocked } from 'ts-jest/utils';

import navigateController from '../../account-manager/actions/NavigateActions';
import { getEimAccount } from '../../account-manager/EimAccount';
import { ISplashState, SplashScreen } from '../../components/SplashScreen';
import { ICombinedNavProps } from '../../redux-helper/redux-helper';
import { sleep } from '../commonFunctions';

Enzyme.configure({ adapter: new EnzymeAdapter() });

Enzyme.configure({ adapter: new EnzymeAdapter() });

const createEimAccount = () => ({
    user: {
        properties: {
            displayName: 'ricoh-00001',
            faceImage: null as string | null,
        },
    },
    getDepartmentName: jest.fn().mockReturnValue('sosiki-full'),
    getServiceAdapter: jest.fn().mockImplementation(() => ({
        validateToken: jest.fn(),
    })),
    clear: jest.fn(),
    save: jest.fn(),
    domain: 'site-domain',
    eimTokens: ['token'],
    loadUser: jest.fn(),
});

jest.mock('../../account-manager/EimAccount', () => ({
    getEimAccount: jest.fn(),
}));

jest.mock('../../account-manager/actions/NavigateActions', () => ({
    openAccountManager: jest.fn(),
}));

jest.mock('native-base', () => ({
    ...jest.requireActual('native-base'),
    Toast: {
        show: jest.fn(),
    }
}));

jest.mock('AppState', () => ({
    addEventListener: jest.fn(),
}));

jest.mock('Linking', () => ({
    getInitialURL: jest.fn().mockResolvedValue(null),
    addEventListener: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
    getVersion: jest.fn().mockReturnValue('1.0.0'),
}));

jest.mock('../../account-manager/Config', () => ({
    getConfig: jest.fn().mockReturnValue({
        startPage: 'start-page',
        theme: {
            brandPrimary: '#009',
            inverseTextColor: '#fff',
        },
    }),
}));

const createProps = () => ({
    state: {
        appName: 'test-app-name',
    },
    navigation: {
        navigate: jest.fn(),
    },
    dispatch: jest.fn(),
});

describe('render', () => {
    test('init', () => {
        const props = createProps();
        const wrapper = shallow(<SplashScreen {...props as any} />, { disableLifecycleMethods: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('event', () => {
    let props: any;
    let wrapper: ShallowWrapper<Readonly<ICombinedNavProps<ISplashState>> & Readonly<{
        children?: React.ReactNode;
    }>, Readonly<{}>, SplashScreen<ISplashState>>;
    let instance: SplashScreen<ISplashState>;
    beforeEach(() => {
        mocked(getEimAccount).mockClear();
        mocked(Toast.show).mockClear();
        mocked(navigateController.openAccountManager).mockClear();
        props = createProps();
        wrapper = shallow<SplashScreen<ISplashState>>(
            <SplashScreen {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();
    });
    test('componentDidMout', async () => {
        instance['linkInitialURL'] = jest.fn();
        await instance.componentDidMount();
        expect(Linking.getInitialURL).toBeCalled();
        expect(Linking.addEventListener).toBeCalledWith('url', instance['urlEvent']);
        expect(AppState.addEventListener).toBeCalledWith(
            'change', instance['reloginAnnounce']);
        expect(instance['linkInitialURL']).toBeCalledWith(null);
    });
    describe('reloginAnnounce', () => {
        test('background', async () => {
            const eimAccount = createEimAccount();
            mocked(getEimAccount).mockReturnValue(eimAccount as any);
            await instance['reloginAnnounce']('background');
            expect(eimAccount.getServiceAdapter().validateToken).not.toBeCalled();
        });
        test('active/invalid token', async () => {
            const eimAccount = createEimAccount();
            mocked(eimAccount.getServiceAdapter).mockReturnValue(({
                validateToken: jest.fn().mockReturnValue(false),
            }));
            mocked(getEimAccount).mockReturnValue(eimAccount as any);
            await instance['reloginAnnounce']('active');
            expect(eimAccount.getServiceAdapter().validateToken).toBeCalled();
            expect(Toast.show).toBeCalledWith({
                text: 'サーバーとの接続が切れました。\n再ログインしてください。'
            });
            expect(navigateController.openAccountManager).toBeCalledWith(
                props.navigation, props.dispatch,
            );
        });
        test('active/valid token', async () => {
            const eimAccount = createEimAccount();
            mocked(eimAccount.getServiceAdapter).mockReturnValue(({
                validateToken: jest.fn().mockReturnValue(true),
            }));
            mocked(getEimAccount).mockReturnValue(eimAccount as any);
            await instance['reloginAnnounce']('active');
            expect(eimAccount.getServiceAdapter().validateToken).toBeCalled();
            expect(Toast.show).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();
        });
    });
    describe('linkInitialURL', () => {
        test('url is null | runOnLink = true', async () => {
            instance['runOnLink'] = false;
            await instance['linkInitialURL'](null);
            await sleep();
            expect(navigateController.openAccountManager).toBeCalledWith(
                props.navigation, props.dispatch
            );
            expect(instance['runOnLink']).toEqual(false);
            // runOnLink = true
            instance['runOnLink'] = true;
            await instance['linkInitialURL']('http://exsample.com/');
            await sleep();
            expect(navigateController.openAccountManager).toBeCalledWith(
                props.navigation, props.dispatch
            );
        });
        test('url is not null && no link || no hash', async () => {
            instance['runOnLink'] = false;
            await instance['linkInitialURL']('http://exsample.com/');
            expect(navigateController.openAccountManager).not.toBeCalled();
            await instance['linkInitialURL']('http://exsample.com/?link=hoge');
            expect(navigateController.openAccountManager).not.toBeCalled();
            await instance['linkInitialURL']('http://exsample.com/?hash=hoge');
            expect(navigateController.openAccountManager).not.toBeCalled();
        });
        test('url is not null && link and hash is not null', async () => {
            instance['runOnLink'] = false;
            await instance['linkInitialURL']('http://exsample.com/?link=hoge&hash=fuga');
            expect(navigateController.openAccountManager).toBeCalledWith(
                props.navigation, props.dispatch,
                'hoge', 'fuga'
            );
        });
    });
    describe('urlEvent', async () => {
        test('call from mail - link, hash with or without', async () => {
            instance['fromAccountManager'] = jest.fn();
            await instance['urlEvent']({ url: 'https://exsample.com/' });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();
            await instance['urlEvent']({ url: 'https://exsample.com/?hash=hoge' });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();
            await instance['urlEvent']({ url: 'https://exsample.com/?link=hoge' });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();
            await instance['urlEvent']({ url: 'https://exsample.com/?hash=hoge&link=fuga' });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).toBeCalledWith(
                props.navigation, props.dispatch, 'fuga', 'hoge'
            );
        });
        test('call from account manager', async () => {
            instance['fromAccountManager'] = jest.fn();
            await instance['urlEvent']({ url: 'https://authed/' });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();

            await instance['urlEvent']({
                url: 'https://authed/?appkey=hoge&link=fuga&siteName=uga&link=quga'
            });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();

            await instance['urlEvent']({
                url: 'https://authed/?domain=hoge&link=fuga&siteName=uga&link=quga'
            });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();

            await instance['urlEvent']({
                url: 'https://authed/?domain=hoge&appkey=fuga&siteName=uga&link=quga'
            });
            expect(instance['fromAccountManager']).not.toBeCalled();
            expect(navigateController.openAccountManager).not.toBeCalled();

            await instance['urlEvent']({
                url: 'https://authed/?domain=hoge&appkey=fuga&token=toga&siteName=uga&link=quga'
            });
            expect(navigateController.openAccountManager).not.toBeCalled();
            expect(instance['fromAccountManager']).toBeCalledWith(
                'toga', 'hoge', 'fuga', 'uga', 'quga'
            );
        });
    });
    describe('fromAccountManager', () => {
        test('no link', async () => {
            const eimAccount = createEimAccount();
            mocked(getEimAccount).mockReturnValue(eimAccount as any);

            await instance['fromAccountManager'](
                'token', 'domain', 'app-key', 'site-name', undefined
            );

        });
    });
});
