import Help from '../src/help.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render, renderHook, queryByText } from '@testing-library/react';
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
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'help' };
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    describe('with form options', function () {
        let fields = {
            variant: [undefined, 'h1', 'h2'],
            align: [undefined, 'left', 'right'],
            color: [undefined, 'primary', 'secondary'],
            noWrap: [undefined, true, false],
            paragraph: [undefined, true, false],
            otherProps: [undefined, {}],
        };

        beforeEach(function () {
            decorator = withOptions({});
        });

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        if (value !== undefined)
                            form = { ...form, [field]: value };

                        // Set description on the form object for this test case
                        form = { ...form, description };

                        const { container } = render(<Help form={form} />, {
                            wrapper,
                        });

                        // Assert the Typography component is rendered
                        const typography = container.querySelector(
                            '.MuiTypography-root'
                        );
                        expect(typography).to.exist;

                        // The description text should be rendered
                        const helper = queryByText(container, form.description);
                        if (form.description) {
                            expect(helper).to.exist;
                            expect(helper.textContent).to.equal(
                                form.description
                            );
                        } else {
                            expect(helper).to.not.exist;
                        }

                        // Check component type based on paragraph prop
                        const expectedTag = form.paragraph ? 'p' : 'span';
                        const element = container.querySelector(expectedTag);
                        expect(element).to.exist;
                    });
                });
            });
        });
    });
});
