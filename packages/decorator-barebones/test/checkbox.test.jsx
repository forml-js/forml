import { expect } from 'vitest';
import Checkbox from '../src/checkbox.jsx';
import { RenderingContext, ModelContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import * as decorator from '../';

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

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';
    let styles;
    let root;
    let header;
    let icon;
    let schema;
    let renderingContext;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        schema = { type: 'boolean' };
        renderingContext = { decorator };
        form = { type: 'checkbox', key: [] };
        modelStore = renderHook(() => useModelStore(schema, { baz: [] })).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext });
    });

    it('with no title or description', function () {
        const { container } = render(<Checkbox form={form} />, { wrapper });
        expect(container).toMatchSnapshot();
    });

    it('with title but no description', function () {
        const { container } = render(<Checkbox form={form} title={title} />, {
            wrapper,
        });

        expect(container).toMatchSnapshot();
    });

    it('when checked', function () {
        const { container } = render(
            <Checkbox
                form={form}
                title={title}
                description={description}
                checked={true}
            />,
            { wrapper }
        );

        expect(container).toMatchSnapshot();
    });
});
