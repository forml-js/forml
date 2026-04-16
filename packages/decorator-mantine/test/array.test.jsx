/* eslint-env vitest */
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import {
    render,
    renderHook,
    fireEvent,
    getByText,
    queryByText,
} from '@testing-library/react';
import { vi, expect } from 'vitest';
import Array from '../src/array/index.jsx';
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

describe('Array', function () {
    let form;
    let schema;
    let model;
    let modelStore;
    let wrapper;
    let add;
    let decorator;

    beforeEach(function () {
        form = {
            type: 'array',
            key: ['items'],
            title: 'Items',
            description: 'List of items',
            addText: 'Add Item',
        };
        schema = {
            type: 'object',
            properties: {
                items: { type: 'array', items: { type: 'string' } },
            },
        };
        model = { items: [] };
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        add = vi.fn();
    });

    it('renders the array container', function () {
        const { container } = render(
            <Array form={form} add={add}>
                {[]}
            </Array>,
            { wrapper }
        );

        const el = container.querySelector('.forml-array');
        expect(el).to.exist;
    });

    it('renders children', function () {
        const child = (
            <div key="child" className="test-child">
                child content
            </div>
        );
        const { container } = render(
            <Array form={form} add={add}>
                {child}
            </Array>,
            { wrapper }
        );

        const childEl = container.querySelector('.test-child');
        expect(childEl).to.exist;
        expect(childEl.textContent).to.equal('child content');
    });

    describe('Empty placeholder', function () {
        it('shows Empty when array has no items', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const empty = getByText(container, 'Empty');
            expect(empty).to.exist;
        });

        it('does not show Empty when array has items', function () {
            model = { items: ['a'] };
            modelStore = renderHook(() => useModelStore(schema, model)).result
                .current;
            wrapper = makeWrapper({
                modelStore,
                renderingContext: { decorator },
            });

            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const empty = queryByText(container, 'Empty');
            expect(empty).to.not.exist;
        });
    });

    describe('header', function () {
        it('renders the title', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const title = getByText(container, form.title);
            expect(title).to.exist;
        });

        it('renders the description', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const desc = getByText(container, form.description);
            expect(desc).to.exist;
        });

        it('renders the add button', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const addButton = container.querySelector(
                '.forml-array-header-add-button'
            );
            expect(addButton).to.exist;
        });

        it('calls add when the add button is clicked', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const addButton = container.querySelector(
                '.forml-array-header-add-button'
            );
            fireEvent.click(addButton);
            expect(add).to.have.been.calledOnce;
        });

        it('does not render when no title or description', function () {
            form = { ...form, title: undefined, description: undefined };
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const header = container.querySelector('.forml-array-header');
            expect(header).to.not.exist;
        });
    });

    describe('with filled option', function () {
        beforeEach(function () {
            decorator = withOptions({ filled: true });
            wrapper = makeWrapper({
                modelStore,
                renderingContext: { decorator },
            });
        });

        it('adds data-filled attribute to the container', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const el = container.querySelector('.forml-array');
            expect(el.getAttribute('data-filled')).to.equal('true');
        });

        it('adds data-filled attribute to the header', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const header = container.querySelector('.forml-header');
            expect(header).to.exist;
            expect(header.getAttribute('data-filled')).to.equal('true');
        });
    });

    describe('without filled option', function () {
        it('does not add forml-filled class to the container', function () {
            const { container } = render(
                <Array form={form} add={add}>
                    {[]}
                </Array>,
                { wrapper }
            );

            const el = container.querySelector('.forml-array');
            expect(el.classList.contains('forml-filled')).to.be.false;
        });
    });
});

describe('Array.Item', function () {
    let form;
    let schema;
    let model;
    let modelStore;
    let wrapper;
    let destroy;
    let moveUp;
    let moveDown;
    let decorator;
    let firstId;
    let middleId;
    let lastId;

    beforeEach(function () {
        form = { type: 'array', key: ['items'] };
        schema = {
            type: 'object',
            properties: {
                items: { type: 'array', items: { type: 'string' } },
            },
        };
        model = { items: ['a', 'b', 'c'] };
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        destroy = vi.fn();
        moveUp = vi.fn();
        moveDown = vi.fn();

        const { keyMaps } = modelStore.getState();
        firstId = keyMaps['items'].indexToKey[0];
        middleId = keyMaps['items'].indexToKey[1];
        lastId = keyMaps['items'].indexToKey[2];
    });

    it('renders children', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                <div className="test-child">child</div>
            </Array.Item>,
            { wrapper }
        );

        const child = container.querySelector('.test-child');
        expect(child).to.exist;
        expect(child.textContent).to.equal('child');
    });

    it('renders the drag handle', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const handle = container.querySelector('.forml-array-item-draghandle');
        expect(handle).to.exist;
    });

    it('calls moveUp when the move up button is clicked', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={middleId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        fireEvent.click(buttons[0]);
        expect(moveUp).to.have.been.calledOnce;
    });

    it('calls moveDown when the move down button is clicked', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={middleId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        fireEvent.click(buttons[1]);
        expect(moveDown).to.have.been.calledOnce;
    });

    it('calls destroy when the destroy button is clicked', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        fireEvent.click(buttons[2]);
        expect(destroy).to.have.been.calledOnce;
    });

    it('disables move up button for the first item', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons[0].disabled).to.be.true;
    });

    it('disables move down button for the last item', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={lastId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons[1].disabled).to.be.true;
    });

    it('does not disable move up for a non-first item', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={middleId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons[0].disabled).to.be.false;
    });

    it('does not disable move down for a non-last item', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={middleId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons[1].disabled).to.be.false;
    });

    it('adds dragging class when isDragging is true', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
                isDragging={true}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const item = container.querySelector('.forml-array-item');
        expect(item.classList.contains('forml-array-item-dragging')).to.be.true;
    });

    it('does not add dragging class when isDragging is false', function () {
        const { container } = render(
            <Array.Item
                form={form}
                id={firstId}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
                isDragging={false}
            >
                {[]}
            </Array.Item>,
            { wrapper }
        );

        const item = container.querySelector('.forml-array-item');
        expect(item.classList.contains('forml-array-item-dragging')).to.be
            .false;
    });
});
