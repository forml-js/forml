import Tab from '../../src/tabs/tab.jsx';
import React from 'react';
import { render } from '@testing-library/react';

describe('Tab', function () {
    let form;
    beforeEach(function () {
        form = { title: 'title' };
    });
    it('renders its children', function () {
        const { container } = render(
            <Tab form={form}>
                <div id="test">test</div>
            </Tab>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('button')).not.toBeNull();
        expect(container.querySelector('button').textContent).toBe('title');
    });
});
