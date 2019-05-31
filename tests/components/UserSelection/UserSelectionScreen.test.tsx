import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';

import UserSelectScreen from '../../../src/components/UserSelection/UserSelectScreen';

Enzyme.configure({
    adapter: new EnzymeAdapter(),
});

describe('init', () => {
    test('default', () => {
        const wrapper = Enzyme.shallow(<UserSelectScreen />)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
