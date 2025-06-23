import { describe, it } from 'mocha';
import * as chai from 'chai';
import {
    modelSetArray,
    modelSetObject,
    modelDrop,
    modelSet,
    getTypeOf,
    getPreferredType,
    defaultForSchema,
    getNextValue,
    getNextSchema,
    getNext,
    assertType,
    isRequired,
    isSaturated,
    seek,
    walk,
    walkSchema,
    unwind,
} from '../src/common.js';

const { expect } = chai;

describe('common.js utility functions', function () {
    describe('getTypeOf', function () {
        it('returns null for undefined', function () {
            expect(getTypeOf(undefined)).to.equal('null');
        });

        it('returns null for null', function () {
            expect(getTypeOf(null)).to.equal('null');
        });

        it('returns array for arrays', function () {
            expect(getTypeOf([])).to.equal('array');
            expect(getTypeOf([1, 2, 3])).to.equal('array');
        });

        it('returns correct typeof for other values', function () {
            expect(getTypeOf('string')).to.equal('string');
            expect(getTypeOf(42)).to.equal('number');
            expect(getTypeOf(true)).to.equal('boolean');
            expect(getTypeOf({})).to.equal('object');
        });
    });

    describe('getPreferredType', function () {
        it('returns single type when not an array', function () {
            expect(getPreferredType('string')).to.equal('string');
            expect(getPreferredType('number')).to.equal('number');
        });

        it('skips null types and returns first non-null', function () {
            expect(getPreferredType(['null', 'string'])).to.equal('string');
            expect(getPreferredType(['null', 'null', 'number'])).to.equal(
                'number'
            );
        });

        it('returns first type if all are ignored', function () {
            expect(getPreferredType(['null'])).to.equal('null');
            expect(getPreferredType(['null', 'null'])).to.equal('null');
        });
    });

    describe('defaultForSchema', function () {
        it('returns schema default when specified', function () {
            const schema = { type: 'string', default: 'test' };
            expect(defaultForSchema(schema)).to.equal('test');
        });

        it('builds default for array type', function () {
            const schema = { type: 'array', items: { type: 'string' } };
            expect(defaultForSchema(schema)).to.deep.equal([]);
        });

        it('builds default for object type with required properties', function () {
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                },
                required: ['name'],
            };
            const result = defaultForSchema(schema);
            expect(result).to.have.property('name', '');
            expect(result).to.not.have.property('age');
        });

        it('builds default for primitive types', function () {
            expect(defaultForSchema({ type: 'string' })).to.equal('');
            expect(defaultForSchema({ type: 'number' })).to.equal(0.0);
            expect(defaultForSchema({ type: 'integer' })).to.equal(0);
            expect(defaultForSchema({ type: 'boolean' })).to.equal(false);
            expect(defaultForSchema({ type: 'null' })).to.equal(null);
        });

        it('handles unknown types', function () {
            const result = defaultForSchema({ type: 'unknown' });
            expect(result).to.be.undefined;
        });
    });

    describe('getNextSchema', function () {
        it('handles array schemas with items array (tuples)', function () {
            const schema = {
                type: 'array',
                items: [{ type: 'string' }, { type: 'number' }],
            };
            expect(getNextSchema(schema, 0)).to.deep.equal({ type: 'string' });
            expect(getNextSchema(schema, 1)).to.deep.equal({ type: 'number' });
        });

        it('throws error for invalid tuple index', function () {
            const schema = {
                type: 'array',
                items: [{ type: 'string' }],
            };
            expect(() => getNextSchema(schema, 5)).to.throw(
                'disallowed tuple index: 5'
            );
        });

        it('handles array schemas with single item schema', function () {
            const schema = {
                type: 'array',
                items: { type: 'string' },
            };
            expect(getNextSchema(schema, 0)).to.deep.equal({ type: 'string' });
            expect(getNextSchema(schema, 10)).to.deep.equal({ type: 'string' });
        });

        it('handles object schemas with defined properties', function () {
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
            };
            expect(getNextSchema(schema, 'name')).to.deep.equal({
                type: 'string',
            });
        });

        it('handles object schemas with additionalProperties', function () {
            const schema = {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'string' },
            };
            expect(getNextSchema(schema, 'dynamicKey')).to.deep.equal({
                type: 'string',
            });
        });

        it('throws error for disallowed object key', function () {
            const schema = {
                type: 'object',
                properties: { name: { type: 'string' } },
            };
            expect(() => getNextSchema(schema, 'unknown')).to.throw(
                'disallowed object key: unknown'
            );
        });

        it('throws error for untraversable schema type', function () {
            const schema = { type: 'string' };
            expect(() => getNextSchema(schema, 'key')).to.throw(
                'untraversable schema type: string'
            );
        });
    });

    describe('getNext', function () {
        it('handles array with tuple items', function () {
            const schema = {
                type: 'array',
                items: [{ type: 'string' }, { type: 'number' }],
            };
            const value = ['hello', 42];

            const [nextSchema, nextValue] = getNext(schema, 0, value);
            expect(nextSchema).to.deep.equal({ type: 'string' });
            expect(nextValue).to.equal('hello');
        });

        it('throws error for invalid tuple index in getNext', function () {
            const schema = {
                type: 'array',
                items: [{ type: 'string' }],
            };
            const value = ['test'];

            expect(() => getNext(schema, 5, value)).to.throw(
                'disallowed tuple index: 5'
            );
        });

        it('handles array with single item schema', function () {
            const schema = {
                type: 'array',
                items: { type: 'string' },
            };
            const value = ['hello', 'world'];

            const [nextSchema, nextValue] = getNext(schema, 1, value);
            expect(nextSchema).to.deep.equal({ type: 'string' });
            expect(nextValue).to.equal('world');
        });

        it('handles object with defined properties', function () {
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
            };
            const value = { name: 'test' };

            const [nextSchema, nextValue] = getNext(schema, 'name', value);
            expect(nextSchema).to.deep.equal({ type: 'string' });
            expect(nextValue).to.equal('test');
        });

        it('handles object with additionalProperties true and numeric keys', function () {
            const schema = {
                type: 'object',
                additionalProperties: true,
            };
            const value = { 0: 'test', 42: 'answer' };

            expect(() => getNext(schema, 0, value)).to.throw(
                'additionalProperties: true is not supported - form rendering requires explicit type information'
            );
            expect(() => getNext(schema, '42', value)).to.throw(
                'additionalProperties: true is not supported - form rendering requires explicit type information'
            );
        });

        it('handles object with additionalProperties schema', function () {
            const schema = {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'string' },
            };
            const value = { dynamic: 'test' };

            const [nextSchema, nextValue] = getNext(schema, 'dynamic', value);
            expect(nextSchema).to.deep.equal({ type: 'string' });
            expect(nextValue).to.equal('test');
        });

        it('throws error for disallowed object key in getNext', function () {
            const schema = {
                type: 'object',
                properties: { name: { type: 'string' } },
            };
            const value = { name: 'test' };

            expect(() => getNext(schema, 'unknown', value)).to.throw(
                'disallowed object key: unknown'
            );
        });

        it('throws error for untraversable schema type in getNext', function () {
            const schema = { type: 'string' };
            const value = 'test';

            expect(() => getNext(schema, 'key', value)).to.throw(
                'untraversable schema type: string'
            );
        });
    });

    describe('assertType', function () {
        it('handles null values when null is allowed', function () {
            const schema = { type: ['string', 'null'] };
            expect(assertType(schema, null)).to.equal(null);
            expect(assertType(schema, '')).to.equal(null);
            expect(assertType(schema, false)).to.equal(null);
            expect(assertType(schema, 0)).to.equal(null);
        });

        it('handles integer type conversions', function () {
            const schema = { type: 'integer' };

            // Valid integers
            expect(assertType(schema, 42)).to.equal(42);
            expect(assertType(schema, 3.0)).to.equal(3.0);

            // Float to integer conversion
            expect(assertType(schema, 3.7)).to.equal(3);

            // String edge cases
            expect(assertType(schema, '')).to.equal('');
            expect(assertType(schema, '-')).to.equal('-');

            // String to integer parsing
            expect(assertType(schema, '42')).to.equal(42);
        });

        it('handles number type conversions', function () {
            const schema = { type: 'number' };

            // Valid numbers
            expect(assertType(schema, 42.5)).to.equal(42.5);

            // String edge cases
            expect(assertType(schema, '')).to.equal('');
            expect(assertType(schema, '-')).to.equal('-');
            expect(assertType(schema, '42.')).to.equal('42.');

            // Invalid decimal patterns
            expect(assertType(schema, '3.14.')).to.equal(3.14);

            // String to number parsing
            expect(assertType(schema, '42.5')).to.equal(42.5);
        });

        it('handles string type conversions', function () {
            const schema = { type: 'string' };
            expect(assertType(schema, 42)).to.equal('42');
            expect(assertType(schema, 0)).to.equal('0');
        });

        it('handles undefined values', function () {
            const schema = { type: 'string' };
            expect(assertType(schema, undefined)).to.equal('');
        });

        it('returns value for matching types', function () {
            expect(assertType({ type: 'string' }, 'test')).to.equal('test');
            expect(assertType({ type: 'number' }, 42)).to.equal(42);
            expect(assertType({ type: 'boolean' }, true)).to.equal(true);
        });

        it('falls back to default for unmatched types', function () {
            const schema = { type: 'string' };
            expect(assertType(schema, [])).to.equal('');
            expect(assertType(schema, {})).to.equal('');
        });
    });

    describe('isRequired', function () {
        it('returns true for required properties', function () {
            const schema = { required: ['name', 'age'] };
            expect(isRequired(schema, 'name')).to.be.true;
            expect(isRequired(schema, 'age')).to.be.true;
        });

        it('returns false for non-required properties', function () {
            const schema = { required: ['name'] };
            expect(isRequired(schema, 'age')).to.be.false;
        });

        it('returns false when no required array', function () {
            const schema = {};
            expect(isRequired(schema, 'name')).to.be.false;
        });
    });

    describe('isSaturated', function () {
        it('handles arrays', function () {
            expect(isSaturated([])).to.be.false;
            expect(isSaturated([1])).to.be.true;
            expect(isSaturated([1, 2, 3])).to.be.true;
        });

        it('handles objects', function () {
            expect(isSaturated({})).to.be.false;
            expect(isSaturated({ key: 'value' })).to.be.true;
            expect(isSaturated(null)).to.be.false;
        });

        it('handles primitives', function () {
            expect(isSaturated(undefined)).to.be.false;
            expect(isSaturated('')).to.be.true;
            expect(isSaturated('test')).to.be.true;
            expect(isSaturated(0)).to.be.true;
            expect(isSaturated(42)).to.be.true;
            expect(isSaturated(false)).to.be.true;
        });
    });

    describe('walkSchema', function () {
        it('walks through array schemas with tuple items', function () {
            const schema = {
                type: 'array',
                items: [{ type: 'string' }, { type: 'number' }],
            };
            const model = ['test', 42];
            const visited = [];

            walkSchema(schema, model, (key, model, schema) => {
                visited.push({ key: key.slice(), model, schema });
            });

            expect(visited).to.have.length(3);
            expect(visited[0].key).to.deep.equal([]);
            expect(visited[1].key).to.deep.equal([0]);
            expect(visited[2].key).to.deep.equal([1]);
        });

        it('walks through array schemas with mixed types', function () {
            const schema = {
                type: ['array', 'null'],
                items: { type: 'string' },
            };
            const model = ['a', 'b'];
            const visited = [];

            walkSchema(schema, model, (key, model, schema) => {
                visited.push({ key: key.slice() });
            });

            expect(visited).to.have.length(3);
        });

        it('walks through object schemas', function () {
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                },
            };
            const model = { name: 'test' };
            const visited = [];

            walkSchema(schema, model, (key, model, schema) => {
                visited.push({ key: key.slice() });
            });

            // Should visit root, name, and age (even though age is not in model)
            expect(visited).to.have.length(3);
        });

        it('handles schemas with additionalProperties', function () {
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
                additionalProperties: { type: 'string' },
            };
            const model = { name: 'test', extra: 'value' };
            const visited = [];

            walkSchema(schema, model, (key, model, schema) => {
                visited.push({ key: key.slice() });
            });

            expect(visited).to.have.length(3);
        });
    });

    describe('unwind', function () {
        it('unwinds with drop parameter', function () {
            const schema = {
                type: 'object',
                properties: { name: { type: 'string' } },
            };
            const stack = [[[], { name: 'test', age: 30 }, schema]];

            const result = unwind(
                { type: 'string' },
                'age',
                30,
                stack,
                1 // drop = 1
            );

            expect(result).to.deep.equal({ name: 'test' });
        });

        it('unwinds without drop (modelSet)', function () {
            const schema = {
                type: 'object',
                properties: { name: { type: 'string' } },
            };
            const stack = [[[], { name: 'old' }, schema]];

            const result = unwind(
                { type: 'string' },
                'name',
                'new',
                stack,
                0 // drop = 0
            );

            expect(result.name).to.equal('new');
        });

        it('handles empty stack', function () {
            const result = unwind({ type: 'string' }, 'key', 'value', []);

            expect(result).to.equal('value');
        });
    });

    describe('edge cases and error conditions', function () {
        it('handles modelSetArray with padding', function () {
            const targetSchema = { type: 'array', items: { type: 'string' } };
            const result = modelSetArray(
                targetSchema,
                ['a'],
                3,
                { type: 'string' },
                'new'
            );

            expect(result).to.have.length(4);
            expect(result[3]).to.equal('new');
        });

        it('handles modelSetObject with required fields', function () {
            const targetSchema = {
                type: 'object',
                properties: { name: { type: 'string' } },
                required: ['name'],
            };

            const result = modelSetObject(
                targetSchema,
                {},
                'name',
                { type: 'string' },
                'test'
            );

            expect(result.name).to.equal('test');
        });

        it('handles modelSetObject with non-saturated values', function () {
            const targetSchema = {
                type: 'object',
                properties: { name: { type: 'string' } },
            };

            const result = modelSetObject(
                targetSchema,
                { name: 'old' },
                'name',
                { type: 'string' },
                undefined
            );

            expect(result).to.not.have.property('name');
        });

        it('handles walk function', function () {
            const schema = {
                type: 'object',
                properties: {
                    items: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
            };
            const model = { items: ['a', 'b'] };
            const visited = [];

            walk(schema, model, (key, model, schema) => {
                visited.push({ key: key.slice() });
            });

            expect(visited.length).to.be.greaterThan(0);
        });
    });
});

