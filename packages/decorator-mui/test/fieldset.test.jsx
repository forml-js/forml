import { renderHook, render, getByText } from '@testing-library/react';
import FieldSet from '../src/fieldset.jsx';
import { withOptions } from '../src/index.jsx';
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
        form = { type: 'fieldset', items: [{ key: [] }] };
        decorator = withOptions({});
        schema = { type: 'object', properties: { field: { type: 'object' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    describe('with form options', function () {
        let fields = {
            layout: ['horizontal', 'vertical'],
            disableGutters: [true, false],
            disablePadding: [true, false],
            disableMargin: [true, false],
            fullWidth: [true, false],
            Component: ['div', 'fieldset'],
            elevation: [0, 1, 2],
            icon: ['person', 'favorite'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, title, description, [field]: value };
                        const { container } = render(<FieldSet form={form} />, {
                            wrapper,
                        });

                        // Check for fieldset element
                        const fieldset =
                            container.querySelector('.MuiList-root');
                        expect(fieldset).to.exist;
                        // If title is provided, check for legend
                        if (typeof title !== 'undefined') {
                            const legend = getByText(container, 'title');
                            expect(legend).to.exist;
                            expect(legend.textContent).to.equal(title);
                        }
                        // If description is provided, check for helper text
                        if (typeof description !== 'undefined') {
                            const helper = getByText(container, 'description');
                            expect(helper).to.exist;
                            expect(helper.textContent).to.equal(description);
                        }
                    });
                });
            });
        });
    });

    it('with title and description', function () {
        const { container } = render(
            <FieldSet form={{ ...form, title, description }} />,
            { wrapper }
        );

        // Check for MuiList-root element
        const fieldset = container.querySelector('.MuiList-root');
        expect(fieldset).to.exist;
        // If title is provided, check for title in ListItemText
        if (typeof title !== 'undefined') {
            const titleElement = getByText(container, 'title');
            expect(titleElement).to.exist;
            expect(titleElement.textContent).to.equal(title);
        }
        // If description is provided, check for description in ListItemText
        if (typeof description !== 'undefined') {
            const descElement = getByText(container, 'description');
            expect(descElement).to.exist;
            expect(descElement.textContent).to.equal(description);
        }
    });

    it('with title and no description', function () {
        const { container } = render(<FieldSet form={{ ...form, title }} />, {
            wrapper,
        });

        // Check for MuiList-root element
        const fieldset = container.querySelector('.MuiList-root');
        expect(fieldset).to.exist;
        // If title is provided, check for title in ListItemText
        if (typeof title !== 'undefined') {
            const titleElement = getByText(container, 'title');
            expect(titleElement).to.exist;
            expect(titleElement.textContent).to.equal(title);
        }
    });

    it('with description and no title', function () {
        const { container } = render(
            <ModelContext.Provider value={modelStore}>
                <RenderingContext.Provider value={{ decorator }}>
                    <FieldSet form={{ ...form, description }} />
                </RenderingContext.Provider>
            </ModelContext.Provider>
        );

        // Check for MuiList-root element
        const fieldset = container.querySelector('.MuiList-root');
        expect(fieldset).to.exist;
        // If description is provided, check for description in ListItemText
        if (typeof description !== 'undefined') {
            const descElement = getByText(container, 'description');
            expect(descElement).to.exist;
            expect(descElement.textContent).to.equal(description);
        }
    });

    it('with no title or description', function () {
        const { container } = render(
            <ModelContext.Provider value={modelStore}>
                <RenderingContext.Provider value={{ decorator }}>
                    <FieldSet form={{ ...form }} />
                </RenderingContext.Provider>
            </ModelContext.Provider>
        );

        // Check for MuiList-root element
        const fieldset = container.querySelector('.MuiList-root');
        expect(fieldset).to.exist;
    });
});
