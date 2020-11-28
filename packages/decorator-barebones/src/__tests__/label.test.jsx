import Label from '../label';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    test('its children', function() {
        const { container } = render(<Label><div id="test">test</div></Label>);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
