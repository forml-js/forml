import { SchemaForm, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement as h } from 'react';
import * as jsf from 'json-schema-faker';

describe('number', function () {
    let schema, form, model, onChange, decorator;

    beforeEach(function () {
        schema = { type: 'number' };
        form = [{ key: [], type: 'number' }];
        model = jsf.generate(schema);
        onChange = vi.fn((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    it('tolerates empty strings onChange', async function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '' },
        });
        await waitFor(() => expect(onChange).to.have.been.called);
        expect(model).to.equal('');
    });

    it('tolerates minus character onChange', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '-' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal('-');
    });

    it('tolerates trailing points despite parseFloat', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3.' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal('3.');

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3..' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal('3.');
    });

    it('tolerates only one decimal point', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3.1.' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal(3.1);
    });

    it('does not tolerate non-numeric strings', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: 'a' },
        });

        expect(onChange).not.to.have.been.called;
    });
});
