import Option from '../option';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    test('nothing', function () {
        const { container } = render(<Option value={1}>1</Option>);
        expect(container).toMatchSnapshot();
    });
});
