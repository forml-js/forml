import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import {cloneDeep} from 'lodash';
import ObjectPath from 'objectpath';
import {createElement as h, Fragment, useState} from 'react';
import shortid from 'shortid';

import {ARRAY_PLACEHOLDER} from '../constants';
import {useModel} from '../context';
import {SchemaField} from '../schema-field';
import {defaultForSchema, getNextSchema, traverseForm, useKeyGenerator} from '../util';

const log = debug('rjsf:mapper:array');

export function AddButton(props) {
    const {form, items} = props;

    const model      = useModel();

    return h(IconButton, {onClick}, h(Icon, {}, 'add'));

    function onClick(e) {
        e.preventDefault();
        items.add();
    }
}

export function DeleteButton(props) {
    const {form, index, items} = props;

    const model = useModel();

    return h(IconButton, {onClick}, h(Icon, {}, 'delete_forever'))

    function onClick(e) {
        e.preventDefault();
        items.destroy(index);
    }
}

export function ArrayItem(props) {
    const {form, index, items} = props;
    const [open, setOpen] = useState(false);
    const divider         = true;
    const button          = true;

    const title = h(Typography, {variant: 'subtitle1'}, form.title);

    return h(Fragment, {}, [
        h(ListItem,
          {key: 'header', divider, button, onClick},
          [
              h(ListItemText, {key: 'text', primary: title}),
              h(ListItemSecondaryAction, {key: 'controls'}, h(DeleteButton, {items, index})),
          ]),
        h(Collapse, {key: 'body', 'in': open}, props.children),
    ]);

    function onClick() {
        setOpen(!open);
    }
}

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
        model.setValue(form.key, [...value.slice(0, index), ...value.slice(index + 1)])
        setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    }

    return {items, add, destroy};
}

export function ArrayComponent(props) {
    const {form, schema} = props;
    const {value = []}   = props;

    const generateKey = useKeyGenerator();
    const items       = useArrayItems(form);

    const arrays         = [];

    for (let i = 0; i < value.length; ++i) {
        const item  = items.items[i];
        const forms = item.forms.map(function({form, schema, key}) {
            const formCopy = copyWithIndex(form, i);
            return h(ListItem, {key}, h(SchemaField, {form: formCopy, schema}));
        });
        arrays.push(h(ArrayItem, {key: item.key, form, index: i, items}, forms));
    }

    return h('div', {}, [
        h(AddButton, {key: 'add', form, items}),
        h(List, {key: 'form'}, arrays),
    ]);
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
