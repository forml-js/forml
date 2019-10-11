import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {get} from 'lodash';
import {createElement as h} from 'react';

const log = debug('rjsf:mapper:number');

const valueExceptions = ['', '-'];

export function Number(props) {
    const {form, schema, value} = props;

    const fullWidth   = get(form, 'fullWidth', true);
    const placeholder = get(form, 'placeholder', '');
    const label       = get(form, 'title', get(form, 'key', ''));

    return h(TextField, {value, onChange, fullWidth, label, placeholder});

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseFloat(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}

export function Integer(props) {
    const {schema, value, form} = props;

    const fullWidth   = get(form, 'fullWidth', true);
    const placeholder = get(form, 'placeholder', '');
    const label       = get(form, 'title', get(form, 'key', ''));

    return h(TextField, {value, onChange, fullWidth, label, placeholder});

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseInt(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}
