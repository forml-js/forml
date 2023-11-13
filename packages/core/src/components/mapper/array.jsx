import objectPath from 'objectpath';
import t from 'prop-types';
import React, {
    useEffect,
    useMemo,
    useState,
    forwardRef,
    useCallback,
} from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { ARRAY_PLACEHOLDER } from '../../constants';
import { useDecorator, useLocalizer, useModel } from '@forml/hooks';
import { FormType } from '../../types';
import {
    clone,
    defaultForSchema,
    getNextSchema,
    traverseForm,
} from '../../util';
import { SchemaField } from '../schema-field';

function useCallbackGenerator(generator, args) {
    return useCallback(generator(...args), args);
}

export function mover(items, value) {
    return function move(start, end) {
        return [reorder(items, start, end), reorder(value, start, end)];
        function reorder(list, start, end) {
            const result = Array.from(list);
            const [removed] = result.splice(start, 1);
            result.splice(end, 0, removed);
            return result;
        }
    };
}

function _mover(items, value) {
    return useCallbackGenerator(mover, [items, value]);
}

export function creator(form) {
    return function create() {
        const forms = form.items.map(({ ...form }) => {
            const key = shortid();
            return { form, key };
        });

        const key = shortid();
        return { forms, key };
    };
}

function _creator(form) {
    return useCallbackGenerator(creator, [form]);
}

function makeUpwardMover(form, model, move, setItems) {
    return function upwardMover(index) {
        function mover(event) {
            if (index > 0) {
                const [nextItems, nextValue] = move(index, index - 1);
                const nextModel = model.setValue(form.key, nextValue);
                model.onChange(event, nextModel);
                setItems(nextItems);
            }
        }

        return mover;
    };
}

function makeDownwardMover(form, model, move, items, setItems) {
    return function downwardMover(index) {
        function mover(event) {
            if (index < items.length - 1) {
                const [nextItems, nextValue] = move(index, index + 1);
                const nextModel = model.setValue(form.key, nextValue);
                model.onChange(event, nextModel);
                setItems(nextItems);
            }
        }

        return mover;
    };
}

export function useArrayItems(form, disabled = false) {
    const [items, setItems] = useState([]);
    const model = useModel();

    const value = model.getValue(form.key);
    const move = _mover(items, value);
    const create = _creator(form);

    useEffect(
        function () {
            const nextItems = items ? [...items] : [];

            for (let i = 0; i < value.length; ++i) {
                if (nextItems[i]) {
                    nextItems[i].forms = nextItems[i].forms.map(
                        ({ form: subForm, key }, index) => {
                            subForm = { ...form.items[index] };
                            return { form: subForm, key };
                        }
                    );
                } else {
                    const item = create(i);
                    nextItems.push(item);
                }
            }

            setItems(nextItems);
        },
        [form]
    );

    const add = useCallback(
        function add(event) {
            const nextSchema = getNextSchema(form.schema, value.length);
            const nextModel = model.setValue(
                [...form.key, value.length],
                defaultForSchema(nextSchema)
            );
            model.onChange(event, nextModel);
            setItems([...items, create(items.length)]);
        },
        [form, value, model, items, create]
    );

    const destroyer = useCallback(
        function destroyer(index) {
            function destroy(event) {
                const nextValue = Array.from(value);
                nextValue.splice(index, 1);

                const nextItems = Array.from(items);
                nextItems.splice(index, 1);

                const nextModel = model.setValue(form.key, nextValue);
                model.onChange(event, nextModel);
                setItems(nextItems);
            }

            return destroy;
        },
        [value, items, model, form]
    );

    const upwardMover = useCallbackGenerator(makeUpwardMover, [
        form,
        model,
        move,
        setItems,
    ]);
    const downwardMover = useCallbackGenerator(makeDownwardMover, [
        form,
        model,
        move,
        items,
        setItems,
    ]);

    return useMemo(() => {
        if (!disabled) {
            return {
                items,
                setItems,
                add,
                destroyer,
                upwardMover,
                downwardMover,
                move,
            };
        } else {
            return {
                items,
                setItems,
                add: /* istanbul ignore next */ () => null,
                destroyer: () => null,
                upwardMover: () => null,
                downwardMover: () => null,
                move: /* istanbul ignore next */ () => null,
            };
        }
    }, [
        items,
        setItems,
        add,
        destroyer,
        upwardMover,
        downwardMover,
        move,
        disabled,
    ]);
}

function BaseArrayItem(props, ref) {
    const { form } = props;
    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [form]
    );

    const Component = useMemo(() => {
        if (dragDrop) {
            return DraggableArrayItem;
        } else {
            return NormalArrayItem;
        }
    }, [dragDrop]);

    return <Component {...props} ref={ref} />;
}

const NormalArrayItem = forwardRef(function NormalArrayItem(props, ref) {
    const { form, items, value, index } = props;
    const { readonly: disabled } = form;
    const deco = useDecorator();
    const localizer = useLocalizer();

    const title = useMemo(() => {
        let title = form.title;
        if (form.titleFun) {
            title = form.titleFun(value);
        }

        return localizer.getLocalizedString(title);
    }, [form, value, localizer]);

    const actions = useMemo(
        () => ({
            destroy: items.destroyer(index),
            moveUp: items.upwardMover(index),
            moveDown: items.downwardMover(index),
        }),
        [items, index]
    );

    return (
        <deco.Arrays.Item
            disabled={disabled}
            title={title}
            index={index}
            form={form}
            {...actions}
            {...props}
            ref={ref}
        >
            {props.children}
        </deco.Arrays.Item>
    );
});

function DraggableItemFactory(props, ref) {
    return function DraggableItem(provided) {
        const { draggableProps, dragHandleProps } = provided;
        const injectRef = (e) => {
            provided.innerRef(e);
            if (ref) ref(e);
        };
        const otherProps = useMemo(
            () => ({ ...props.otherProps, draggableProps, dragHandleProps }),
            [props, draggableProps, dragHandleProps]
        );
        return (
            <NormalArrayItem
                {...props}
                {...provided}
                otherProps={otherProps}
                ref={injectRef}
            >
                {props.children}
            </NormalArrayItem>
        );
    };
}

const DraggableArrayItem = forwardRef(function DraggableArrayItem(props, ref) {
    return (
        <Draggable draggableId={props.id} index={props.index}>
            {DraggableItemFactory(props, ref)}
        </Draggable>
    );
});

export const ArrayItem = forwardRef(BaseArrayItem);

/**
 * @name ArrayComponent
 * @component ArrayComponent
 * @description
 * A wrapper for the array that utilizes the useArrayItems hook
 * to keep track of its children. Invokes the [Context's](/docs/context)
 *
 * Usage:
 *
 * ```jsx
 * const value = ['a', 'b', 'c'];
 * const form = {type: 'array', items: {type: 'string'}};
 * const error = null;
 * <ArrayComponent value={value} form={form} error={error} />
 * ```
 */
function ArrayComponent(props, ref) {
    const { form, value } = props;
    const { readonly: disabled } = form;

    const items = useArrayItems(form, disabled);
    const type = useMemo(() => objectPath.stringify(form.key), [form.key]);

    const parent = form;
    const arrays = useMemo(
        function () {
            const arrays = [];
            for (let i = 0; i < items.items.length; ++i) {
                const item = items.items[i];
                const forms = item.forms.map(function ({ form, key }) {
                    if (!form) return;
                    const formCopy = copyWithIndex(form, i);

                    /**
                     * Override properties of the child form
                     * titleFun - to generate a title for the sub-form
                     * disabled - to propagate the disabled state to children
                     */
                    formCopy.titleFun =
                        'titleFun' in formCopy
                            ? formCopy.titleFun
                            : form.titleFun;
                    formCopy.readonly =
                        'readonly' in formCopy ? formCopy.readonly : disabled;

                    return (
                        <SchemaField
                            key={key}
                            form={formCopy}
                            schema={formCopy.schema}
                            parent={parent}
                        />
                    );
                });

                arrays.push(
                    <ArrayItem
                        key={item.key}
                        id={item.key}
                        form={form}
                        index={i}
                        value={value[i]}
                        items={items}
                        item={item}
                        type={type}
                    >
                        {forms}
                    </ArrayItem>
                );
            }
            return arrays;
        },
        [items.items]
    );

    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [form]
    );
    const Component = useMemo(() =>
        dragDrop ? DraggableArrayContainer : NormalArrayContainer
    );

    return (
        <Component items={items} {...props}>
            {arrays}
        </Component>
    );
}

const DraggableArrayContainer = forwardRef(
    function DraggableArrayContainer(props, ref) {
        const { form, items } = props;
        const droppableId = useMemo(shortid);
        const model = useModel();
        const onDragEnd = useCallback(
            function onDragEnd(result) {
                if (!result.destination) {
                    return;
                } else if (result.destination.index === result.source.index) {
                    return;
                } else {
                    const [nextItems, nextValue] = items.move(
                        result.source.index,
                        result.destination.index
                    );
                    const nextModel = model.setValue(form.key, nextValue);
                    model.onChange({ target: { value: nextModel } }, nextModel);
                    items.setItems(nextItems);
                }
            },
            [items, model, form]
        );
        const renderDraggableItems = useCallback(
            (provided) => {
                const injectRef = (e) => {
                    provided.innerRef(e);
                    if (ref) ref(e);
                };
                return (
                    <NormalArrayContainer {...props} ref={injectRef}>
                        {props.children}
                        {provided.placeholder}
                    </NormalArrayContainer>
                );
            },
            [props]
        );

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={droppableId}>
                    {renderDraggableItems}
                </Droppable>
            </DragDropContext>
        );
    }
);

const NormalArrayContainer = forwardRef(
    function NormalArrayContainer(props, ref) {
        const { form, items } = props;
        const { readonly: disabled, titleFun } = form;
        const model = useModel();
        const value = model.getValue(form.key);
        const deco = useDecorator();
        const localizer = useLocalizer();
        const title = useMemo(
            () => localizer.getLocalizedString(titleFun?.(value) ?? form.title),
            [localizer, value, form, titleFun]
        );
        const description = localizer.getLocalizedString(form.description);
        const { error } = props;
        const otherProps = useMemo(() => form.otherProps ?? {}, [form]);

        return (
            <deco.Arrays.Items
                className={form.htmlClass}
                add={items.add}
                value={value}
                title={title}
                description={description}
                error={error}
                ref={ref}
                otherProps={otherProps}
                disabled={disabled}
                form={form}
            >
                {props.children}
            </deco.Arrays.Items>
        );
    }
);

export default forwardRef(ArrayComponent);

ArrayComponent.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the array */
    value: t.array,
};

ArrayComponent.defaultProps = {
    value: [],
};

function copyWithIndex(form, index) {
    const copy = clone(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function (form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    };
}
