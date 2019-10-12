import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';
import {useDecorator} from '../context';

const log = debug('rjsf:mapper:number');

const valueExceptions = ['', '-'];

export function Number(props) {
    const {form, schema, value} = props;

    const deco        = useDecorator();

    const placeholder = form.placeholder;
    const label       = form.title || form.key[form.key.length - 1];

    return h(deco.inputGroup, {form}, [
        h(deco.label, {form}, form.title),
        h(deco.input, {value, onChange, placeholder, form}),
    ]);

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

    const placeholder = form.placeholder;
    const label       = form.title || form.key[form.key.length - 1];

    return h(deco.inputGroup, {form}, [
        h(deco.label, {form}, form.title),
        h(deco.input, {value, onChange, placeholder, form}),
    ]);

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
