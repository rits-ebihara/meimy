import clone from 'clone';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';

import { AuthType } from '../../../../src/account-manager/states/IAccountState';
import { _Account, IAccountProps, ILocaleState } from '../../../../src/account-manager/views/containers/Account';
import { ICombinedNavProps } from '../../../../src/redux-helper/redux-helper';

Enzyme.configure({ adapter: new Adapter() });

const getProps = (): ICombinedNavProps<IAccountProps> => {
    return {
        navigation: {
            setParams: jest.fn(),
            pop: jest.fn(),
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
    beforeEach(() => {
        props = getProps();
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
    test('exist account, sing in', () => {
        props.state.id = '001';
        props.state.siteDomain = 'domain.eim.ricoh.com';
        props.state.siteName = 'name';
        const wrapper = Enzyme.shallow(<_Account {...props} />);
        wrapper.setState({ loginProcessing: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.contains('サインイン')).toBeFalsy();
        const spinner = wrapper.findWhere(n => n.key() === 'sigin_in_spinner');
        expect(spinner.name()).toEqual('Styled(Spinner)');
    });
});

describe('events', () => {
    beforeEach(() => {
        props = getProps();
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
        const cloneState = clone(wrapper.state()) as ILocaleState;
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
    test('on press edit button', () => {
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
    });
});
