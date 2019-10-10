import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiSelect from '@material-ui/core/Select';
import debug from 'debug';
import {createElement as h, useEffect, useState} from 'react';

import {useModel} from '../context';
import {idFor} from '../util';

const log = debug('rjsf:mapper:select');

export function Select(props) {
    const {form, schema, error, value} = props;
    const model                 = useModel();

    const menuItems = [];

    for (let i = 0; i < form.titles.length; i++) {
        const name  = form.titles[i];
        const value = schema.enum[i];
        menuItems.push(h(MenuItem, {key: idFor(value), value}, name));
    }

    log('Select() : value : %O', value);
    log('Select() : menuItems : %O', menuItems);

    return h(FormControl, {fullWidth: true, error: !!error, ...form.otherProps}, [
        h(InputLabel, {key: 'label', required: form.required}, form.title),
        h(MuiSelect,
          {key: 'select', value, placeholder: form.placeholder, disabled: form.readonly, onChange},
          menuItems),
        h(FormHelperText, {key: 'help'}, error || form.description)
    ]);

    function getLabel(item) {
        const {displayFn, noLocalization} = schema;

        if (displayFn) {
            return displayFn(item);
        }

        return item.name;
    }

    function onChange(event, what) {
        log('onChange() : event : %O', event);
        log('onChange() : what : %O', what);
        props.onChange(event, event.target.value);
    }
}
