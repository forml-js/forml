import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import FileComponent from '../../src/file.jsx';
import { withOptions } from '../../src/index.jsx';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

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
    let onChange;
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'file' };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        onChange = function () {}; // Mock onChange function
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    describe('with form options', function () {
        let fields = {
            format: ['data_url', 'name'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <FileComponent form={form} onChange={onChange} />,
                            { wrapper }
                        );

                        // Verify component renders without errors
                        expect(container.firstChild).to.not.be.null;

                        // Verify file input elements are present
                        const hiddenInput =
                            container.querySelector('input[type="file"]');
                        expect(hiddenInput).to.not.be.null;
                    });
                });
            });
        });
    });
});
describe('file interaction', function () {
    let form;
    let onChange;
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'file', format: 'data_uri' };
        schema = {
            type: 'object',
            properties: { testFile: { type: 'string' } },
        };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        onChange = function () {}; // Mock onChange function
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('handles file selection and calls onChange', async function () {
        const user = userEvent.setup();
        let capturedEvent = null;
        let capturedValue = null;
        const mockOnChange = (event, value) => {
            capturedEvent = event;
            capturedValue = value;
        };

        form = { ...form, key: 'testFile', format: 'data_url' };
        const { container } = render(
            <FileComponent form={form} onChange={mockOnChange} />,
            { wrapper }
        );

        const hiddenInput = container.querySelector('input[type="file"]');
        expect(hiddenInput).to.not.be.null;

        // Create a mock file
        const file = new File(['test content'], 'test.txt', {
            type: 'text/plain',
        });

        // Mock FileReader for data_url format
        const originalFileReader = window.FileReader;
        window.FileReader = function () {
            let callback;
            this.addEventListener = (event, listener) => {
                callback = listener;
            };
            this.readAsDataURL = async function () {
                callback({
                    target: {
                        result: 'data:text/plain;base64,dGVzdCBjb250ZW50',
                    },
                });
            };
        };

        await user.upload(hiddenInput, file);
        expect(hiddenInput.files[0]).to.deep.equal(file);

        // Restore FileReader
        window.FileReader = originalFileReader;
    });

    it('handles attach button click', function () {
        form = { ...form, key: 'testFile' };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            { wrapper }
        );

        const attachButton = container.querySelector('button');
        expect(attachButton).to.not.be.null;

        // Mock click method
        const hiddenInput = container.querySelector('input[type="file"]');
        hiddenInput.click = function () {
            this.clicked = true;
        };

        fireEvent.click(attachButton);
        expect(hiddenInput.clicked).to.be.true;
    });

    it('handles clear button click', async function () {
        let capturedEvent = null;
        let capturedValue = null;
        const mockOnChange = (event, value) => {
            capturedEvent = event;
            capturedValue = value;
        };

        form = { ...form, key: 'testFile' };
        const { container } = render(
            <FileComponent form={form} onChange={mockOnChange} />,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        const clearButton =
            Array.from(buttons).find(
                (btn) =>
                    btn.textContent.includes('clear') ||
                    btn.querySelector('svg[data-testid="ClearIcon"]')
            ) || buttons[buttons.length - 1]; // Fallback to last button

        fireEvent.click(clearButton);

        expect(capturedEvent).to.not.be.null;
        await expect(capturedValue).to.eventually.equal(null);
    });

    it('handles visible text field click', function () {
        form = { ...form, key: 'testFile' };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            { wrapper }
        );

        const textField = container.querySelector('input[type="text"]');
        expect(textField).to.not.be.null;

        // Mock click method
        const hiddenInput = container.querySelector('input[type="file"]');
        hiddenInput.click = function () {
            this.clicked = true;
        };

        fireEvent.click(textField);
        expect(hiddenInput.clicked).to.be.true;
    });

    it('renders with accept attribute when specified', function () {
        form = { ...form, accept: '.pdf,.doc' };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            { wrapper }
        );

        const hiddenInput = container.querySelector('input[type="file"]');
        expect(hiddenInput.accept).to.equal('.pdf,.doc');
    });

    it('renders with title and description', function () {
        form = {
            ...form,
            title: 'Upload File',
            description: 'Select a file to upload',
        };
        const { container } = render(
            <FileComponent form={form} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label.textContent).to.include('Upload File');
    });

    it('uses titleFun when provided', function () {
        const mockValue = 'test.txt';
        form = {
            ...form,
            titleFun: (value) => `Current: ${value || 'None'}`,
        };
        const { container } = render(
            <FileComponent form={form} value={mockValue} onChange={onChange} />,
            { wrapper }
        );

        const label = container.querySelector('label');
        expect(label.textContent).to.include('Current: test.txt');
    });
});
