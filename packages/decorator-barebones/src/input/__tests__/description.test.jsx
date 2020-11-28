import Description from '../description';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    test('its children', function() {
        const { container } = render(
            <Description>
                <div id="test">test</div>
            </Description>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
