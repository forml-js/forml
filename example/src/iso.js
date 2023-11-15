import CssBaseline from '@mui/material/CssBaseline';
import debug from 'debug';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SchemaForm } from '@forml/core';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import * as mui from '@forml/decorator-mui';

import MaterialIcons from 'material-icons/iconfont/MaterialIcons-Regular.ttf';
import Roboto from 'fontsource-roboto/files/roboto-all-400-normal.woff';
import RobotoBold from 'fontsource-roboto/files/roboto-all-700-normal.woff';
import RobotoLight from 'fontsource-roboto/files/roboto-all-300-normal.woff';

const log = debug('forml:iso');
const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const schema = {
    type: 'object',
    properties: {
        string: { type: 'string' },
        array: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    first: { type: 'string' },
                    last: { type: 'string' },
                },
            },
        },
    },
};
const form = ['*'];

async function init() {
    const root = createRoot(document.getElementById('app'));
    const onChange = (event, value) => {
        log('onChange(event: %o, value: %o)', event, value);
    };
    root.render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <SchemaForm
                    schema={schema}
                    form={form}
                    decorator={mui}
                    onChange={onChange}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}

document.addEventListener('DOMContentLoaded', init);
