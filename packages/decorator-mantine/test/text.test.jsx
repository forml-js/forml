import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import Text from '../src/text.jsx';
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
    let value = 'test value';
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;
    let onChange;

    beforeEach(function () {
        form = { type: 'text', key: ['field'], title, description };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = sinon.spy();
    });

    it('renders an input', function () {
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-TextInput-input');
        expect(input).to.exist;
    });

    it('displays the current value', function () {
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-TextInput-input');
        expect(input.value).to.equal(value);
    });

    it('displays the title as a label', function () {
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(title);
    });

    it('displays the description', function () {
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const desc = container.querySelector('.mantine-TextInput-description');
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(description);
    });

    it('renders without a title', function () {
        form = { ...form, title: undefined };
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label).to.not.exist;
    });

    it('renders without a description', function () {
        form = { ...form, description: undefined };
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const desc = container.querySelector('.mantine-TextInput-description');
        expect(desc).to.not.exist;
    });

    it('calls onChange with event and value', async function () {
        const { container } = render(
            <Text form={form} value={value} onChange={onChange} />,
            { wrapper }
        );

        const input = container.querySelector('.mantine-TextInput-input');
        fireEvent.change(input, { target: { value: 'new value' } });

        expect(onChange.calledOnce).to.be.true;
        const [_event, val] = onChange.firstCall.args;
        expect(val).to.equal('new value');
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
            model = { field: 'not valid' };
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
                <Text form={form} value={value} onChange={onChange} />,
                { wrapper }
            );

            const desc = container.querySelector(
                '.mantine-TextInput-description'
            );
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });

        it('sets the error state on the input', function () {
            const { container } = render(
                <Text form={form} value={value} onChange={onChange} />,
                { wrapper }
            );

            const input = container.querySelector('.mantine-TextInput-input');
            expect(input).to.exist;
            expect(input.getAttribute('aria-invalid')).to.equal('true');
        });
    });
});
