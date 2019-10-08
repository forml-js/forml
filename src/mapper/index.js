import {ArrayComponent} from './array';
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
};

export function getMapper(mapper = {}) {
    return {...defaultMapper, ...mapper};
}
