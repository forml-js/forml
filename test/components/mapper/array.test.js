import { render, fireEvent, waitFor } from '@testing-library/react';
import { ArrayComponent } from '../../../src/components/mapper/array';
import '@testing-library/jest-dom/extend-expect';

import { SchemaForm, util } from '../../../src';
import { createElement as h } from 'react';

describe('items container', function () {
    let schema;
    let form;
    let model;

    beforeEach(function () {
        schema = { type: 'array', items: { type: 'number' } };
        form = ['*'];
        model = [];
    });

    test('is rendered', function () {
        const { container } = render(h(SchemaForm, { schema, form, model }));

        expect(container).toMatchSnapshot();

        expect(container.querySelector('.array')).not.toBeNull();
        expect(container.querySelector('.array ul')).not.toBeNull();
        expect(container.querySelector('.array ul')).toBeEmptyDOMElement();
    });

    describe('with an add button', function () {
        test('which renders', function () {
            const { container } = render(
                h(SchemaForm, { schema, form, model })
            );

            const button = container.querySelector('button');
            expect(button).not.toBeNull();
        });
        test('which adds an item to the model', function () {
            const onChange = jest.fn((event, newModel) => {
                model = newModel;
            });
            const { container } = render(
                h(SchemaForm, { schema, form, model, onChange })
            );

            const button = container.querySelector('button');
            fireEvent.click(button);
            expect(model.length).toBe(1);
        });
    });
});

function getComputedSpacing({
    margin = noSpacing,
    padding = noSpacing,
    border = noSpacing,
    display = 'block',
}) {
    return {
        paddingTop: `${padding.top}px`,
        paddingRight: `${padding.right}px`,
        paddingBottom: `${padding.bottom}px`,
        paddingLeft: `${padding.left}px`,
        marginTop: `${margin.top}px`,
        marginRight: `${margin.right}px`,
        marginBottom: `${margin.bottom}px`,
        marginLeft: `${margin.left}px`,
        borderTopWidth: `${border.top}px`,
        borderRightWidth: `${border.right}px`,
        borderBottomWidth: `${border.bottom}px`,
        borderLeftWidth: `${border.left}px`,
        display,
    };
}

function mockGetComputedSpacing() {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() =>
        getComputedSpacing({})
    );
}

function mockGetBoundingClientRect(el) {
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            center: { x: 0, y: 0 },
        };
    });
}

const DND_DROPPABLE_DATA_ATTR = '[data-rbd-droppable-id]';
const DND_DRAGGABLE_DATA_ATTR = '[data-rbd-draggable-id]';

function mockElementSpacing({ container }) {
    const droppables = container.querySelectorAll(DND_DROPPABLE_DATA_ATTR);
    droppables.forEach((droppable) => {
        mockGetBoundingClientRect(droppable);
        const draggables = droppable.querySelectorAll(DND_DRAGGABLE_DATA_ATTR);
        draggables.forEach((draggable) => {
            mockGetBoundingClientRect(draggable);
        });
    });
}

describe('each item', function () {
    let schema = null;
    let form = null;
    let model = null;
    let setter = null;
    let getter = null;
    let onChange = null;

    beforeEach(function () {
        schema = { type: 'array', items: { type: 'number' } };
        form = ['*'];
        model = [1];
        setter = util.valueSetter(model, schema);
        getter = util.valueGetter(model, schema);
        onChange = jest.fn((event, newModel) => {
            model = newModel;
        });

        mockGetComputedSpacing();
    });

    function set(key, value) {
        model = setter(key, value);
        setter = util.valueSetter(model, schema);
        getter = util.valueGetter(model, schema);
    }

    function get(key) {
        return getter(key);
    }

    test('is rendered', function () {
        const { container } = render(h(SchemaForm, { schema, form, model }));
        expect(container.querySelector('.array ul li')).not.toBeNull();
    });

    // jsdom can't effectively mock this well enough to make it work; skip until
    // we find a workaround
    test.skip('can be dragged into a new position', async function () {
        const onChange = jest.fn();
        model = [1, 2, 3, 4];
        const utils = render(h(SchemaForm, { model, schema, form, onChange }));
        const { container } = utils;

        mockElementSpacing(utils);

        const items = container.querySelectorAll('.array .item .title');
        const source = items[2];
        const destination = items[3];

        source.focus();
        await fireEvent.keyDown(source, { keyCode: 32 });
        await fireEvent.keyDown(source, { keyCode: 40 });
        await fireEvent.keyDown(source, { keyCode: 32 });

        expect(onChange).toHaveBeenCalled();
    });

    describe('has controls', function () {
        test('to move up', function () {
            model = [1, 2];
            const { container } = render(
                h(SchemaForm, { schema, form, model, onChange })
            );

            let button = container.querySelectorAll('.array .item .move-up');
            expect(button).not.toBeNull();
            expect(button.length).toBe(2);

            // Select the second button to move the second element UP into the first slot
            button = button[1];
            fireEvent.click(button);

            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2, 1]);
        });

        test('to move down', function () {
            model = [1, 2];
            const { container } = render(
                h(SchemaForm, { schema, form, model, onChange })
            );

            let button = container.querySelectorAll('.array .item .move-down');
            expect(button).not.toBeNull();
            expect(button.length).toBe(2);

            // Select the first button to move the first element DOWN into the second slot
            button = button[0];
            fireEvent.click(button);

            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2, 1]);
        });

        test('to be destroyed', function () {
            model = [1, 2];
            const { container } = render(
                h(SchemaForm, { schema, form, model, onChange })
            );

            let button = container.querySelectorAll('.array .item .delete');
            expect(button).not.toBeNull();
            expect(button.length).toBe(2);

            // Select the first button to move the first element DOWN into the second slot
            button = button[0];
            fireEvent.click(button);

            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2]);
        });
    });
});
