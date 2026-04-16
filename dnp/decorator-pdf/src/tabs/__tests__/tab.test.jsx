import { Tab } from '../';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let form;
    let parent;
    let title = 'title';
    let description = 'description';

    beforeEach(function () {
        form = { type: 'fieldset', items: [{ key: [] }] };
        parent = { type: 'tabs', tabs: [form] };
    });

    test('nothing', function () {
        const { container } = render(<Tab>test</Tab>);
        expect(container.childNodes.length).toBe(0);
    });
});
