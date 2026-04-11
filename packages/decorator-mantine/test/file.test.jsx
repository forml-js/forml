import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, fireEvent, act } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import FileComponent from '../src/file.jsx';
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

describe('File', function () {
    let form;
    let schema;
    let model;
    let modelStore;
    let wrapper;
    let onChange;
    let decorator;

    beforeEach(function () {
        form = {
            type: 'file',
            key: ['field'],
            title: 'Upload',
            description: 'Choose a file',
        };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = sinon.spy();
    });

    it('renders a file input', function () {
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const input = container.querySelector('input[type="file"]');
        expect(input).to.exist;
    });

    it('displays the title as a label', function () {
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.include(form.title);
    });

    it('renders without a title', function () {
        form = { ...form, title: undefined };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const label = container.querySelector('label');
        expect(label).to.not.exist;
    });

    it('displays the description', function () {
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const desc = container.querySelector('.mantine-FileInput-description');
        expect(desc).to.exist;
        expect(desc.textContent).to.equal(form.description);
    });

    it('renders without a description', function () {
        form = { ...form, description: undefined };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const desc = container.querySelector('.mantine-FileInput-description');
        expect(desc).to.not.exist;
    });

    it('calls onChange with a synthetic event and the processed file result', async function () {
        form = { ...form, format: 'name' };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const input = container.querySelector('input[type="file"]');

        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        expect(onChange.calledOnce).to.be.true;
        const [event, result] = onChange.firstCall.args;
        expect(event.target.files).to.deep.equal([file]);
        expect(result).to.equal('test.txt');
    });

    it('passes accept to the file input', function () {
        form = { ...form, accept: 'image/*' };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            {
                wrapper,
            }
        );

        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).to.equal('image/*');
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
                <FileComponent form={form} onChange={onChange} />,
                { wrapper }
            );

            const desc = container.querySelector(
                '.mantine-FileInput-description'
            );
            expect(desc).to.exist;
            expect(desc.textContent).to.equal(errorText);
        });

        it('sets the error state on the input', function () {
            const { container } = render(
                <FileComponent form={form} onChange={onChange} />,
                { wrapper }
            );

            const button = container.querySelector(
                'button.mantine-Input-input'
            );
            expect(button).to.exist;
            expect(button.getAttribute('aria-invalid')).to.equal('true');
        });
    });
});
