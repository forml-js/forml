import Multiselect from '../src/multiselect.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render, renderHook, fireEvent } from '@testing-library/react';
import { withOptions } from '../src/index.jsx';
import { useModelStore } from '@forml/hooks';

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelStore}>
                {children}
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
}

describe('renders', function () {
    let form;
    let title = 'Select an option';
    let description = 'Choose from the available options';
    let value = 1;
    let onChange;
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = {
            type: 'string',
            key: 'field',
            title,
            description,
            titleMap: [
                { name: 'Option 1', value: 1 },
                { name: 'Option 2', value: 2 },
                { name: 'Option 3', value: 3 },
            ],
            enum: [1, 2, 3],
        };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = vi.fn(function () {}); // Mock onChange function
    });

    it('renders basic select with title and options', function () {
        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        // Check for FormControl
        const formControl = container.querySelector('.MuiFormControl-root');
        expect(formControl).to.exist;

        // Check for InputLabel
        const label = container.querySelector('.MuiInputLabel-root');
        expect(label).to.exist;
        expect(label.textContent).to.equal(title);

        // Check for Select
        const select = container.querySelector('.MuiSelect-root');
        expect(select).to.exist;

        // Check for helper text (description)
        const helperText = container.querySelector('.MuiFormHelperText-root');
        expect(helperText).to.exist;
        expect(helperText.textContent).to.equal(description);
    });

    it('renders without title', function () {
        form = { ...form, title: undefined };

        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const formControl = container.querySelector('.MuiFormControl-root');
        expect(formControl).to.exist;

        const label = container.querySelector('.MuiInputLabel-root');
        expect(label).to.not.exist;
    });

    it('renders without description', function () {
        form = { ...form, description: undefined };

        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const formControl = container.querySelector('.MuiFormControl-root');
        expect(formControl).to.exist;

        const helperText = container.querySelector('.MuiFormHelperText-root');
        expect(helperText).to.not.exist;
    });

    it('respects variant option from decorator', function () {
        decorator = withOptions({ variant: 'outlined' });
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });

        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const select = container.querySelector('.MuiSelect-root');
        expect(select).to.exist;

        // Check for outlined variant
        const outlinedInput = container.querySelector('.MuiOutlinedInput-root');
        expect(outlinedInput).to.exist;
    });

    it('handles readonly state', function () {
        form = { ...form, readonly: true };

        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const select = container.querySelector('.MuiSelect-select');
        expect(select.className).to.include('Mui-disabled');
    });

    it('handles titleFun when provided', function () {
        const titleFun = (val) => `Dynamic: ${val}`;
        form = { ...form, title: undefined, titleFun };

        const { container } = render(
            <Multiselect form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('.MuiInputLabel-root');
        expect(label).to.exist;
        expect(label.textContent).to.include('Dynamic: 1'); // value gets converted to index
    });
});
