import { it, describe } from 'mocha';
import { expect } from 'chai';
import Checkbox from '../src/checkbox.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
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

import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { withOptions } from '../src/index.jsx';

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
        form = { type: 'checkbox', title, description, key: [] };
        decorator = withOptions({});
        schema = {
            type: 'object',
            properties: { field: { type: 'boolean' } },
        };
        model = {};
        // First create modelStore with a dummy wrapper
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        // Now create the real wrapper with the actual modelStore
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('with no title or description', function () {
        const { container } = render(<Checkbox form={form} />, { wrapper });

        const input = container.querySelector('input[type="checkbox"]');
        expect(input).to.exist;
    });

    it('with title but no description', function () {
        const { container } = render(<Checkbox form={form} title={title} />, {
            wrapper,
        });

        const input = container.querySelector('input[type="checkbox"]');
        expect(input).to.exist;
        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.equal(title);
    });

    it('when checked', function () {
        const { container } = render(<Checkbox form={form} value={true} />, {
            wrapper,
        });

        const input = container.querySelector('input[type="checkbox"]');
        expect(input).to.exist;
        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.equal(title);
        const helper = container.querySelector('.MuiFormHelperText-root');
        expect(helper).to.exist;
        expect(helper.textContent).to.equal(description);
        expect(input.checked).to.be.true;
    });
});
