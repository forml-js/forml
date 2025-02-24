import { SchemaForm, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { fireEvent, render } from '@testing-library/react';
import { createElement as h } from 'react';

describe('number', function () {
    let schema, form, model, onChange, decorator;

    beforeEach(function () {
        schema = { type: 'number' };
        form = [{ key: [], type: 'number' }];
        model = util.defaultForSchema(schema);
        onChange = jest.fn((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    test('tolerates empty strings onChange', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '' },
        });

        expect(onChange).toHaveBeenCalled();
        expect(model).toBe('');
    });

    test('tolerates minus character onChange', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '-' },
        });

        expect(onChange).toHaveBeenCalled();
        expect(model).toBe('-');
    });

    test('tolerates trailing points despite parseFloat', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3.' },
        });

        expect(onChange).toHaveBeenCalled();
        expect(model).toBe('3.');

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3..' },
        });

        expect(onChange).toHaveBeenCalled();
        expect(model).toBe('3.');
    });

    test('tolerates only one decimal point', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '3.1.' },
        });

        expect(onChange).toHaveBeenCalled();
        expect(model).toBe(3.1);
    });

    test('does not tolerate non-numeric strings', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: 'a' },
        });

        expect(onChange).not.toHaveBeenCalled();
    });
});
