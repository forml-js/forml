/**
 * @namespace rjsf.mapper
 */
import PropTypes from 'prop-types';

import Array from './array';
import Checkbox from './checkbox';
import Date from './date';
import FieldSet from './fieldset';
import Help from './help';
import Integer from './integer';
import Null from './null';
import Number from './number';
import Select from './select';
import Tabs from './tabs';
import Text from './text';
import TextArea from './textarea';

export function defaultMapper() {
    return {
        array: Array,
        checkbox: Checkbox,
        date: Date,
        fieldset: FieldSet,
        help: Help,
        integer: Integer,
        null: Null,
        number: Number,
        password: Text,
        select: Select,
        tabs: Tabs,
        text: Text,
        textarea: TextArea,
        tuple: FieldSet,
    };
}

/**
 * We're strictly a keyed collection of elements, so generate our
 * PropTypes.shape from an array of keys
 */
export const mapperShape = PropTypes.shape([
    'array',
    'checkbox',
    'date',
    'fieldset',
    'help',
    'integer',
    'null',
    'number',
    'password',
    'select',
    'tabs',
    'text',
    'textarea',
    'tuple',
].reduce(function(acc, key) {
    return {...acc, [key]: PropTypes.element};
}));

export function getMapper(mapper = {}) {
    return {...defaultMapper(), ...mapper};
}
