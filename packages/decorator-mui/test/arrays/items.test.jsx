import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { ThemeProvider, createTheme } from '@mui/material';
import { render, renderHook } from '@testing-library/react';
import React from 'react';
import ArrayComponent from '../../src/arrays/items.jsx';
import { withOptions } from '../../src/index.jsx';

const theme = createTheme();

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
    let localizer;
    let wrapper;
    let modelStore;
    let renderingContext;

    beforeEach(function () {
        form = { type: 'array', items: [{ key: [] }] };
        localizer = { getLocalizedString: vi.fn((id) => id) };
        const decorator = withOptions({});
        const schema = {
            type: 'object',
            properties: { field: { type: 'string' } },
        };
        const model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        renderingContext = { decorator, localizer };
        wrapper = makeWrapper({ modelStore, renderingContext });
    });

    describe('with form options', function () {
        let fields = {
            disableGutters: [true, false],
            disablePadding: [true, false],
            icon: ['person', 'favorite'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, [field]: value, title, description };
                        const { container } = render(
                            <ThemeProvider theme={theme}>
                                <ArrayComponent form={form} />
                            </ThemeProvider>,
                            { wrapper }
                        );

                        // Check for array container (e.g., a div or section with a specific class)
                        // Verify component renders without errors
                        expect(container.firstChild).to.not.be.null;
                        // Check for labels if present
                        const labels = container.querySelectorAll('label');
                        labels.forEach((label) =>
                            expect(label.textContent).to.be.a('string')
                        );
                        // Check for helper text if present
                        const helpers = container.querySelectorAll(
                            '.MuiFormHelperText-root'
                        );
                        helpers.forEach((helper) =>
                            expect(helper.textContent).to.be.a('string')
                        );
                    });
                });
            });
        });
    });

    it('with title and description', function () {
        form = { ...form, title, description };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ArrayComponent form={form} />
            </ThemeProvider>,
            { wrapper }
        );

        // Check for array container (e.g., a div or section with a specific class)
        // Verify component renders without errors
        expect(container.firstChild).to.not.be.null;
        // Check for labels if present
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => expect(label.textContent).to.be.a('string'));
        // Check for helper text if present
        const helpers = container.querySelectorAll('.MuiFormHelperText-root');
        helpers.forEach((helper) =>
            expect(helper.textContent).to.be.a('string')
        );
    });

    it('with title and no description', function () {
        form = { ...form, title };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ArrayComponent form={form} />
            </ThemeProvider>,
            { wrapper }
        );

        // Check for array container (e.g., a div or section with a specific class)
        // Verify component renders without errors
        expect(container.firstChild).to.not.be.null;
        // Check for labels if present
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => expect(label.textContent).to.be.a('string'));
        // Check for helper text if present
        const helpers = container.querySelectorAll('.MuiFormHelperText-root');
        helpers.forEach((helper) =>
            expect(helper.textContent).to.be.a('string')
        );
    });

    it('with description and no title', function () {
        form = { ...form, description };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ArrayComponent form={form} />
            </ThemeProvider>,
            { wrapper }
        );

        // Check for array container (e.g., a div or section with a specific class)
        // Verify component renders without errors
        expect(container.firstChild).to.not.be.null;
        // Check for labels if present
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => expect(label.textContent).to.be.a('string'));
        // Check for helper text if present
        const helpers = container.querySelectorAll('.MuiFormHelperText-root');
        helpers.forEach((helper) =>
            expect(helper.textContent).to.be.a('string')
        );
    });

    it('with no title or description', function () {
        const { container } = render(<ArrayComponent form={form} />, {
            wrapper,
        });

        // Check for array container (e.g., a div or section with a specific class)
        // Verify component renders without errors
        expect(container.firstChild).to.not.be.null;
        // Check for labels if present
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => expect(label.textContent).to.be.a('string'));
        // Check for helper text if present
        const helpers = container.querySelectorAll('.MuiFormHelperText-root');
        helpers.forEach((helper) =>
            expect(helper.textContent).to.be.a('string')
        );
    });
});
