import {ArrayComponent} from './array';
import {Checkbox} from './checkbox';
import {FieldSet} from './fieldset';
import {Integer, Number} from './number';
import {Select} from './select';
import {Text} from './text';

export * from './rules';

export const defaultMapper = {
    password: Text,
    text: Text,
    // textarea: Text,
    select: Select,
    fieldset: FieldSet,
    tuple: FieldSet,
    number: Number,
    integer: Integer,
    array: ArrayComponent,
    checkbox: Checkbox,
};

export function getMapper(mapper = {}) {
    return {...defaultMapper, ...mapper};
}
