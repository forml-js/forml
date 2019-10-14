/**
 * @namespace rjsf.mapper
 */
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

export function getMapper(mapper = {}) {
    return {...defaultMapper(), ...mapper};
}
