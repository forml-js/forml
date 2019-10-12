import debug from 'debug';
import {merge} from 'lodash';
import {createElement as h} from 'react';

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
    const decorator = merge({}, defaultDecorator(), template);
    return decorator;
}

function clone(value) {
    log('typeof value : %s', typeof value);
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined':
            return value;

        case 'object':
            if (Array.isArray(value)) {
                return value.map((item) => clone(item));
            }

            const result = {};
            for (let key in value) {
                result[key] = clone(value[key]);
            }
            return result;
        default:
            return value;
    }
}
