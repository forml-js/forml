import Text from '../src/text.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import {
    render,
    renderHook,
    queryByText,
    fireEvent,
} from '@testing-library/react';
import DecoratorMUI, { withOptions } from '../src/index.jsx';
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
    let title = 'title'; // Used for form.title
    let description = 'description'; // Used for form.description
    let value = 'test value';
    let onChange;
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'text', key: 'field', title, description };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = function () {}; // Mock onChange function
    });

    it('renders basic TextField with title and description', function () {
        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={{}}
            />,
            { wrapper }
        );

        // Assert the TextField is rendered
        const textField = container.querySelector('.MuiTextField-root');
        expect(textField).to.exist;

        // Assert the input element exists
        const input = container.querySelector('input');
        expect(input).to.exist;
        expect(input.value).to.equal(value);

        // The label should be present
        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);

        // The helper text (description) should be rendered
        const helper = queryByText(container, description);
        expect(helper).to.exist;
        expect(helper.textContent).to.equal(description);
    });

    it('renders without title', function () {
        form = { ...form, title: undefined };

        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={{}}
            />,
            { wrapper }
        );

        const textField = container.querySelector('.MuiTextField-root');
        expect(textField).to.exist;

        const input = container.querySelector('input');
        expect(input).to.exist;
    });

    it('renders without description', function () {
        form = { ...form, description: undefined };

        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={{}}
            />,
            { wrapper }
        );

        const textField = container.querySelector('.MuiTextField-root');
        expect(textField).to.exist;

        const input = container.querySelector('input');
        expect(input).to.exist;
        expect(input.value).to.equal(value);
    });

    it('respects variant option from decorator', function () {
        decorator = withOptions({ variant: 'outlined' });
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });

        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={{}}
            />,
            { wrapper }
        );

        const textField = container.querySelector('.MuiTextField-root');
        expect(textField).to.exist;

        // Check for outlined variant class
        const outlinedInput = container.querySelector('.MuiOutlinedInput-root');
        expect(outlinedInput).to.exist;
    });

    it('handles titleFun when provided', function () {
        const titleFun = (val) => `Dynamic: ${val}`;
        form = { ...form, title: undefined, titleFun };

        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={{}}
            />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include('Dynamic: test value');
    });

    it('passes through otherProps to TextField', function () {
        const otherProps = { 'data-testid': 'custom-textfield' };

        const { container } = render(
            <Text
                form={form}
                value={value}
                onChange={onChange}
                otherProps={otherProps}
            />,
            { wrapper }
        );

        const textField = container.querySelector(
            '[data-testid="custom-textfield"]'
        );
        expect(textField).to.exist;
    });
});
