import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Container(props) {
    const {value} = props;
    return h('div', {}, [
        h(AppBar, {key: 'tab-bar', position: 'static'}, h(Tabs, {value}, props.tabs)),
        h('div', {key: 'tab-panel'}, props.panels),
    ]);
}
