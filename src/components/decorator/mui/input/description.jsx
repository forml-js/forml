import FormHelperText from '@material-ui/core/FormHelperText';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Description(props) {
  return h(FormHelperText, {}, props.children);
}
