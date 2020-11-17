import MenuItem from '@material-ui/core/MenuItem';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Option({selected, value, onClick, children}) {
  return h(MenuItem, {selected, value, onClick}, children);
}
