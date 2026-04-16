import Panel from '../../src/tabs/panel.jsx';
import React from 'react';
import { render } from '@testing-library/react';

describe('Panel', function () {
    let form;
    beforeEach(function () {
        form = { type: 'tabs', tabs: [] };
    });
    it('renders its children', function () {
        const { container } = render(
            <Panel form={form}>
                <div id="test">test</div>
            </Panel>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    });
});
