import * as mui from '@forml/decorator-mui';
import * as barebones from '@forml/decorator-barebones';
import * as pdf from '@forml/decorator-pdf';
import { util } from '@forml/core';

export default {
    mui: util.clone(mui),
    barebones: util.clone(barebones),
    pdf: util.clone(pdf),
};
