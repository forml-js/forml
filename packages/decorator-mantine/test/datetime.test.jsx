import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, screen } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import DateTime from '../src/datetime.jsx';
import { withOptions } from '../src/index.jsx';

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <MantineProvider>
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        </MantineProvider>
    );
}

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'date', title, description, key: ['field'] };
        decorator = withOptions({});
        schema = {
            type: 'object',
            properties: { field: { type: 'string', format: 'date-time' } },
        };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('with no value', function () {
        const { container } = render(<DateTime form={form} />, { wrapper });

        const input = container.querySelector('.mantine-DateTimePicker-input');
        expect(input).to.exist;
    });

    it('with title', function () {
        const { container } = render(<DateTime form={form} />, { wrapper });

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);
    });

    it('with a specified value', function () {
        const value = new Date();
        const expected = new Date(value);

        expected.setMilliseconds(0);

        const { container } = render(<DateTime form={form} value={value} />, {
            wrapper,
        });

        const root = container.querySelector('.mantine-DateTimePicker-root');
        expect(root).to.exist;

        const input = container.querySelector('input');
        expect(input).to.exist;
        const inputValue = new Date(input.value);
        expect(inputValue.toISOString()).to.equal(expected.toISOString());
    });

    it('with description', function () {
        model = { field: '2025-07-03T16:33:00.000Z' };
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });

        const { container } = render(<DateTime form={form} />, { wrapper });

        const desc = container.querySelector(
            '.mantine-DateTimePicker-description'
        );
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(form.description);
    });

    it('calls onChange with event and value', async function () {
        const onChange = sinon.spy();
        const { container } = render(
            <DateTime form={form} value={'2025-07-03'} onChange={onChange} />,
            { wrapper }
        );

        const button = container.querySelector('.mantine-DateTimePicker-input');
        button.click();

        await new Promise((resolve) => setTimeout(resolve, 50));

        const day = document.querySelector('.mantine-DateTimePicker-day');
        day.click();

        expect(onChange).to.have.been.calledOnce;
        onChange.calledWithMatch(
            { target: { value: day.ariaLabel } },
            day.ariaLabel
        );

        expect(onChange.calledOnce).to.be.true;
    });

    describe('with an error state', function () {
        let ajv;
        let validator;
        let errorText;

        beforeEach(function () {
            validator = sinon.spy((_value) => false);
            errorText = 'error';
            ajv = {
                compile: sinon.spy(() => validator),
                errorsText: sinon.spy(() => errorText),
            };
            model = { field: 'not a boolean' };
            modelStore = renderHook(() => useModelStore(schema, model)).result
                .current;
            modelStore.setState((state) => (state.ajv = ajv));
            wrapper = makeWrapper({
                modelStore,
                renderingContext: { decorator },
            });
        });

        it('the description displays an error message', function () {
            const { container } = render(<DateTime form={form} />, {
                wrapper,
            });

            const desc = container.querySelector(
                '.mantine-DateTimePicker-description'
            );
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });
    });
});
