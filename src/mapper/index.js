import {ArrayComponent} from './array';
import {FieldSet} from './fieldset';
import {Number} from './number';
import {Text} from './text';

export * from './rules';
export * from './forms';

export const defaultMapper = {
    'text': Text,
    'fieldset': FieldSet,
    'number': Number,
    'array': ArrayComponent,
};

export function getMapper(mapper = {}) {
    return {...defaultMapper, ...mapper};
}
