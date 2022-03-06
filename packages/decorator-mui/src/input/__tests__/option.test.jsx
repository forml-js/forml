import Option from '../option';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    let form;

    beforeEach(function () {
        let form = { type: 'number', enum: [1, 2, 3] };
    });

    test('consistently', function () {
        const { container } = render(<Option value={1}>1</Option>);

        expect(container).toMatchSnapshot();
    });
});
