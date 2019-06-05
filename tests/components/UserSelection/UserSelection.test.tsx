import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';

import UserSelection, { IUserListItem } from '../../../src/components/UserSelection/UserSelection';

Enzyme.configure({
    adapter: new EnzymeAdapter(),
});

const getUsers = (): IUserListItem[] => {
    return [
        {
            type: 'user',
            userDocId: 'a0001',
        },
        {
            type: 'group',
            userDocId: 'a0002',
        },
    ];
};

describe('init', () => {
    test('minimal', () => {
        const users = getUsers();
        const target = Enzyme.shallow(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={jest.fn()}
            />);
        expect(toJson(target)).toMatchSnapshot();
    });
    test('minimal - no multiple', () => {
        const users = getUsers();
        const target = Enzyme.shallow(
            <UserSelection selectedUsers={users}
                showAddButton
                onChange={jest.fn()}
            />);
        expect(toJson(target)).toMatchSnapshot();
    });
    test('user badge styled', () => {
        const users = getUsers();
        const target = Enzyme.shallow(
            <UserSelection
                userBadgeProp={{
                    badgeColor: '#900',
                    textColor: '#ccc',
                    onLongPress: () => { },
                    style: {
                        borderColor: '#090',
                    },
                    type: 'organization',
                }}
                multiple
                selectedUsers={users}
                showAddButton={false}
                onChange={jest.fn()}
            />);
        expect(toJson(target)).toMatchSnapshot();
    });
});

describe('event', () => {
    test('add user', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={fn}
            />);
        const instance = target.instance();
        instance['addList']('add-user-id', 'user');
        expect(fn).toBeCalledWith([...users, {
            type: 'user', userDocId: 'add-user-id'
        }]);
    });
    test('add user - no multiple', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton
                onChange={fn}
            />);
        const instance = target.instance();
        instance['addList']('add-user-id', 'user');
        expect(fn).toBeCalledWith([{
            type: 'user', userDocId: 'add-user-id'
        }]);
    });
    test('add exist user', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={fn}
            />);
        const instance = target.instance();
        instance['addList']('a0001', 'user');
        // onChange のイベントが呼ばれないこと
        expect(fn).not.toBeCalled();
    });
    test('remove user', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={fn}
            />);
        const instance = target.instance();
        instance['onDelete']('a0001');
        expect(fn).toBeCalledWith([{
            type: 'group',
            userDocId: 'a0002',
        }]);
    });
    test('remove user - no exist user', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={fn}
            />);
        const instance = target.instance();
        instance['onDelete']('a009');
        expect(fn).not.toBeCalled();
    });
    test('press add user button', () => {
        const users = getUsers();
        const fn = jest.fn();
        const target = Enzyme.shallow<UserSelection>(
            <UserSelection selectedUsers={users}
                showAddButton multiple
                onChange={fn}
            />);
        const instance = target.instance();
        instance['addButtonPress'];
        const comp = target.findWhere(a => a.key() === 'user-select-screen');
        (comp.getElement() as any).ref({ show: jest.fn() })
        const button = target.findWhere(a => a.key() === 'add-button');
        button.simulate('press');
        expect((instance['selectionModal'] as any).show).toBeCalled();
    });
});
