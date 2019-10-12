import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import clsx from 'classnames';
import {createElement as h, useState} from 'react';

import {useDecorator} from '../context';
import {SchemaField} from '../schema-field';
import {useKeyGenerator} from '../util';

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
    const generateKey       = useKeyGenerator();
    const deco              = useDecorator();

    const tabs = [];
    const panels = [];
    for (let index = 0; index < form.tabs.length; ++index) {
        const tab      = form.tabs[index];
        const {schema} = tab;
        const active   = value === index;
        const activate = () => setValue(index);
        tabs.push(h(deco.tabs.tab, {key: generateKey(tab), form: tab, active, activate}));
        panels.push(h(deco.tabs.panel,
                      {
                          key: generateKey(tab),
                          form: tab,
                          active,
                      },
                      h(SchemaField, {form: tab, schema})));
    }

    return h(deco.tabs.container, {className: form.htmlClass, form, value, tabs, panels});

    function onChange(event, value) {
        setValue(value)
    }
}
