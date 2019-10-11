import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import clsx from 'classnames';
import {createElement as h, useState} from 'react';

import {SchemaField} from '../schema-field';

const useStyles = makeStyles(function(theme) {
    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
        },
        panel: {
            display: 'flex',
            flex: '0 1 0',
            overflow: 'hidden',
            flexWrap: 'nowrap',
            whitespace: 'nowrap',
            transition: 'all 0.3s',
            padding: theme.spacing(2, 0),
        },
        active: {
            flex: '1 0 auto',
            padding: theme.spacing(2, 2),
        },
        view: {
            display: 'flex',
            flexDirection: 'row',
        }
    };
});

export function Tabs(props) {
    const [value, setValue] = useState(0);
    const classes           = useStyles();
    const {form}            = props;

    const tabs = [];
    const panels = [];
    for (let index = 0; index < form.tabs.length; ++index) {
        const tab      = form.tabs[index];
        const {schema} = tab;
        const active   = value === index;
        tabs.push(h(Tab, {label: tab.title}));
        panels.push(h('div',
                      {className: clsx(classes.panel, {[classes.active]: value === index})},
                      h(SchemaField, {form: tab, schema})));
    }

    return h('div', {className: clsx(classes.root, form.htmlClass)}, [
        h(AppBar, {position: 'static'}, h(MuiTabs, {onChange, value}, tabs)),
        h('div', {className: classes.view}, panels),
    ]);

    function onChange(event, value) {
        setValue(value)
    }
}
