import MuiTab from '@material-ui/core/Tab';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Tab(props) {
    const {label}    = props;
    const {activate} = props;

    return h(MuiTab, {onClick: activate, label}, label);
}
