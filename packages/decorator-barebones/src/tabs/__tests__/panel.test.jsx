import Panel from '../panel';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    let form;
    beforeEach(function () {
        form = { type: 'tabs', tabs: [] };
    });
    test('its children', function () {
        const { container } = render(
            <Panel form={form}>
                <div id="test">test</div>
            </Panel>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    });
});
