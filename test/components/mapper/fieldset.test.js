import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createElement as h } from 'react';
import { SchemaForm, getLocalizer, util } from '../../../src';

describe('fieldset', function () {
    let schema, form, model, onChange, localizer;

    beforeEach(function () {
        schema = { type: 'object', properties: { foo: { type: 'string' } } };
        form = [{ type: 'fieldset', items: ['foo'] }];
        model = util.defaultForSchema(schema);
        onChange = jest.fn((event, nextModel) => (model = nextModel));
    });

    test('renders itself', function () {
        const { container } = render(
            h(SchemaForm, { model, form, schema, onChange })
        );

        expect(container.querySelector('fieldset')).not.toBeNull();
        expect(container.querySelector('fieldset input')).not.toBeNull();
    });

    test('uses localizer for title and description', function () {
        const form = [
            {
                type: 'fieldset',
                items: [],
                title: 'title',
                description: 'description',
            },
        ];
        const localizer = getLocalizer({
            getLocalizedString: jest.fn((id) => id),
        });
        const { container } = render(
            h(SchemaForm, { model, form, schema, onChange, localizer })
        );

        expect(localizer.getLocalizedString).toHaveBeenCalledWith('title');
        expect(localizer.getLocalizedString).toHaveBeenCalledWith(
            'description'
        );
    });
});
