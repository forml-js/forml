import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook } from '@testing-library/react';
import Select from '../src/select.jsx';
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
    let title = 'Select an option';
    let description = 'Choose from the available options';
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;
    let onChange;

    beforeEach(function () {
        form = {
            type: 'string',
            key: ['field'],
            title,
            description,
            titleMap: [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 },
            ],
            enum: [1, 2, 3],
        };
        schema = { type: 'object', properties: { field: { type: 'number' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = vi.fn();
    });

    it('renders the select input', function () {
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-Select-input');
        expect(input).to.exist;
    });

    it('displays the title as a label', function () {
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);
    });

    it('displays the description', function () {
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const desc = container.querySelector('.mantine-Select-description');
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(description);
    });

    it('displays the label of the currently selected value', function () {
        const { container } = render(
            <Select form={form} value={2} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-Select-input');
        expect(input.value).to.equal('Option 2');
    });

    it('renders without a title', function () {
        form = { ...form, title: undefined };
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label).to.not.exist;
    });

    it('renders without a description', function () {
        form = { ...form, description: undefined };
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const desc = container.querySelector('.mantine-Select-description');
        expect(desc).to.not.exist;
    });

    it('calls onChange with a synthetic event and value when an option is selected', async function () {
        const { container } = render(
            <Select form={form} value={1} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-Select-input');
        input.click();

        await new Promise((resolve) => setTimeout(resolve, 50));

        const options = document.querySelectorAll('.mantine-Select-option');
        const option2 = Array.from(options).find(
            (el) => el.textContent === 'Option 2'
        );
        expect(option2).to.exist;
        option2.click();

        expect(onChange).to.have.been.calledOnce;
        expect(onChange).to.have.been.calledWith({ target: { value: 2 } }, 2);
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
            model = { field: 1 };
            modelStore = renderHook(() => useModelStore(schema, model)).result
                .current;
            modelStore.setState((state) => (state.ajv = ajv));
            wrapper = makeWrapper({
                modelStore,
                renderingContext: { decorator },
            });
        });

        it('shows the error message in place of description', function () {
            const { container } = render(
                <Select form={form} value={1} onChange={onChange} />,
                { wrapper }
            );

            const desc = container.querySelector('.mantine-Select-description');
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });

        it('sets the error state on the input', function () {
            const { container } = render(
                <Select form={form} value={1} onChange={onChange} />,
                { wrapper }
            );

            const input = container.querySelector('.mantine-Select-input');
            expect(input).to.exist;
            expect(input.getAttribute('aria-invalid')).to.equal('true');
        });
    });
});
