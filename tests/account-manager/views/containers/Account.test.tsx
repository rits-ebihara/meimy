import clone from 'clone';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Toast } from 'native-base';
import React from 'react';
import { Alert, Platform, PlatformOSType } from 'react-native';
import { mocked } from 'ts-jest/utils';

import {
    asyncRemoveAccountAction,
    asyncSaveAccountAction,
} from '../../../../src/account-manager/actions/AccountActions';
import navigateController from '../../../../src/account-manager/actions/NavigateActions';
import { AuthType } from '../../../../src/account-manager/states/IAccountState';
import {
    __private__,
    _Account,
    IAccountLocaleState,
    IAccountProps,
} from '../../../../src/account-manager/views/containers/Account';
import { EIMServiceAdapter } from '../../../../src/eim-service/EIMServiceAdapter';
import { ICombinedNavProps } from '../../../../src/redux-helper/redux-helper';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('Alert', () => {
    return {
        alert: jest.fn(),
    };
});

jest.mock('../../../../src/account-manager/actions/AccountActions');

jest.mock('../../../../src/eim-service/EIMServiceAdapter.ts', () => {
    return {
        EIMServiceAdapter: jest.fn(() => {
            return {
                validateToken: jest.fn(),
            };
        }),
    };
});

jest.mock('native-base', () => ({
    ...jest.requireActual('native-base'),
    Toast: {
        show: jest.fn(),
    }
}));

jest.mock('shortid', () => () => 'abc');

jest.mock('../../../../src/account-manager/actions/NavigateActions.ts');

const getProps = (): ICombinedNavProps<IAccountProps> => {
    return {
        navigation: {
            setParams: jest.fn(),
            pop: jest.fn(),
            navigate: jest.fn(),
        } as any,
        dispatch: jest.fn(),
        state: {
            authType: 'password' as AuthType,
            eimToken: [],
            id: '',
            lastConnect: null,
            siteDomain: '',
            siteName: '',
            accountListState: {
                accounts: [],
                authState: {},
            },
        }
    };
};
let props: ICombinedNavProps<IAccountProps>;
describe('init', () => {
    const platformOS: PlatformOSType = Platform.OS;
    beforeEach(() => {
        props = getProps();
        Platform.OS = platformOS;
    });
    test('new account', () => {
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.contains('サイトドメインが正しくありません')).toBeTruthy();
        expect(wrapper.contains('サイト名称は必須です')).toBeTruthy();
        expect(wrapper.contains('サインイン')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="md-checkmark"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="close"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="create"]')).toBeFalsy();
    });
    test('new account for android', () => {
        Platform.OS = 'android';
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.contains('サイトドメインが正しくありません')).toBeTruthy();
        expect(wrapper.contains('サイト名称は必須です')).toBeTruthy();
        expect(wrapper.contains('サインイン')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="md-checkmark"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="close"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="create"]')).toBeFalsy();
    });
    test('exist account', () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.contains('サイトドメインが正しくありません')).toBeFalsy();
        expect(wrapper.contains('サイト名称は必須です')).toBeFalsy();
        expect(wrapper.contains('サインイン')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="md-checkmark"]')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="close"]')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="create"]')).toBeTruthy();
    });
});

describe('events', () => {
    beforeEach(() => {
        props = getProps();
        mocked(asyncRemoveAccountAction).mockClear();
    });

    test('true change', () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        props.state.authType = 'password';

        const wrapper = Enzyme.shallow(<_Account {...props} />);
        // 変更前
        expect((wrapper.state() as any)['siteName']).toEqual('name');
        expect((wrapper.state() as any)['siteDomain']).toEqual('domain.eim.ricoh.com');
        expect((wrapper.state() as any)['authType']).toEqual('password');
        const cloneState = clone(wrapper.state()) as IAccountLocaleState;
        // 変更後
        const siteNameInput = wrapper.findWhere(n => {
            return n.key() === 'site_name';
        });
        siteNameInput.simulate('changeText', 'change-name');
        cloneState.siteName = 'change-name';
        expect(wrapper.state()).toEqual(cloneState);

        const siteDomainInput = wrapper.findWhere(n => {
            return n.key() === 'site_domain';
        });
        siteDomainInput.simulate('changeText', 'domain1.eim.ricoh.com');
        cloneState.siteDomain = 'domain1.eim.ricoh.com';
        expect(wrapper.state()).toEqual(cloneState);

        const authTypePicker = wrapper.findWhere(n => {
            return n.key() === 'auth-type';
        });
        authTypePicker.simulate('valueChange', 'o365');
        cloneState.authType = 'o365';
        expect(wrapper.state()).toEqual(cloneState);
    });
    test('on press edit button - cancel button', () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const button = wrapper.find('FloatingButton[iconName="create"]');
        expect((wrapper.instance() as _Account)['backupState']).toBeNull();
        const beforeState = wrapper.state();
        button.simulate('press');
        expect((wrapper.instance() as _Account)['backupState']).toStrictEqual(beforeState);
        expect((wrapper.state() as any).mode).toEqual('edit');
        expect(wrapper.exists('FloatingButton[iconName="md-checkmark"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="close"]')).toBeTruthy();
        expect(wrapper.exists('FloatingButton[iconName="create"]')).toBeFalsy();

        const cancelButton = wrapper.find('FloatingButton[iconName="close"]');
        cancelButton.simulate('press');
        expect(wrapper.state()).toEqual(beforeState);
        expect((wrapper.state() as any).mode).toEqual('view');
        expect(wrapper.exists('FloatingButton[iconName="md-checkmark"]')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="close"]')).toBeFalsy();
        expect(wrapper.exists('FloatingButton[iconName="create"]')).toBeTruthy();
    });
    test('on press cancel button on new Account', () => {
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const cancelButton = wrapper.find('FloatingButton[iconName="close"]');
        cancelButton.simulate('press');
        expect(props.navigation.pop).toBeCalled();
    });
    test('on press remove', () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const state = wrapper.state() as IAccountLocaleState;
        const instance = wrapper.instance() as _Account;
        // 削除実行
        instance['onPressRemove']();
        mocked(Alert.alert).mockImplementation(jest.fn());
        expect(Alert.alert).toBeCalled();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mocked(Alert.alert).mock.calls[0][2]![1]!.onPress!();

        expect(asyncRemoveAccountAction).toBeCalledWith(
            state.id,
            props.dispatch,
            instance['navPop'],
        );
    });
    test('on press connect - valid token', async () => {
        mocked(EIMServiceAdapter).mockImplementation(() => {
            return {
                validateToken: () => true,
            } as any;
        });
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        props.state.eimToken = ['token'];
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const instance = wrapper.instance() as _Account;
        instance['successConnect'] = jest.fn();
        wrapper.update();
        const signInButton = wrapper.findWhere(a => a.key() === 'sign-in-button');
        await signInButton.simulate('press');

        expect(instance['successConnect']).toBeCalledWith(props.state.eimToken);
        expect(props.dispatch).not.toBeCalled();
        expect(props.navigation.navigate).not.toBeCalled();
    });
    test('on press connect - invalid token', async () => {
        mocked(EIMServiceAdapter).mockImplementation(() => {
            return {
                validateToken: () => false,
            } as any;
        });
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        props.state.eimToken = ['token'];
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const instance = wrapper.instance() as _Account;
        instance['successConnect'] = jest.fn();
        wrapper.update();
        const signInButton = wrapper.findWhere(a => a.key() === 'sign-in-button');
        await signInButton.simulate('press');

        expect(instance['successConnect']).not.toBeCalled();
        expect(props.dispatch).toBeCalled();
        expect(props.navigation.navigate).toBeCalled();
    });
    test('on press save - new account', async () => {
        mocked(asyncSaveAccountAction).mockImplementation(() => {
            return new Promise((reject) => { reject(); });
        });
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        wrapper.setState({
            authType: 'password',
            siteDomain: 'dummy.hoge',
            siteName: 'new_site_name',
        });
        const saveButton = wrapper.find('FloatingButton[iconName="md-checkmark"]');
        await saveButton.simulate('press');
        expect(asyncSaveAccountAction).not.toBeCalled();
        wrapper.setState({
            siteDomain: 'dummy.eim.ricoh.com',
        });
        await saveButton.simulate('press');
        const expectState = {
            loginResultMessage: '',
            siteNameError: false,
            siteDomainError: false,
            mode: 'edit',
            shownEditMenu: false,
            shownLoginDialog: false,
            authType: 'password',
            siteDomain: 'dummy.eim.ricoh.com',
            siteName: 'new_site_name',
            eimToken: [],
            id: 'abc',
            password: undefined,
            userId: undefined,
            lastConnect: null,
        };
        expect(asyncSaveAccountAction).toBeCalledWith(expectState, props.dispatch);
        expectState.mode = 'view';
        expect(wrapper.state()).toEqual(expectState);
    });
    test('on press save - exist account', async () => {
        mocked(asyncSaveAccountAction).mockImplementation(() => {
            return new Promise((reject) => { reject(); });
        });
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        props.state.eimToken = ['token'];

        const wrapper = Enzyme.shallow(<_Account {...props} />);
        wrapper.setState({
            authType: 'password1',
            siteDomain: 'domain1.eim.ricoh.com',
            siteName: 'new_site_name',
            mode: 'edit',
        });
        const saveButton = wrapper.find('FloatingButton[iconName="md-checkmark"]');
        await saveButton.simulate('press');
        const expectState = {
            loginResultMessage: '',
            siteNameError: false,
            siteDomainError: false,
            mode: 'edit',
            shownEditMenu: false,
            shownLoginDialog: false,
            authType: 'password1',
            siteDomain: 'domain1.eim.ricoh.com',
            siteName: 'new_site_name',
            eimToken: [],
            id: '001',
            password: undefined,
            userId: undefined,
            lastConnect: null,
        };
        expect(asyncSaveAccountAction).toBeCalledWith(expectState, props.dispatch);
        expectState.mode = 'view';
        expect(wrapper.state()).toEqual(expectState);
    });
});

describe('navProp', () => {
    test('', () => {
        const target = Enzyme.shallow(<_Account {...props} />);
        (target.instance() as _Account)['navPop']();
        expect(props.navigation.pop).toBeCalled();
    });
});

describe('successConnect', () => {
    test('', async () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        props.state.eimToken = [];
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const instance = wrapper.instance() as _Account;
        await instance['successConnect'](['token']);
        expect(Toast.show).toBeCalled();
        expect(asyncSaveAccountAction).toBeCalled();
        expect(navigateController.navigateForLink).toBeCalled();
        expect(wrapper.state('eimToken')).toEqual(['token']);
    });
});

describe('backPage', () => {
    test('', () => {
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        const instance = wrapper.instance() as _Account;
        const result = instance['backPage']();
        expect(props.navigation.pop).toBeCalled();
        expect(result).toBeTruthy();
    });
});

describe('navigationOptions', () => {
    test('', () => {
        const remove = jest.fn();
        const args = {
            navigation: {
                getParam: (key: string) => {
                    switch (key) {
                        case 'remove':
                            return remove;
                            break;
                        case 'removeButtonStyle':
                            return { fontSize: 10 }
                            break;
                    }
                    return null;
                },
            },
        }
        const result = _Account.navigationOptions(args as any);
        const wrapper = Enzyme.shallow(result.headerRight);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})

describe('mapStateToProps', () => {
    test('', () => {
        const state = {
            hoge: 1,
            hog2w: 2,
            account: {
                a: 1,
                b: 2,
            },
            accountList: ['aaa', 'bbb'],
        };
        const result = __private__.mapStateToProps(state as any);
        expect(result.state).toStrictEqual({
            a: 1,
            b: 2,
            accountListState: ['aaa', 'bbb'],
        });
    });
});
