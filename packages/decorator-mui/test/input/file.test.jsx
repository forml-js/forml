import { it, describe } from 'mocha';
import { expect } from 'chai';
import FileComponent from '../../src/file.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { withOptions } from '../../src/index.jsx';
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
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = function () {}; // Mock onChange function
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
