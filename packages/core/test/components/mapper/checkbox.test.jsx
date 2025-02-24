import * as chai from 'chai'
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';

import { SchemaForm, getLocalizer, util } from '#core';
import { createElement as h } from 'react';

chai.use(sinonChai);
const { expect } = chai;

describe('checkbox mapper', function() {
    let schema, form, model, onChange, localizer;

    beforeEach(function() {
        schema = { type: 'boolean' };
        form = [{ type: 'checkbox', key: [] }];
        model = util.defaultForSchema(schema);
        onChange = jest.fn((event, nextModel) => (model = nextModel));
    });

    test('renders itself', function() {
        const { container } = render(
            h(SchemaForm, {
                model,
                form,
                schema,
                onChange,
                decorator: barebones,
            })
        );

        expect(
            container.querySelector('input[type="checkbox"]')
        ).not.toBeNull();
    });

    test('uses localizer for title and description', function() {
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
                decorator: barebones,
            })
        );

        expect(localizer.getLocalizedString).toHaveBeenCalledWith('title');
        expect(localizer.getLocalizedString).toHaveBeenCalledWith(
            'description'
        );
    });
});
