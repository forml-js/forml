import FieldSet from '../fieldset';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';

    beforeEach(function () {
        form = { type: 'fieldset', items: [{ key: [] }] };
    });

    test('with title and description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <FieldSet form={form} title={title} description={description} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with title and no description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <FieldSet form={form} title={title} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with description and no title', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <FieldSet form={form} description={title} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with no title or description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <FieldSet form={form} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
