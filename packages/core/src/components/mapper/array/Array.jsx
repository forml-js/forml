import { FormContext } from '@forml/context';
import {
    createArrayKeyStore,
    useActionsFor,
    useArrayFormActions,
    useArrayKeyCount,
    useDecorator,
    useValue,
} from '@forml/hooks';
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

    const array = useValue(form.key);
    const store = useRef(createArrayKeyStore(array)).current;

    return (
        <FormContext.Provider value={store}>
            <ArrayContainer {...props}>
                <ArrayRanges form={form} onChange={onChange} />
            </ArrayContainer>
        </FormContext.Provider>
    );
}

// TODO: Drop ranges -- use the same ref-based technique for the items themselves
function ArrayRanges(props) {
    const { form, onChange } = props;
    const keys = useArrayKeyCount();
    const perRange = 10;
    const totalRanges = Math.ceil(keys / perRange);
    const ranges = useRef([]).current;

    const makeRange = useCallback(
        function makeRange(index, start, end) {
            return (
                <Range
                    key={index}
                    form={form}
                    start={start}
                    end={end}
                    onChange={onChange}
                />
            );
        },
        [form, onChange]
    );

    useMemo(
        function () {
            ranges.splice(0, ranges.length);
            for (let i = 0; i < totalRanges; ++i) {
                const start = i * perRange;
                const end = start + perRange;
                ranges.push(makeRange(i, start, end));
            }
        },
        [makeRange]
    );

    useMemo(
        function () {
            if (ranges.length < totalRanges) {
                const start = ranges.length * perRange;
                const end = start + perRange;
                ranges.push(makeRange(totalRanges, start, end));
            } else if (ranges.length > totalRanges) {
                ranges.pop();
            }
        },
        [totalRanges]
    );

    return <>{ranges}</>;
}

const ArrayContainer = forwardRef(function ArrayContainer(props, ref) {
    const { form, value } = props;
    const ArrayDecorator = useDecorator('array');
    const actions = useActionsFor(form.key, useArrayFormActions());

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
