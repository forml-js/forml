import ObjectPath from 'objectpath';
import { FormContext } from '@forml/context';
import { useActionsFor, useDecorator, useArrayLength } from '@forml/hooks';
import t from 'prop-types';
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';

import { FormType } from '#types';
import { Item } from './Item.jsx';
import { Range } from './Range.jsx';

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

function ArrayComponent(props) {
    const { form, onChange } = props;
    return (
        <Container {...props}>
            <ArrayRanges form={form} onChange={onChange} />
        </Container>
    );
}

function ArrayRanges(props) {
    const { form, onChange } = props;
    const keys = useArrayLength(form.key);
    const ranges = useMemo(() => {
        const ranges = [];
        const perRange = Math.ceil(Math.sqrt(keys));
        let totalItems = 0;
        while (totalItems < keys) {
            const start = totalItems;
            const end = totalItems + perRange;
            const key = `${start}-${end}`;
            totalItems += perRange;
            ranges.push(
                <Range
                    key={key}
                    form={form}
                    start={start}
                    end={end}
                    onChange={onChange}
                />
            );
        }
        return ranges;
    }, [keys, form, onChange]);

    return <>{ranges}</>;
}

const Container = forwardRef(function Container(props, ref) {
    const { form, value } = props;
    const ArrayDecorator = useDecorator('array');
    const actions = useActionsFor(form.key);

    const addItem = useCallback(
        (event) => {
            const nextModel = actions.appendArray();
            props.onChange(event, nextModel);
        },
        [actions.appendArray, form.key, props.onChange]
    );

    return (
        <ArrayDecorator add={addItem} ref={ref} form={form} value={value}>
            {props.children}
        </ArrayDecorator>
    );
});

export { ArrayComponent as Array, Item };
export default ArrayComponent;

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
