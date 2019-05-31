import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';

import { IUserBadgeProps } from '../../../src';
import UserSelection from '../../../src/components/UserSelection/UserSelection';

Enzyme.configure({
    adapter: new EnzymeAdapter(),
});

const getUsers = (): IUserBadgeProps[] => {
    return [
        {
            badgeColor: '#333',
            textColor: '#ccc',
            type: 'user',
            userId: 'a0001',
            style: {
                borderColor: '#030',
            }
        },
        {
            type: 'group',
            userId: 'a0002',
        },
    ];
};

describe('init', () => {
    test('', () => {
        const users = getUsers();
        const target = Enzyme.shallow(
            <UserSelection selectedUsers={users}
                badgeColor='#900' textColor="#099"
                style={{ backgroundColor: '#100' }}
                userBadgeStyle={{ borderColor: '#111', borderWidth: 1 }}
            />);
        expect(toJson(target)).toMatchSnapshot();
    });
});
