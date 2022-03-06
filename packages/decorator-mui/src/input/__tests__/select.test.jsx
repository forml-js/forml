import Select from '../select';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    let form;

    beforeEach(function () {
        let form = { type: 'number', enum: [1, 2, 3] };
    });

    test('consistently', function () {
        const { container } = render(
            <Select value={1}>
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
                <Option value={3}>3</Option>
            </Select>
        );

        expect(container).toMatchSnapshot();
    });
});
