import objectPath from 'objectpath';
import t from 'prop-types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { useDecorator, useKey, useLocalizer } from '@forml/hooks';
import { ARRAY_PLACEHOLDER } from '../../constants';
import { FormType } from '../../types';
import { clone, traverseForm } from '../../util';
import { SchemaField } from '../schema-field';

function BaseArrayItem(props, ref) {
    const { form, forms, index, disabled } = props;
    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [parent]
    );

    const Component = useMemo(() => {
        if (dragDrop) {
            return DraggableArrayItem;
        } else {
            return NormalArrayItem;
        }
    }, [dragDrop]);

    const fields = useMemo(
        () =>
            forms.map(function (formTemplate) {
                if (!formTemplate) return;
                const form = copyWithIndex(formTemplate, index);
                const path = objectPath.stringify(form.key);

                /**
                 * Override properties of the child form
                 * titleFun - to generate a title for the sub-form
                 * disabled - to propagate the disabled state to children
                 */
                form.titleFun =
                    'titleFun' in form ? form.titleFun : parent.titleFun;
                form.readonly = 'readonly' in form ? form.readonly : disabled;

                return (
                    <SchemaField
                        key={path}
                        form={form}
                        schema={form.schema}
                        parent={parent}
                    />
                );
            }),
        [parent, forms, index]
    );

    return (
        <Component {...props} ref={ref}>
            {fields}
        </Component>
    );
}

const NormalArrayItem = forwardRef(function NormalArrayItem(props, ref) {
    const { form, array, value, index, dragHandleProps, draggableProps } =
        props;
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
            destroy: () => array.removeArray(index),
            moveUp: () => array.moveArrayUp(index),
            moveDown: () => array.moveArrayDown(index),
        }),
        [array.removeArray, array.moveArrayUp, array.moveArrayDown, index]
    );

    return (
        <deco.Arrays.Item
            disabled={disabled}
            title={title}
            index={index}
            form={form}
            dragHandleProps={dragHandleProps}
            draggableProps={draggableProps}
            {...actions}
            ref={ref}
        >
            {props.children}
        </deco.Arrays.Item>
    );
});

function DraggableItemFactory(props, ref) {
    return function DraggableItem(provided) {
        const injectRef = (e) => {
            provided.innerRef(e);
            if (ref) ref(e);
        };
        return (
            <NormalArrayItem {...props} {...provided} ref={injectRef}>
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
    const { form, schema, value } = props;
    const { readonly: disabled } = form;

    const type = useMemo(() => objectPath.stringify(form.key), [form.key]);
    const array = useKey(form.key);

    const parent = form;
    const items = useMemo(
        function () {
            const arrays = [];
            const count = array.model?.length ?? 0;
            for (let index = 0; index < count; ++index) {
                const key = [...parent.key, index];
                const path = objectPath.stringify(key);
                arrays.push(
                    <ArrayItem
                        key={path}
                        array={array}
                        id={path}
                        form={form}
                        forms={parent.items}
                        index={index}
                        type={type}
                        schema={schema}
                    />
                );
            }
            return arrays;
        },
        [type, form, array]
    );

    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [form]
    );
    const Component = useMemo(() =>
        dragDrop ? DraggableArrayContainer : NormalArrayContainer
    );

    return (
        <Component array={array} {...props}>
            {items}
        </Component>
    );
}

const DraggableArrayContainer = forwardRef(
    function DraggableArrayContainer(props, ref) {
        const { form, array } = props;
        const droppableId = useMemo(shortid);
        const onDragEnd = useCallback(
            function onDragEnd(result) {
                if (!result.destination) {
                    return;
                } else if (result.destination.index === result.source.index) {
                    return;
                } else {
                    array.moveArray(
                        result.source.index,
                        result.destination.index
                    );
                }
            },
            [array.moveArray]
        );
        const renderDraggableItems = useCallback(
            (provided) => {
                const injectRef = (e) => {
                    provided.innerRef(e);
                    if (ref) ref(e);
                };
                return (
                    <NormalArrayContainer
                        array={array}
                        {...props}
                        ref={injectRef}
                    >
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
        const { form, array } = props;
        const { readonly: disabled, titleFun } = form;
        const deco = useDecorator();
        const localizer = useLocalizer();
        const title = useMemo(
            () =>
                localizer.getLocalizedString(
                    titleFun?.(array.model) ?? form.title
                ),
            [localizer, array.model, form, titleFun]
        );
        const description = localizer.getLocalizedString(form.description);
        const { error } = props;

        return (
            <deco.Arrays.Items
                className={form.htmlClass}
                add={array.appendArray}
                value={array.model}
                title={title}
                description={description}
                error={error}
                ref={ref}
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
