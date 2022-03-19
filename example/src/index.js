import CssBaseline from '@mui/material/CssBaseline';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import debug from 'debug';
import { render } from 'react-dom';
import ReactPDF from '@react-pdf/renderer';
import Page from './components/Page';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

import MaterialIcons from 'material-icons/iconfont/MaterialIcons-Regular.ttf';
import Roboto from 'fontsource-roboto/files/roboto-all-400-normal.woff';
import RobotoBold from 'fontsource-roboto/files/roboto-all-700-normal.woff';
import RobotoLight from 'fontsource-roboto/files/roboto-all-300-normal.woff';

const theme = createTheme();

ReactPDF.Font.register({
    family: 'Material Icons',
    src: MaterialIcons,
    fontStyle: 'normal',
});
ReactPDF.Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: Roboto,
            fontWeight: 'normal',
            fontStyle: 'normal',
        },
        {
            src: RobotoBold,
            fontWeight: 'bold',
            fontStyle: 'normal',
        },
        {
            src: RobotoLight,
            fontWeight: 'light',
            fontStyle: 'normal',
        },
    ],
});

const log = debug('rjsf:example');

async function loadPrism() {
    await import('prismjs/components/prism-clike');
    await import('prismjs/components/prism-javascript');
}

async function init() {
    await loadPrism();

    render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <Page />
            </LocalizationProvider>
        </ThemeProvider>,
        document.getElementById('app')
    );
}

document.addEventListener('DOMContentLoaded', init);
