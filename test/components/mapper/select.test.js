import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { config } from 'react-transition-group';
import * as barebones from '@forml/decorator-barebones';

config.disabled = true;

import { SchemaForm, util } from '../../../src';
import { createElement as h } from 'react';

describe('select mapper', function () {
    let schema;
    let form;
    let model;
    let onChange;

    beforeEach(function () {
        schema = { type: ['string', 'null'], enum: [null, 'a', 'b', 'c', 'd'] };
        form = ['*'];
        model = null;
        onChange = jest.fn((event, newModel) => (model = newModel));
    });

    test('is updated onChange', async function () {
        const { container } = render(
            h(SchemaForm, {
                schema,
                form,
                model,
                onChange,
                decorator: barebones,
            })
        );
        const [button0, button1] = container.querySelectorAll('option');
        expect(button1).toBeDefined();
        expect(button1).not.toBeNull();

        await fireEvent.change(container.querySelector('select'), {
            target: { value: 'a' },
        });
        expect(onChange).toHaveBeenCalled();
        expect(model).toBe('a');
    });
});
