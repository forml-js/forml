import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook } from '@testing-library/react';
import Checkbox from '../src/checkbox.jsx';
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
        form = { type: 'checkbox', title, description, key: ['field'] };
        decorator = withOptions({});
        schema = {
            type: 'object',
            properties: { field: { type: 'boolean' } },
        };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('with no value', function () {
        const { container } = render(<Checkbox form={form} />, { wrapper });

        const input = container.querySelector('input[type="checkbox"]');
        expect(input).to.exist;
    });

    it('with title', function () {
        const { container } = render(<Checkbox form={form} />, { wrapper });

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);
    });

    it('when checked', function () {
        const { container } = render(<Checkbox form={form} value={true} />, {
            wrapper,
        });

        const input = container.querySelector('input[type="checkbox"]');
        expect(input).to.exist;
        expect(input.checked).to.be.true;
    });

    it('with description', function () {
        const { container } = render(<Checkbox form={form} />, { wrapper });

        const desc = container.querySelector('.mantine-Checkbox-description');
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(form.description);
    });

    it('calls onChange with event and value', function () {
        const onChange = vi.fn();
        const { container } = render(
            <Checkbox form={form} value={false} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('input[type="checkbox"]');
        input.click();

        expect(onChange).to.have.been.calledOnce;
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
            const { container } = render(<Checkbox form={form} />, {
                wrapper,
            });

            const desc = container.querySelector(
                '.mantine-Checkbox-description'
            );
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });
    });
});
