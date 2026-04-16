import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as barebones from '@forml/decorator-barebones';

import { SchemaForm } from '#core';
import React from 'react';

describe('select mapper', function () {
    let schema;
    let form;
    let model;
    let onChange;

    beforeEach(function () {
        schema = { type: ['string', 'null'], enum: [null, 'a', 'b', 'c', 'd'] };
        form = ['*'];
        model = null;
        onChange = vi.fn((event, newModel) => (model = newModel));
    });

    it('is updated onChange', async function () {
        const { container } = render(
            <SchemaForm
                {...{
                    schema,
                    form,
                    model,
                    onChange,
                    decorator: barebones,
                }}
            />
        );
        const [button0, button1] = container.querySelectorAll('option');
        expect(button1).not.to.be.undefined;
        expect(button1).not.to.be.null;

        await userEvent.selectOptions(container.querySelector('select'), 'a');

        expect(onChange).to.have.been.called;
        expect(model).to.equal('a');
    });
});
