/**
 * @namespace rjsf.mapper
 */
import {ArrayComponent} from './array';
import {Checkbox} from './checkbox';
import {Date} from './date';
import {FieldSet} from './fieldset';
import {Help} from './help';
import {Null} from './null';
import {Integer, Number} from './number';
import {Select} from './select';
import {Tabs} from './tabs';
import {Text, TextArea} from './text';

export * from './rules';

export const defaultMapper = {
    array: ArrayComponent,
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

export function getMapper(mapper = {}) {
    return {...defaultMapper, ...mapper};
}
