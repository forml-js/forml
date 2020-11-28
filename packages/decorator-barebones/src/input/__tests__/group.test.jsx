import Group from '../group';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    let form;
    beforeEach(function() {
        form = { type: 'string' };
    })
    test('its children', function() {
        const { container } = render(
            <Group form={form}>
                <div id="test">test</div>
            </Group>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
