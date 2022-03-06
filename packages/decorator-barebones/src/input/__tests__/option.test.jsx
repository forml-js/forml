import Option from '../option';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    test('its children', function () {
        const { container } = render(<Option value={1}>1</Option>);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('option')).not.toBeNull();
        expect(container.querySelector('option').textContent).toBe('1');
    });
});
