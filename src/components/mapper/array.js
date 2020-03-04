import debug from 'debug';
import cloneDeep from 'lodash.clonedeep';
import t from 'prop-types';
import {createElement as h, useEffect, useMemo, useState} from 'react';
import shortid from 'shortid';

import {ARRAY_PLACEHOLDER} from '../../constants';
import {useDecorator, useLocalizer, useModel} from '../../context';
import {FormType} from '../../types';
import {defaultForSchema, getNextSchema, traverseForm} from '../../util';
import {SchemaField} from '../schema-field';

const log = debug('rjsf:mapper:array');

export function useArrayItems(form) {
    const [items, setItems] = useState([]);
    const model             = useModel();

    useEffect(function() {
        log('useArrayItems(%O)', form);
        const value = model.getValue(form.key);
        const items = [];

        for (let i = 0; i < value.length; ++i) {
            items.push(create(i));
        }

        log('useArrayItems() : initialItems : %o', items);

        setItems(items);
    }, []);

    function create() {
        const forms = form.items.map((form) => {
            const key     = shortid();
            return {form, key};
        });

        const key = shortid();
        return {forms, key};
    }

    function add(event) {
        const current    = model.getValue(form.key);
        const nextSchema = getNextSchema(form.schema, current.length);
        const nextModel  = model.setValue([...form.key, current.length],
                                         defaultForSchema(nextSchema));
        model.onChange(event, nextModel);
        setItems([...items, create(current.length)]);
    }

    function destroyer(index) {
        function destroy(event) {
            const value     = model.getValue(form.key);
            const nextModel = model.setValue(form.key,
                                             [...value.slice(0, index), ...value.slice(index + 1)]);
            model.onChange(event, nextModel);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        }

        return destroy;
    }

    function upwardMover(index) {
        function mover(event) {
            if (index > 0) {
                const value = model.getValue(form.key);

                let tempValue = value[index];
                let tempForm  = items[index];

                items[index]     = items[index - 1];
                items[index - 1] = tempForm;
                value[index]     = value[index - 1];
                value[index - 1] = tempValue;

                const nextModel = model.setValue(form.key, [...value]);
                model.onChange(event, nextModel);
                setItems([...items]);
            }
        }

        return mover;
    }

    function downwardMover(index) {
        function mover(event) {
            if (index < items.length - 1) {
                const value = model.getValue(form.key);

                let tempValue = value[index];
                let tempForm  = items[index];

                items[index]     = items[index + 1];
                items[index + 1] = tempForm;
                value[index]     = value[index + 1];
                value[index + 1] = tempValue;

                const nextModel = model.setValue(form.key, [...value]);
                model.onChange(event, nextModel);
                setItems([...items]);
            }
        }

        return mover;
    }

    return {items, add, destroyer, upwardMover, downwardMover};
}

function ArrayItem(props) {
    const {form, index, items} = props;
    const model                = useModel();
    const deco                 = useDecorator();
    const localizer            = useLocalizer();

    let title = form.title;

    if (form.titleFun) {
        const value = model.getValue([...form.key, index]);
        title       = form.titleFun(value);
    }

    title = localizer.getLocalizedString(title);

    const destroy  = useMemo(() => items.destroyer(index), [items, index]);
    const moveUp   = useMemo(() => items.upwardMover(index), [items, index]);
    const moveDown = useMemo(() => items.downwardMover(index), [items, index]);

    return h(
        deco.Arrays.Item, {key: 'header', title, destroy, moveUp, moveDown, index}, props.children);
}

/**
 * @component ArrayComponent
 */
export default function ArrayComponent(props) {
    const {form}  = props;
    const {error} = props;
    const arrays  = [];

    const items     = useArrayItems(form);
    const deco      = useDecorator();
    const localizer = useLocalizer();

    for (let i = 0; i < items.items.length; ++i) {
        const item  = items.items[i];
        const forms = item.forms.map(function({form, key}) {
            const formCopy = copyWithIndex(form, i);
            return h(SchemaField, {key, form: formCopy, schema: formCopy.schema});
        });
        arrays.push(h(ArrayItem, {key: item.key, form, index: i, items, item}, forms));
    }

    const label = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);

    return h(deco.Arrays.Items, {add: items.add, label, description, error}, arrays);
}

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
    const copy      = cloneDeep(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function(form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    }
}
