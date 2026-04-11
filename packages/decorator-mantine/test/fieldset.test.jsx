import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, getByText } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import Fieldset from '../src/fieldset.jsx';
import { withOptions } from '../src/index.jsx';

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <MantineProvider>
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        </MantineProvider>
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
        modelStore = renderHook(() => useModelStore(schema, model)).result.current;
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    it('with no title or description', function () {
        const { container } = render(<Fieldset form={form}>{[]}</Fieldset>, { wrapper });

        const content = container.querySelector('.forml-fieldset-content-vertical');
        expect(content).to.exist;

        const fieldset = container.querySelector('.forml-fieldset');
        expect(fieldset).to.not.exist;
    });

    it('with title and description', function () {
        const { container } = render(
            <Fieldset form={{ ...form, title, description }}>{[]}</Fieldset>,
            { wrapper }
        );

        const fieldset = container.querySelector('.forml-fieldset');
        expect(fieldset).to.exist;

        const titleEl = getByText(container, title);
        expect(titleEl).to.exist;
        expect(titleEl.textContent).to.equal(title);

        const descEl = getByText(container, description);
        expect(descEl).to.exist;
        expect(descEl.textContent).to.equal(description);
    });

    it('with title and no description', function () {
        const { container } = render(
            <Fieldset form={{ ...form, title }}>{[]}</Fieldset>,
            { wrapper }
        );

        const fieldset = container.querySelector('.forml-fieldset');
        expect(fieldset).to.exist;

        const titleEl = getByText(container, title);
        expect(titleEl).to.exist;
        expect(titleEl.textContent).to.equal(title);

        const header = container.querySelector('.forml-fieldset-header');
        expect(header).to.exist;
        expect(header.textContent).to.not.include(description);
    });

    it('with description and no title', function () {
        const { container } = render(
            <Fieldset form={{ ...form, description }}>{[]}</Fieldset>,
            { wrapper }
        );

        const fieldset = container.querySelector('.forml-fieldset');
        expect(fieldset).to.exist;

        const descEl = getByText(container, description);
        expect(descEl).to.exist;
        expect(descEl.textContent).to.equal(description);

        const header = container.querySelector('.forml-fieldset-header');
        expect(header).to.exist;
        expect(header.textContent).to.not.include(title);
    });

    it('renders children', function () {
        const child = <div className="test-child">child content</div>;
        const { container } = render(<Fieldset form={form}>{child}</Fieldset>, { wrapper });

        const childEl = container.querySelector('.test-child');
        expect(childEl).to.exist;
        expect(childEl.textContent).to.equal('child content');
    });

    it('renders a header when title or description is present', function () {
        const { container } = render(
            <Fieldset form={{ ...form, title, description }}>{[]}</Fieldset>,
            { wrapper }
        );

        const header = container.querySelector('.forml-fieldset-header');
        expect(header).to.exist;
    });

    describe('layout', function () {
        it('defaults to vertical when layout is not specified', function () {
            const { container } = render(<Fieldset form={form}>{[]}</Fieldset>, { wrapper });

            expect(container.querySelector('.forml-fieldset-content-vertical')).to.exist;
            expect(container.querySelector('.forml-fieldset-content-horizontal')).to.not.exist;
        });

        it('vertical', function () {
            const { container } = render(
                <Fieldset form={{ ...form, layout: 'vertical' }}>{[]}</Fieldset>,
                { wrapper }
            );

            expect(container.querySelector('.forml-fieldset-content-vertical')).to.exist;
            expect(container.querySelector('.forml-fieldset-content-horizontal')).to.not.exist;
        });

        it('horizontal', function () {
            const { container } = render(
                <Fieldset form={{ ...form, layout: 'horizontal' }}>{[]}</Fieldset>,
                { wrapper }
            );

            expect(container.querySelector('.forml-fieldset-content-horizontal')).to.exist;
            expect(container.querySelector('.forml-fieldset-content-vertical')).to.not.exist;
        });
    });

    describe('with filled option', function () {
        beforeEach(function () {
            decorator = withOptions({ filled: true });
            wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        });

        it('adds forml-filled class when title is present', function () {
            const { container } = render(
                <Fieldset form={{ ...form, title }}>{[]}</Fieldset>,
                { wrapper }
            );

            const fieldset = container.querySelector('.forml-fieldset');
            expect(fieldset).to.exist;
            expect(fieldset.classList.contains('forml-filled')).to.be.true;
        });

        it('adds forml-filled class when description is present', function () {
            const { container } = render(
                <Fieldset form={{ ...form, description }}>{[]}</Fieldset>,
                { wrapper }
            );

            const fieldset = container.querySelector('.forml-fieldset');
            expect(fieldset).to.exist;
            expect(fieldset.classList.contains('forml-filled')).to.be.true;
        });
    });

    describe('without filled option', function () {
        it('does not add forml-filled class', function () {
            const { container } = render(
                <Fieldset form={{ ...form, title }}>{[]}</Fieldset>,
                { wrapper }
            );

            const fieldset = container.querySelector('.forml-fieldset');
            expect(fieldset).to.exist;
            expect(fieldset.classList.contains('forml-filled')).to.be.false;
        });
    });
});
