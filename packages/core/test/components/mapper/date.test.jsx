import { SchemaForm, getLocalizer, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import { createElement as h } from 'react';

describe('date', function () {
    let schema, form, model, onChange, localizer, decorator;

    beforeEach(function () {
        schema = { type: 'string', format: 'date' };
        form = [{ key: [], type: 'date' }];
        model = util.defaultForSchema(schema);
        onChange = jest.fn((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    test('renders itself', function () {
        const { container } = render(
            h(SchemaForm, { model, form, schema, onChange, decorator })
        );

        expect(container.querySelector('input')).not.toBeNull();
    });

    test('uses localizer for title and description', function () {
        const form = [
            {
                type: 'checkbox',
                items: [],
                title: 'title',
                description: 'description',
            },
        ];
        const localizer = getLocalizer({
            getLocalizedString: jest.fn((id) => id),
        });
        const { container } = render(
            h(SchemaForm, {
                model,
                form,
                schema,
                onChange,
                localizer,
                decorator,
            })
        );

        expect(localizer.getLocalizedString).toHaveBeenCalledWith('title');
        expect(localizer.getLocalizedString).toHaveBeenCalledWith(
            'description'
        );
    });
});
