import Typography from '@material-ui/core/Typography';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Text(props) {
  const {form} = props;
  const {variant, align, color} = form;
  const {noWrap, paragraph} = form;

  return h(
      Typography, {variant, align, color, noWrap, paragraph, ...form.otherProps}, props.children);
}
