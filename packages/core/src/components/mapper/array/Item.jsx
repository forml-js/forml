import React, { forwardRef, useCallback, useMemo } from 'react';
import {
    ARRAY_PLACEHOLDER,
    useDecorator,
    useLocalizer,
    useArrayActions,
} from '@forml/hooks';

import { clone, traverseForm } from '#util';
import { SchemaField } from '#field';

export const Item = forwardRef(function Item(props, ref) {
    const { parent, forms, index, disabled } = props;

    const onChange = useCallback(
        (event, nextModel) => {
            props.onChange(event, nextModel);
        },
        [props.onChange, index]
    );
    const fields = useMemo(() => {
        return forms.map((template, subFormIndex) => {
            if (!template) return;
            const form = copyWithIndex(template, index);

            if (!('titleFun' in form)) {
                if ('titleFun' in parent) {
                    form.titleFun = parent.titleFun;
                }
            }
            form.readonly =
                'readonly' in form ? form.readonly : (disabled ?? false);

            return (
                <SchemaField
                    key={subFormIndex}
                    form={form}
                    schema={form.schema}
                    parent={parent}
                    onChange={onChange}
                />
            );
        });
    }, [forms, index, parent, onChange, disabled]);

    return (
        <ArrayItem {...props} ref={ref}>
            {fields}
        </ArrayItem>
    );
});

export default Item;

const ArrayItem = forwardRef(function ArrayItem(props, ref) {
    const { form, index, onChange } = props;
    const ArrayDecorator = useDecorator('array');

    const arrayActions = useArrayActions(form.key);
    const actions = useMemo(
        function () {
            return {
                destroy: function () {
                    const nextModel = arrayActions.removeArray(index);
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
                moveUp: function () {
                    const nextModel = arrayActions.moveArray(index, index - 1);
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
                moveDown: function () {
                    const nextModel = arrayActions.moveArray(index, index + 1);
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
            };
        },
        [arrayActions, form.key, index, onChange]
    );

    return (
        <ArrayDecorator.Item index={index} form={form} {...actions} ref={ref}>
            {props.children}
        </ArrayDecorator.Item>
    );
});

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
