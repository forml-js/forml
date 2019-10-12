import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import cloneDeep from 'lodash.clonedeep';
import ObjectPath from 'objectpath';
import {createElement as h, Fragment, useCallback, useState} from 'react';
import shortid from 'shortid';

import {ARRAY_PLACEHOLDER} from '../constants';
import {useDecorator, useModel} from '../context';
import {SchemaField} from '../schema-field';
import {defaultForSchema, getNextSchema, traverseForm, useKeyGenerator} from '../util';

const log = debug('rjsf:mapper:array');

export function useArrayItems(form) {
    const [items, setItems] = useState([]);
    const model             = useModel();

    function create() {
        const forms = form.items.map((form, index) => {
            const schema  = form.schema;
            const key     = shortid();

            return {form, key};
        });

        const key = shortid();
        return {forms, key};
    }

    function add() {
        const current    = model.getValue(form.key);
        const nextSchema = getNextSchema(form.schema, current.length);
        model.setValue([...form.key, current.length], defaultForSchema(nextSchema));
        setItems([...items, create(current.length)]);
    }

    function destroy(index) {
        const value = model.getValue(form.key);
        model.setValue(form.key, [...value.slice(0, index), ...value.slice(index + 1)]);
        setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    }

    return {items, add, destroy};
}

export function ArrayItem(props) {
    const {form, index, items} = props;
    const deco                 = useDecorator();

    const {title} = form;
    const destroy = useCallback(() => items.destroy(index), [items, index]);

    return h(deco.arrays.item, {key: 'header', title, destroy}, props.children);
}

export function ArrayComponent(props) {
    const {form, schema} = props;
    const {value = []}   = props;
    const arrays         = [];

    const items = useArrayItems(form);
    const deco  = useDecorator();

    for (let i = 0; i < items.items.length; ++i) {
        const item  = items.items[i];
        const forms = item.forms.map(function({form, schema, key}) {
            const formCopy = copyWithIndex(form, i);
            return h(SchemaField, {form: formCopy, schema});
        });
        arrays.push(h(ArrayItem, {key: item.key, form, index: i, items}, forms));
    }

    return h(deco.arrays.items, {add: items.add}, arrays);
}

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
