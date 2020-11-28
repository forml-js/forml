import Group from '../group';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    test('its children', function() {
        const { container } = render(<Group><div id="test">test</div></Group>);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
