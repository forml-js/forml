import {
    ARRAY_PLACEHOLDER,
    ArrayPlaceholder,
    useActionsFor,
    useDecorator,
    usePrefix,
} from '@forml/hooks';
import { forwardRef, memo, useCallback, useMemo } from 'react';

import { SchemaField } from '#field';
import { clone, traverseForm } from '#util';
import { useSortable } from '@dnd-kit/react/sortable';

export const Item = memo(
    function Item(props) {
        const { form, id, index, dragType: type, disabled } = props;
        const parent = form;
        const forms = form.items;
        const prefix = usePrefix();
        const sortable = useSortable({ id, index });

        const onChange = useCallback(
            (event, nextModel) => {
                props.onChange(event, nextModel);
            },
            [props.onChange]
        );

        const fields = useMemo(() => {
            return forms.map((template, subFormIndex) => {
                if (!template) return;
                const form = copyWithKey(
                    [...prefix, ...parent.key],
                    template,
                    id
                );

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
            <ArrayItem
                {...props}
                handleRef={sortable.handleRef}
                ref={sortable.ref}
            >
                {fields}
            </ArrayItem>
        );
    },
    (prev, next) => prev.id === next.id
);

export default Item;

const ArrayItem = forwardRef(function ArrayItem(props, ref) {
    const { form, id, handleRef, onChange } = props;
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
                moveTo: function (index) {
                    const nextModel = modelActions.moveArray(
                        form.key,
                        id,
                        index
                    );
                    onChange(new Event('change', { bubbles: true }), nextModel);
                },
            };
        },
        [modelActions, id, form.key, onChange]
    );

    return (
        <ArrayDecorator.Item
            form={form}
            id={id}
            {...actions}
            dragRef={ref}
            handleRef={handleRef}
        >
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
