import debug from 'debug';
import Checkbox from '../src/checkbox.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { withOptions } from '../src/index.jsx';

const log = debug('forml:decorator-mui:test:checkbox');

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
        form = { type: 'checkbox', title, description, key: ['field'] };
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

    it('with a titleFun', function () {
        form.titleFun = vi.fn((value) => `title ${value}`);
        const value = 'test';
        const { container } = render(
            <Checkbox form={form} value={value} title={title} />,
            {
                wrapper,
            }
        );

        const label = container.querySelector('label');
        expect(label).to.exist;
        expect(label.textContent).to.equal(`title test`);
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

    describe('with readonly enabled', function () {
        beforeEach(function () {
            form = {
                type: 'checkbox',
                title,
                description,
                key: ['field'],
                readonly: true,
            };
        });
        it('disables the input field', function () {
            const { container } = render(
                <Checkbox form={form} value={true} />,
                {
                    wrapper,
                }
            );

            const input = container.querySelector('input[type="checkbox"]');
            expect(input.disabled).to.be.true;
            expect(input.getAttribute('disabled')).not.to.be.undefined;
        });
    });

    describe('with an error state', function () {
        let ajv;
        let validator;
        let errorText;
        beforeEach(function () {
            validator = vi.fn((_value) => false);
            errorText = 'error';
            ajv = {
                compile: vi.fn(() => validator),
                errorsText: vi.fn(() => errorText),
            };
            model = { field: 'not a boolean' };
            // First create modelStore with a dummy wrapper
            modelStore = renderHook(() => useModelStore(schema, model)).result
                .current;
            modelStore.setState((state) => (state.ajv = ajv));
            wrapper = makeWrapper({
                modelStore,
                renderingContext: { decorator },
            });
        });
        it('the description displays an error message', function () {
            const { container } = render(<Checkbox form={form} />, {
                wrapper,
            });
            const helper = container.querySelector('.MuiFormHelperText-root');
            expect(helper).to.exist;
            expect(helper.textContent).to.equal(errorText);
        });
    });
});
