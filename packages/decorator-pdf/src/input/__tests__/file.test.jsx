import File from '../file';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    test('nothing', function () {
        const { container } = render(<File value={'/tmp/test'}>1</File>);
        expect(container).toMatchSnapshot();
    });
});
