import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiSelect from '@material-ui/core/Select';
import debug from 'debug';
import t from 'prop-types';
import {createElement as h, useEffect, useState} from 'react';

import {useDecorator, useLocalizer, useModel} from '../../context';
import {FormType} from '../../types';

const log = debug('rjsf:mapper:select');

/**
 * @component Select
 */
export default function Select(props) {
    const {form, schema, error, value} = props;

    const deco                         = useDecorator();
    const localizer                    = useLocalizer();

    const title       = localizer.getLocalizedString(form.title);
    const placeholder = localizer.getLocalizedString(form.placeholder);
    const description = form.description;

    const menuItems = [];
    for (let i = 0; i < form.titleMap.length; i++) {
        const {name, value} = form.titleMap[i];
        menuItems.push(h(deco.Input.Option, {key: name, value}, name));
    }

    return h(deco.Input.Group, {form, error}, [
        h(deco.Label, {key: 'label', required: form.required}, title),
        h(deco.Input.Select,
          {key: 'select', value, placeholder, disabled: form.readonly, onChange},
          menuItems),
        (error || description) &&
            h(deco.Input.Description,
              {key: 'help', error: !!error},
              localizer.getLocalizedString(error || description))
    ]);

    function getLabel(item) {
        const {displayFn, noLocalization} = schema;

        if (displayFn) {
            return displayFn(item);
        }

        return item.name;
    }

    function onChange(event, what) {
        log('onChange(%o)', event);
        props.onChange(event, event.target.value);
    }
}

Select.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.string,
}
