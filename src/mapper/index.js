import {ArrayComponent} from './array';
import {Checkbox} from './checkbox';
import {FieldSet} from './fieldset';
import {Null} from './null';
import {Integer, Number} from './number';
import {Select} from './select';
import {Text} from './text';

export * from './rules';

export const defaultMapper = {
    array: ArrayComponent,
    checkbox: Checkbox,
    fieldset: FieldSet,
    integer: Integer,
    null: Null,
    number: Number,
    password: Text,
    select: Select,
    text: Text,
    // textarea: Text,
    tuple: FieldSet,
};

export function getMapper(mapper = {}) {
    return {...defaultMapper, ...mapper};
}
