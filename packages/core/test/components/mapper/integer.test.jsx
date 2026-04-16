import { SchemaForm, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import * as jsf from 'json-schema-faker';

describe('integer', function () {
    let schema, form, model, onChange, decorator;

    beforeEach(function () {
        schema = { type: 'integer' };
        form = [{ key: [], type: 'integer' }];
        model = jsf.generate(schema);
        onChange = vi.fn((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    it('tolerates empty strings onChange', function () {
        const { container } = render(
            <SchemaForm {...{ schema, form, model, onChange, decorator }} />
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal(0);
    });

    it('tolerates minus character onChange', function () {
        const { container } = render(
            <SchemaForm
                {...{
                    schema,
                    form,
                    model,
                    onChange,
                    decorator,
                }}
            />
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '-' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal('-');
    });

    it('does not tolerate non-numeric strings', function () {
        const { container } = render(
            <SchemaForm {...{ schema, form, model, onChange, decorator }} />
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: 'a' },
        });

        expect(onChange).not.to.have.been.called;
    });
});
