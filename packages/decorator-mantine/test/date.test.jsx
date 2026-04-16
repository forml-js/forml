import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, screen } from '@testing-library/react';
import DateForm from '../src/date.jsx';
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
            properties: { field: { type: 'string', format: 'date' } },
        };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('with no value', function () {
        const { container } = render(<DateForm form={form} />, { wrapper });

        const input = container.querySelector('.mantine-DatePickerInput-input');
        expect(input).to.exist;
    });

    it('with title', function () {
        const { container } = render(<DateForm form={form} />, { wrapper });

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);
    });

    it('with a specified value', function () {
        const { container } = render(
            <DateForm form={form} value="2025-07-03" />,
            {
                wrapper,
            }
        );

        const input = container.querySelector('.mantine-DatePickerInput-input');
        expect(input).to.exist;
        expect(input.textContent).to.equal('July 3, 2025');
    });

    it('with description', function () {
        model = { field: '2025-07-03' };
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });

        const { container } = render(<DateForm form={form} />, { wrapper });

        const desc = container.querySelector(
            '.mantine-DatePickerInput-description'
        );
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(form.description);
    });

    it('calls onChange with event and value', async function () {
        const onChange = vi.fn();
        const { container } = render(
            <DateForm form={form} value={'2025-07-03'} onChange={onChange} />,
            { wrapper }
        );

        const root = container.querySelector('.mantine-DatePickerInput-root');
        const button = container.querySelector(
            '.mantine-DatePickerInput-input'
        );
        button.click();

        await new Promise((resolve) => setTimeout(resolve, 50));

        const day = document.querySelector('.mantine-DatePickerInput-day');
        day.click();

        const hiddenInput = root.nextElementSibling;

        expect(onChange).to.have.been.calledOnce;
        expect(onChange).toHaveBeenCalledWith(
            { target: { value: '2025-06-30' } },
            '2025-06-30'
        );
    });

    describe('with an error state', function () {
        let ajv;
        let validator;
        let errorText;

        beforeEach(function () {
            validator = vi.fn((_value) => false);
            errorText = 'error';
            ajv = {
                compile: vi.fn(() => validator),
                errorsText: vi.fn(() => errorText),
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
            const { container } = render(<DateForm form={form} />, {
                wrapper,
            });

            const desc = container.querySelector(
                '.mantine-DatePickerInput-description'
            );
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });
    });
});
