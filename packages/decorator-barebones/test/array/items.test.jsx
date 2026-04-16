import Items from '../../src/arrays/items.jsx';
import React from 'react';
import { render } from '@testing-library/react';

describe('Array', function () {
    it('renders its children', function () {
        const { container } = render(
            <Items form={{ type: 'array' }}>
                <div id="test">test</div>
            </Items>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    });
});
