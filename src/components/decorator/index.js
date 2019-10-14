import debug from 'debug';
import merge from 'deepmerge';
import PropTypes from 'prop-types';
import {createElement as h} from 'react';

import {clone} from '../../util';

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

/**
 * Type definition for decorators
 */
export const decoratorShape = PropTypes.shape({
    /** Array decorations */
    arrays: PropTypes.shape({
        /** Individual item */
        item: PropTypes.elementType,
        /** Collection of items */
        items: PropTypes.elementType,
    }),
    /** Tab decorations */
    tabs: PropTypes.shape({
        /** Outer wrapper */
        container: PropTypes.elementType,
        /** Tab selector */
        tab: PropTypes.elementType,
        /** Tab body panel */
        panel: PropTypes.elementType,
    }),
    /** Input decorations */
    input: PropTypes.shape({
        /** Description and error wrapper */
        description: PropTypes.elementType,
        /** Base input element */
        form: PropTypes.elementType,
        /** Form and label wrapper */
        group: PropTypes.elementType,
        /** Select menu option wrapper */
        option: PropTypes.elementType,
        /** Select menu */
        select: PropTypes.elementType,
    }),
    /** Specialized checkbox decorator */
    checkbox: PropTypes.elementType,
    /** Input collection decorator */
    fieldset: PropTypes.elementType,
    /** General collection decorator */
    group: PropTypes.elementType,
    /** Input label decorator */
    label: PropTypes.elementType,
    /** Basic text decorator */
    text: PropTypes.elementType,
});
