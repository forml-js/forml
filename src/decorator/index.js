import debug from 'debug';
import merge from 'deepmerge';
import {createElement as h} from 'react';

import {clone} from '../util';

import * as barebones from './barebones';
import * as mui       from './mui';

const log = debug('rjsf:decorator');

export const decorators = {
    mui: clone(mui),
    barebones: clone(barebones)
};

export function defaultDecorator() {
    return decorators.barebones;
}

export function getDecorator(template) {
    const decorator = merge(defaultDecorator(), template);
    return decorator;
}
