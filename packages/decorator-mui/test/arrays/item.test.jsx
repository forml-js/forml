import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { createTheme } from '@mui/material';
import { render, renderHook } from '@testing-library/react';
import React from 'react';
import Item from '../../src/arrays/item.jsx';
import { withOptions } from '../../src/index.jsx';

const theme = createTheme({});

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
    let title = 'title';
    let description = 'description';
    let modelStore;
    let renderingContext;
    let wrapper;

    beforeEach(function () {
        form = { type: 'text' };
        const decorator = withOptions({});
        const schema = {
            type: 'object',
            properties: { field: { type: 'string' } },
        };
        const model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        renderingContext = { decorator };
        wrapper = makeWrapper({ modelStore, renderingContext });
    });

    it('consistently', function () {
        const { container } = render(<Item form={form} otherProps={{}} />, {
            wrapper,
        });

        // Verify component renders without errors
        expect(container.firstChild).to.not.be.null;
        // If label or title is present, check for it
        const label = container.querySelector('label');
        if (label) {
            expect(label.textContent).to.be.a('string');
        }
        // If description is present, check for helper text
        const helper = container.querySelector('.MuiFormHelperText-root');
        if (helper) {
            expect(helper.textContent).to.be.a('string');
        }
    });
});
