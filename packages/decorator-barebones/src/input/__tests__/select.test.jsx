import Select from '../select';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    test('its children', function() {
        const { container } = render(
            <Select>
                <div id="test">test</div>
            </Select>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
