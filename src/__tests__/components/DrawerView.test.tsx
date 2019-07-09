import Enzyme, { shallow, ShallowWrapper } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import { getEimAccount } from '../../account-manager/EimAccount';
import { DrawerContent, IDrawerViewLocalState, IDrawerViewProps } from '../../components/DrawerView';

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
        getAttachmentFile: async () => ({ url: 'https://exsample.com/image.png' }),
    })),
    clear: jest.fn(),
    save: jest.fn(),
    domain: 'site-domain',
});

jest.mock('../../account-manager/EimAccount.ts', () => ({
    getEimAccount: jest.fn(),
}));

const createProps = (): IDrawerViewProps => ({
    navigation: {
        navigate: jest.fn(),
        toggleDrawer: jest.fn(),
    } as any,
    items: [],
    drawerPosition: 'left',
    borderColor: '#999',
    buttonColor: '#900',
    appDisplayName: 'アプリ名',
    appVersion: 'ver 1.0.0',
    splashPageName: 'splash',
    getLabel: jest.fn(),
    renderIcon: jest.fn(),
    onItemPress: jest.fn(),

})

describe('render', () => {
    let props: IDrawerViewProps;
    let wrapper: ShallowWrapper<IDrawerViewProps, IDrawerViewLocalState, DrawerContent>;
    beforeEach(() => {
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockReturnValue(createEimAccount() as any);
        props = createProps();
        wrapper = shallow<DrawerContent>(<DrawerContent {...props} />, { disableLifecycleMethods: true });
    });
    test('init', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('null', () => {
        mocked(getEimAccount).mockReturnValue({ user: undefined } as any);
        const props = createProps();
        const wrapper = shallow<DrawerContent>(<DrawerContent {...props} />, { disableLifecycleMethods: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('set avatar', () => {
        wrapper.setState({
            avatarFaceUrl: {
                uri: 'https://exsample.com',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('componentDidMount', () => {
    let props: IDrawerViewProps;
    let wrapper: ShallowWrapper<IDrawerViewProps, IDrawerViewLocalState, DrawerContent>;
    let instance: DrawerContent;
    beforeEach(() => {
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockReturnValue(createEimAccount() as any);
        props = createProps();
        wrapper = shallow<DrawerContent>(<DrawerContent {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();
    });
    test('no face image', async () => {
        const eimAccount = createEimAccount();
        mocked(getEimAccount).mockReturnValue(eimAccount as any);
        await instance.componentDidMount();
        expect(eimAccount.getServiceAdapter).not.toBeCalled();
    });
    test('exist face image', async () => {
        const eimAccount = createEimAccount();
        eimAccount.user.properties.faceImage = '000';
        mocked(getEimAccount).mockReturnValueOnce(eimAccount as any);
        await instance.componentDidMount();
        expect(eimAccount.getServiceAdapter).toBeCalled();
        expect(wrapper.state().avatarFaceUrl).toEqual({
            uri: 'https://exsample.com/image.png',
        });
    });
    test('no face image - user is undefined', async () => {
        const eimAccount = createEimAccount();
        eimAccount.user = undefined as any;
        mocked(getEimAccount).mockReturnValueOnce(eimAccount as any);
        await instance.componentDidMount();
        expect(eimAccount.getServiceAdapter).not.toBeCalled();
    });
    test('exist face image - isMounted is false', async () => {
        const eimAccount = createEimAccount();
        eimAccount.user.properties.faceImage = '000';
        mocked(eimAccount.getServiceAdapter).mockClear();
        mocked(eimAccount.getServiceAdapter).mockImplementationOnce(() => {
            instance['$isMounted'] = false;
            return {
                getAttachmentFile: jest.fn().mockResolvedValue({
                    url: 'https://exsample.com/image.png'
                }),
            };
        });
        mocked(getEimAccount).mockReturnValueOnce(eimAccount as any);
        await instance.componentDidMount();
        expect(eimAccount.getServiceAdapter).toBeCalled();
        expect(wrapper.state().avatarFaceUrl).toBeUndefined();
    });
});

describe('event', () => {
    let props: IDrawerViewProps;
    let wrapper: ShallowWrapper<IDrawerViewProps, IDrawerViewLocalState, DrawerContent>;
    let instance: DrawerContent;
    let eimAccount = createEimAccount() as any;
    beforeEach(() => {
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockReturnValue(eimAccount);
        props = createProps();
        wrapper = shallow<DrawerContent>(<DrawerContent {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();
    });

    test('onPress close button', () => {
        const closeButton = wrapper.findWhere(a => a.key() === 'closeButton');
        closeButton.simulate('press');
        expect(props.navigation.toggleDrawer).toBeCalled();
    });
    test('componentWillMount', () => {
        instance['$isMounted'] = true;
        instance.componentWillUnmount();
        expect(instance['$isMounted']).toBeFalsy();
    });
    test('on press changeSiteButton', async () => {
        await instance['onPressChangeSite']();
        expect(eimAccount.clear).toBeCalled();
        expect(eimAccount.save).toBeCalled();
        expect(props.navigation.navigate).toBeCalledWith(props.splashPageName);
    });
});
