/**
 * @namespace rjsf.mapper
 */
import t from 'prop-types';

import Array from './array';
import Checkbox from './checkbox';
import Date from './date';
import FieldSet from './fieldset';
import File from './file';
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
        file: File,
    };
}

/**
 * We're strictly a keyed collection of elements, so generate our
 * PropTypes.shape from an array of keys
 */
const mapperTypes = [
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
    return {...acc, [key]: t.element};
});
export const mapperShape = t.shape({
    array: t.elementType,
    checkbox: t.elementType,
    date: t.elementType,
    fieldset: t.elementType,
    help: t.elementType,
    integer: t.elementType,
    null: t.elementType,
    number: t.elementType,
    password: t.elementType,
    select: t.elementType,
    tabs: t.elementType,
    text: t.elementType,
    textarea: t.elementType,
    tuple: t.elementType
});
console.error('mapperShape : %o', mapperShape);

export function getMapper(mapper = {}) {
    return {...defaultMapper(), ...mapper};
}
