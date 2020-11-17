import {KeyboardDateTimePicker} from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import {createElement as h} from 'react';

export default function DateTime(props) {
  const {value, form} = props;

  const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
  const disablePast = 'disablePast' in form ? form.disablePast : false;
  const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
  const variant = 'variant' in form ? form.variant : 'dialog';
  const autoOk = 'autoOk' in form ? form.autoOk : true;
  const openTo = 'openTo' in form ? form.openTo : 'hours';
  const format = 'format' in form ? form.format : 'YYYY/MM/DD HH:mm';
  const disabled = 'readonly' in form ? form.readonly : false;

  return h(KeyboardDateTimePicker, {
    value,
    onChange,
    fullWidth,
    disablePast,
    disableFuture,
    variant,
    autoOk,
    openTo,
    format,
    TextFieldComponent: ({InputProps, ...props}) =>
      h(Input, {...props, ...InputProps}),
    disabled,
  });

  function onChange(value) {
    value = value ? value.toISOString() : value;
    if (props.onChange) {
      props.onChange({target: {value}});
    }
  }
}
