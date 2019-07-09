import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';

import HTMLViewer from '../../components/HTMLViewer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const html = `
    <p>ほげ</p>
`;

describe('render', () => {
    test('init', () => {
        const wrapper = shallow(<HTMLViewer html={html} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('event', () => {
    test('onMessage', () => {
        const wrapper = shallow<HTMLViewer>(<HTMLViewer html={html} />);
        const instance = wrapper.instance();
        instance['onMessage']({
            nativeEvent: {
                data: '300',
            },
        } as any);
        expect(wrapper.state().height).toEqual(300);
    });
    test('onMessage - not number', () => {
        const wrapper = shallow<HTMLViewer>(<HTMLViewer html={html} />);
        const instance = wrapper.instance();
        instance['onMessage']({
            nativeEvent: {
                data: 'abc',
            },
        } as any);
        expect(wrapper.state().height).toEqual(200);
    });

});
