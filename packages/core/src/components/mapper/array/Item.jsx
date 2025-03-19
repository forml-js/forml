import {
    ARRAY_PLACEHOLDER,
    ArrayPlaceholder,
    useActionsFor,
    useDecorator,
} from '@forml/hooks';
import React, { forwardRef, memo, useCallback, useMemo } from 'react';

import { SchemaField } from '#field';
import { clone, traverseForm } from '#util';

export const Item = memo(
    function Item(props) {
        const { form, id, ref, disabled } = props;
        const parent = form;
        const forms = form.items;

        const onChange = useCallback(
            (event, nextModel) => {
                props.onChange(event, nextModel);
            },
            [props.onChange]
        );
        const fields = useMemo(() => {
            return forms.map((template, subFormIndex) => {
                if (!template) return;
                const form = copyWithKey(parent.key, template, id);

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
        }, [forms, parent, onChange, disabled]);

        return (
            <ArrayItem {...props} ref={ref}>
                {fields}
            </ArrayItem>
        );
    },
    (prev, next) => prev.id === next.id
);

export default Item;

const ArrayItem = forwardRef(function ArrayItem(props, ref) {
    const { form, id, onChange } = props;
    const ArrayDecorator = useDecorator('array');
    const modelActions = useActionsFor(form.key);

    const actions = useMemo(
        function () {
            return {
                destroy: function () {
                    const nextModel = modelActions.removeArray(id);
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
                moveUp: function () {
                    const nextModel = modelActions.moveArrayRelative(
                        form.key,
                        id,
                        -1
                    );
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
                moveDown: function () {
                    const nextModel = modelActions.moveArrayRelative(
                        form.key,
                        id,
                        1
                    );
                    onChange(new Event('change', { bubbles: true }), nextModel);
                    return nextModel;
                },
            };
        },
        [modelActions, id, form.key, onChange]
    );

    return (
        <ArrayDecorator.Item form={form} id={id} {...actions} ref={ref}>
            {props.children}
        </ArrayDecorator.Item>
    );
});

function copyWithKey(parentKey, form, key) {
    const copy = clone(form);
    copy.arrayKey = key;
    traverseForm(copy, setKey(parentKey, key));
    return copy;
}

function setKey(parentKey, key) {
    return function (form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = ArrayPlaceholder(
                parentKey,
                key
            );
        }
    };
}
