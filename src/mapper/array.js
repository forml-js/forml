import Collapse from '@material-ui/core/Collapse';
import FormGroup from '@material-ui/core/FormGroup';
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

import {ARRAY_PLACEHOLDER} from '../constants';
import {useModel} from '../context';
import {SchemaField} from '../schema-field';
import {defaultForSchema, getNextSchema, idFor, traverseForm} from '../util';

const log = debug('rjsf:mapper:array');

export function AddButton(props) {
    const {form} = props;

    const model      = useModel();
    const current    = model.getValue(form.key);
    const nextSchema = getNextSchema(form.schema, current.length);

    return h(IconButton, {onClick}, h(Icon, {}, 'add'));

    function onClick(e) {
        e.preventDefault();
        model.setValue([...form.key, current.length], defaultForSchema(nextSchema));
    }
}

export function DeleteButton(props) {
    const {form, index} = props;

    const model = useModel();

    return h(IconButton, {onClick}, h(Icon, {}, 'delete_forever'))

    function onClick(e) {
        e.preventDefault();
        const value = model.getValue(form.key);
        model.setValue(form.key, [...value.slice(0, index), ...value.slice(index + 1)])
    }
}

export function ArrayItem(props) {
    const {form, index}   = props;
    const [open, setOpen] = useState(false);
    const divider         = true;
    const button          = true;

    const title = h(Typography, {variant: 'subtitle1'}, form.title);

    return h(Fragment, {}, [
        h(ListItem,
          {divider, button, onClick},
          [
              h(ListItemText, {primary: title}),
              h(ListItemSecondaryAction, {}, h(DeleteButton, {form, index})),
          ]),
        h(Collapse, {'in': open}, props.children),
    ]);

    function onClick() {
        setOpen(!open);
    }
}
export function ArrayComponent(props) {
    const {form, schema} = props;
    const {value = []}   = props;
    const arrays         = [];
    log('ArrayComponent() : props : %o', props);

    for (let i = 0; i < value.length; ++i) {
        const forms = form.items.map((form, index) => {
            const newForm = copyWithIndex(form, i);
            const schema  = newForm.schema;
            const key     = idFor(newForm.key)

            log('ArrayComponent(%d:%d) : key : %o', i, index, key);

            return h(ListItem, {key}, h(SchemaField, {form: newForm, schema}));
        });

        const key = idFor(form.key) + idFor(i);
        log('ArrayComponent(%d) : key : %o', i, key);
        arrays.push(h(ArrayItem, {key, form, index: i}, forms));
    }

    return h('div', {}, [h(AddButton, {key: 'add', form}), h(List, {key: 'form'}, arrays)]);

}

function copyWithIndex(form, index) {
    const copy      = cloneDeep(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function(form) {
        log('setIndex() : form : %o', form);
        if (form.key) {
            log('setIndex(%o, %o)', form.key, index);
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    }
}
