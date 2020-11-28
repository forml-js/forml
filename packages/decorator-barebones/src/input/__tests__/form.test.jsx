import Form from '../form';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function() {
    let localizer;
    test('its children', function() {
        const { container } = render(
            <Form value="test" />
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('input')).not.toBeNull();
        expect(container.querySelector('input').value).toBe('test');
    })
})
