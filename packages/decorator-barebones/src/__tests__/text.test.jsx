import Text from '../text';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    test('its children', function() {
        const { container } = render(<Text><div id="test">test</div></Text>);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    })
})
