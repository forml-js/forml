/**
 * @namespace forml.mapper
 */
import t from 'prop-types';

import Array from './array/index.jsx';
import Checkbox from './checkbox.jsx';
import Date from './date.jsx';
import DateTime from './datetime.jsx';
import Dynamic from './dynamic.jsx';
import FieldSet from './fieldset.jsx';
import File from './file.jsx';
import Help from './help.jsx';
import Integer from './integer.jsx';
import Multiselect from './multiselect.jsx';
import Notice from './notice.jsx';
import Null from './null.jsx';
import Number from './number.jsx';
import Select from './select.jsx';
import Tabs from './tabs.jsx';
import Text from './text/index.jsx';
import TextArea from './textarea.jsx';

export function defaultMapper() {
    return {
        array: Array,
        checkbox: Checkbox,
        date: Date,
        datetime: DateTime,
        dynamic: Dynamic,
        fieldset: FieldSet,
        help: Help,
        integer: Integer,
        multiselect: Multiselect,
        notice: Notice,
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
export const mapperTypes = [
    'array',
    'checkbox',
    'date',
    'datetime',
    'fieldset',
    'help',
    'integer',
    'multiselect',
    'notice',
    'null',
    'number',
    'password',
    'select',
    'tabs',
    'text',
    'textarea',
    'tuple',
];

export const mapperShape = t.shape({
    array: t.elementType,
    checkbox: t.elementType,
    date: t.elementType,
    datetime: t.elementType,
    fieldset: t.elementType,
    help: t.elementType,
    integer: t.elementType,
    multiselect: t.elementType,
    notice: t.elementType,
    null: t.elementType,
    number: t.elementType,
    password: t.elementType,
    select: t.elementType,
    tabs: t.elementType,
    text: t.elementType,
    textarea: t.elementType,
    tuple: t.elementType,
});

export function getMapper(mapper = {}) {
    return { ...defaultMapper(), ...mapper };
}
