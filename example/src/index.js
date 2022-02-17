import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import debug from 'debug';
import { render } from 'react-dom';
import ReactPDF from '@react-pdf/renderer';
import Page from './components/Page';

import MaterialIcons from 'material-icons/iconfont/MaterialIcons-Regular.ttf';
import Roboto from 'fontsource-roboto/files/roboto-all-400-normal.woff';
import RobotoBold from 'fontsource-roboto/files/roboto-all-700-normal.woff';
import RobotoLight from 'fontsource-roboto/files/roboto-all-300-normal.woff';

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
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Page />
        </MuiPickersUtilsProvider>,
        document.getElementById('app')
    );
}

document.addEventListener('DOMContentLoaded', init);
