import Item from '../../src/arrays/item.jsx';
import React from 'react';
import { render } from '@testing-library/react';

describe('Item', function () {
    let form;

    beforeEach(function () {
        form = { type: 'array', key: [], items: [{ type: 'string' }] };
    });
    it('renders its children', function () {
        const { container } = render(
            <Item form={form} otherProps={{}}>
                <div id="test">test</div>
            </Item>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
    });
});
