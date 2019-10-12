import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiSelect from '@material-ui/core/Select';
import debug from 'debug';
import {createElement as h, useEffect, useState} from 'react';

import {useDecorator, useModel} from '../context';
import {useKeyGenerator} from '../util';

const log = debug('rjsf:mapper:select');

export function Select(props) {
    const {form, schema, error, value} = props;
    const generateKey                  = useKeyGenerator()
    const deco                         = useDecorator();

    const menuItems = [];

    for (let i = 0; i < form.titles.length; i++) {
        const name  = form.titles[i];
        const value = schema.enum[i];
        menuItems.push(h(deco.input.option, {key: generateKey(form, value), value}, name));
    }

    return h(deco.input.group, {form, error}, [
        h(deco.label, {key: 'label', required: form.required}, form.title),
        h(deco.input.select,
          {key: 'select', value, placeholder: form.placeholder, disabled: form.readonly, onChange},
          menuItems),
        h(deco.input.description, {key: 'help', error}, error || form.description)
    ]);

    function getLabel(item) {
        const {displayFn, noLocalization} = schema;

        if (displayFn) {
            return displayFn(item);
        }

        return item.name;
    }

    function onChange(event, what) {
        props.onChange(event, event.target.value);
    }
}
