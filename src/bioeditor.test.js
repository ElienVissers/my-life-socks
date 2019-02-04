import React from 'react';
import axios from './axios';
import {BioEditor} from './bioeditor';
import {shallow} from 'enzyme';

jest.mock('./axios');

test('When no bio, ADD button is rendered', () => {
    const wrapper = shallow(<BioEditor bio={null} />);
    expect(
        wrapper.find('button').contains('ADD BIO')
    ).toBe(true);
});

test('When bio, EDIT button is rendered', () => {
    const wrapper = shallow(<BioEditor bio={'Hi I am a mock bio!'} />);
    expect(
        wrapper.find('button').contains('EDIT BIO')
    ).toBe(true);
});

test('When add/edit button clicked, SAVE button is rendered', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find('button').simulate('click', {
        preventDefault: () => {}
    });
    expect(
        wrapper.find('button').contains('SAVE')
    ).toBe(true);
});

test('When add/edit button clicked, textarea is rendered', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find('button').simulate('click', {
        preventDefault: () => {}
    });
    expect(
        wrapper.contains(<textarea />)
    );
});

test('When SAVE button clicked, axios request is made', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find('button').simulate('click', {
        preventDefault: () => {}
    });
    expect(
        axios.post.mockResolvedValue({
            data: {bio: 'some cool bio'}
        })
    );
});

test('When SAVE successful, updateBio() is called', async () => {
    const updateBio = jest.fn();
    const wrapper = shallow(<BioEditor updateBio={updateBio}/>);
    axios.post.mockResolvedValue({
        data: {bio: 'some cool bio'}
    });
    await wrapper.instance().closeEditMode({
        preventDefault: () => {}
    });
    expect(
        updateBio.mock.calls.length
    ).toBe(1);
});
