import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';

const log = debug('rjsf:mapper:number');

const valueExceptions = ['', '-'];

export function Number(props) {
    const {schema, value} = props;
    log('Number() : value : %o', value);
    return h(TextField, {value, onChange});

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseFloat(value);

        log('onChange() : %O', value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}
