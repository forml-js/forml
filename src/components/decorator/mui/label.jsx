import InputLabel from '@material-ui/core/InputLabel';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Label({error, ...props}) {
  const shrink =
        props.focused || (props.value !== undefined && props.value !== '');
  const inputProps = {shrink, error: !!error};

  return h(InputLabel, inputProps, props.children);
}
