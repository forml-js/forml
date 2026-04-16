import FieldSet from '../src/fieldset.jsx';
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

    it('with title and description', function () {
        const { container } = render(
            <FieldSet form={form} title={title} description={description} />
        );

        expect(container).toMatchSnapshot();
    });

    it('with title and no description', function () {
        const { container } = render(<FieldSet form={form} title={title} />);

        expect(container).toMatchSnapshot();
    });

    it('with description and no title', function () {
        const { container } = render(
            <FieldSet form={form} description={title} />
        );

        expect(container).toMatchSnapshot();
    });

    it('with no title or description', function () {
        const { container } = render(<FieldSet form={form} />);

        expect(container).toMatchSnapshot();
    });
});
