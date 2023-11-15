import React, { forwardRef, memo, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { ARRAY_PLACEHOLDER } from '../../../constants';
import { clone, traverseForm } from '../../../util';
import { SchemaField } from '../../schema-field';

export const Item = memo(
    forwardRef(function Item(props, ref) {
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

        const subForms = useMemo(
            () =>
                forms.map((template) => {
                    if (!template) return;
                    const form = copyWithIndex(template, index);

                    form.titleFun =
                        'titleFun' in form ? form.titleFun : parent.titleFun;
                    form.readonly =
                        'readonly' in form ? form.readonly : disabled;

                    return form;
                }),
            [forms, index, parent.titleFun, disabled]
        );
        const fields = useMemo(
            () =>
                subForms.map(function (form, index) {
                    /**
                     * Override properties of the child form
                     * titleFun - to generate a title for the sub-form
                     * disabled - to propagate the disabled state to children
                     */

                    return (
                        <SchemaField
                            key={index}
                            form={form}
                            schema={form.schema}
                            parent={parent}
                        />
                    );
                }),
            [parent, subForms]
        );

        return (
            <Component {...props} ref={ref}>
                {fields}
            </Component>
        );
    })
);

export default Item;

const NormalArrayItem = memo(
    forwardRef(function NormalArrayItem(props, ref) {
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

        const actions = useMemo(() => {
            return {
                destroy: () => props.removeArray(index),
                moveUp: () => props.moveArrayUp(index),
                moveDown: () => props.moveArrayDown(index),
            };
        }, [props.removeArray, props.moveArrayUp, props.moveArrayDown, index]);

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
    })
);

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

const DraggableArrayItem = memo(
    forwardRef(function DraggableArrayItem(props, ref) {
        return (
            <Draggable draggableId={props.id} index={props.index}>
                {DraggableItemFactory(props, ref)}
            </Draggable>
        );
    })
);

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
