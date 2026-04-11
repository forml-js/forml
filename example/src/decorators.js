import * as mui from '@forml/decorator-mui';
import mantine from '@forml/decorator-mantine';
import barebones from '@forml/decorator-barebones';
//import * as pdf from '@forml/decorator-pdf';
import { util } from '@forml/core';

const muiStandard = mui.withOptions({ variant: 'standard' });
const muiOutlined = mui.withOptions({ variant: 'outlined' });
const muiFilled = mui.withOptions({ variant: 'filled' });
const mantineFilled = mantine.withOptions({ filled: true });

export default {
    'Material UI (Standard)': muiStandard,
    'Material UI (Outlined)': muiOutlined,
    'Material UI (Filled)': muiFilled,
    Mantine: mantine,
    'Mantine (Filled)': mantineFilled,
    'Raw HTML': barebones,
    //'PDF Renderer': util.clone(pdf),
};
