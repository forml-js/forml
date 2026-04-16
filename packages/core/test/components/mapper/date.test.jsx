import { SchemaForm, getLocalizer, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import React from 'react';

describe('date', function () {
    let schema, form, model, onChange, localizer, decorator;

    beforeEach(function () {
        schema = { type: 'string', format: 'date' };
        form = [{ key: [], type: 'date' }];
        model = util.defaultForSchema(schema);
        onChange = vi.fn((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    it('renders itself', function () {
        const { container } = render(
            <SchemaForm
                model={model}
                form={form}
                schema={schema}
                onChange={onChange}
                decorator={barebones}
            />
        );

        expect(container.querySelector('input')).not.to.be.null;
    });

    it('uses localizer for title and description', function () {
        const form = [
            {
                type: 'checkbox',
                items: [],
                title: 'title',
                description: 'description',
            },
        ];
        const localizer = getLocalizer({
            getLocalizedString: vi.fn((id) => id),
        });
        const { container } = render(
            <SchemaForm
                model={model}
                form={form}
                schema={schema}
                onChange={onChange}
                localizer={localizer}
                decorator={barebones}
            />
        );

        expect(localizer.getLocalizedString).to.have.been.calledWith('title');
        expect(localizer.getLocalizedString).to.have.been.calledWith(
            'description'
        );
    });
});
