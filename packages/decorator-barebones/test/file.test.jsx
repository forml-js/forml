import React from 'react';
import { describe, it } from 'mocha';
import * as chai from 'chai';
import { render, fireEvent, screen, renderHook } from '@testing-library/react';
import { RenderingContext, ModelContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';

import FileComponent from '../src/file.jsx';

const { expect } = chai;

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => {
        return (
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );
    };
}
describe('Barebones File Decorator', function () {
    let renderingContext;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        renderingContext = {
            mapper: {},
            decorator: {},
            localizer: (str) => str,
            prefix: '',
        };
        // Create proper schema for file field validation hooks
        const schema = {
            type: 'object',
            properties: {
                testFile: {
                    type: 'string',
                    format: 'binary',
                },
            },
        };
        const data = {};
        modelStore = renderHook(() => useModelStore(schema, data)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext });
    });

    it('renders file input with title', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
            description: 'Choose a file to upload',
        };
        const onChange = () => {};

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        expect(screen.getByText('Test File')).to.exist;
        expect(screen.getByText('Choose a file to upload')).to.exist;
        expect(screen.getByText('Choose File')).to.exist;
        expect(screen.getByText('Reset')).to.exist;
    });

    it('renders file input without title', function () {
        const form = {
            key: 'testFile',
            description: 'Choose a file to upload',
        };
        const onChange = () => {};

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        expect(screen.queryByRole('label')).to.not.exist;
        expect(screen.getByText('Choose a file to upload')).to.exist;
    });

    it('renders file input without description', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
        };
        const onChange = () => {};

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        expect(screen.getByText('Test File')).to.exist;
        expect(screen.queryByText('Choose a file to upload')).to.not.exist;
    });

    it('handles file selection', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
        };
        let capturedEvent = null;
        let capturedResult = null;
        const onChange = (event, result) => {
            capturedEvent = event;
            capturedResult = result;
        };

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        // Get the hidden file input
        const fileInputs = screen.getAllByDisplayValue('');
        const hiddenFileInput = fileInputs.find(
            (input) => input.type === 'file' && input.style.display === 'none'
        );

        expect(hiddenFileInput).to.exist;

        // Create a mock file
        const file = new File(['test content'], 'test.txt', {
            type: 'text/plain',
        });

        // Simulate file selection
        Object.defineProperty(hiddenFileInput, 'files', {
            value: [file],
            writable: false,
        });

        fireEvent.change(hiddenFileInput);

        expect(capturedEvent).to.exist;
        expect(capturedResult).to.exist;
    });

    it('handles Choose File button click', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
        };
        const onChange = () => {};

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        const chooseButton = screen.getByText('Choose File');

        // Mock the click method on the hidden input
        const fileInputs = screen.getAllByDisplayValue('');
        const hiddenFileInput = fileInputs.find(
            (input) => input.type === 'file' && input.style.display === 'none'
        );

        let clickCalled = false;
        hiddenFileInput.click = () => {
            clickCalled = true;
        };

        fireEvent.click(chooseButton);

        expect(clickCalled).to.be.true;
    });

    it('handles Reset button click', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
        };
        let capturedEvent = null;
        let capturedResult = null;
        const onChange = (event, result) => {
            capturedEvent = event;
            capturedResult = result;
        };

        render(<FileComponent form={form} value={null} onChange={onChange} />, {
            wrapper,
        });

        const resetButton = screen.getByText('Reset');
        fireEvent.click(resetButton);

        expect(capturedEvent).to.exist;
        expect(capturedResult).to.be.null;
    });

    it('displays file information when file is selected', function () {
        const form = {
            key: 'testFile',
            title: 'Test File',
            options: {
                format: 'name',
            },
        };
        const onChange = () => {};

        const { container } = render(
            <FileComponent
                form={form}
                value="selected-file.txt"
                onChange={onChange}
            />,
            { wrapper }
        );

        // The display should show the file name or formatted display
        const textInput = container.querySelector('input[type="text"]');
        expect(textInput.readOnly).to.equal(true);
    });
});

