import * as util from '../src/util';

expect.extend({
    toBeString(received) {
        return { pass: typeof received === 'string' };
    },
    toBeNumber(received) {
        return { pass: typeof received === 'number' };
    },
    toBeBoolean(received) {
        return { pass: typeof received === 'boolean' };
    },
});

describe('getPreferredType', function () {
    test('accepts a single string', function () {
        expect(util.getPreferredType('string')).toBe('string');
    });
    test('accepts an array of strings', function () {
        expect(util.getPreferredType(['string', 'null'])).toBe('string');
    });
    test('returns the first non-null type', function () {
        expect(util.getPreferredType(['string', 'null'])).toBe('string');
        expect(util.getPreferredType(['null', 'string'])).toBe('string');
    });
});
describe('randomForSchema', function () {
    describe('when given one type', function () {
        test('returns an random value of the type', function () {
            expect(util.randomForSchema({ type: 'null' })).toBeNull();
            expect(util.randomForSchema({ type: 'string' })).toBeString();
            expect(util.randomForSchema({ type: 'number' })).toBeNumber();
            expect(util.randomForSchema({ type: 'integer' })).toBeNumber();
            expect(util.randomForSchema({ type: 'boolean' })).toBeBoolean();

            const list = util.randomForSchema({
                type: 'array',
                items: { type: 'string' },
            });
            expect(list).toBeInstanceOf(Array);
            expect(list.length).toBe(1);
            expect(list[0]).toBeString();

            const tuple = util.randomForSchema({
                type: 'array',
                items: [{ type: 'string' }],
            });
            expect(tuple).toBeInstanceOf(Array);
            expect(tuple.length).toBe(1);
            expect(tuple[0]).toBeString();

            const empty = util.randomForSchema({ type: 'object' });
            expect(empty).toBeInstanceOf(Object);

            const populated = util.randomForSchema({
                type: 'object',
                properties: { test: { type: 'string' } },
            });
            expect(populated).toBeInstanceOf(Object);
            expect(populated.test).toBeString();

            expect(util.randomForSchema({ type: 'unknown' })).toBeUndefined();
        });
    });
});
describe('defaultForSchema', function () {
    test('returns the default value if specified in the schema', function () {
        expect(util.defaultForSchema({ type: 'string', default: 'test' })).toBe;
    });
    describe('when given one type', function () {
        test('returns an empty value of the type', function () {
            expect(util.defaultForSchema({ type: 'null' })).toBeNull();
            expect(util.defaultForSchema({ type: 'string' })).toBe('');
            expect(util.defaultForSchema({ type: 'number' })).toBe(0.0);
            expect(util.defaultForSchema({ type: 'integer' })).toBe(0);
            expect(util.defaultForSchema({ type: 'boolean' })).toBe(false);
            expect(
                util.defaultForSchema({
                    type: 'array',
                    items: { type: 'string' },
                })
            ).toMatchObject([]);
            expect(
                util.defaultForSchema({
                    type: 'array',
                    items: [{ type: 'string' }],
                })
            ).toMatchObject(['']);
            expect(util.defaultForSchema({ type: 'object' })).toMatchObject({});
            expect(
                util.defaultForSchema({
                    type: 'object',
                    properties: { test: { type: 'string' } },
                })
            ).toMatchObject({ test: '' });
            expect(util.defaultForSchema({ type: 'unknown' })).toBeUndefined();
        });
    });
    describe('when given many types', function () {
        test('returns an empty value of the preferredType', function () {
            expect(util.defaultForSchema({ type: ['string', 'integer'] })).toBe(
                ''
            );
            expect(util.defaultForSchema({ type: ['number', 'string'] })).toBe(
                0.0
            );
            expect(util.defaultForSchema({ type: ['integer', 'string'] })).toBe(
                0
            );
            expect(util.defaultForSchema({ type: ['boolean', 'number'] })).toBe(
                false
            );
            expect(
                util.defaultForSchema({
                    type: ['array', 'object'],
                    items: { type: 'string' },
                    properties: {
                        test: { type: 'string' },
                    },
                })
            ).toMatchObject([]);
            expect(
                util.defaultForSchema({
                    type: ['array', 'object'],
                    items: [{ type: 'string' }],
                    properties: {
                        test: { type: 'string' },
                    },
                })
            ).toMatchObject(['']);
            expect(
                util.defaultForSchema({ type: ['object', 'array'] })
            ).toMatchObject({});
            expect(
                util.defaultForSchema({ type: ['unknown', 'integer'] })
            ).toBeUndefined();
        });
    });
});
describe('assertType', function () {
    test('nullifies falsey values if allowed', function () {
        expect(util.assertType({ type: ['integer', 'null'] }, 0)).toBeNull();
        expect(util.assertType({ type: ['number', 'null'] }, 0.0)).toBeNull();
        expect(util.assertType({ type: ['string', 'null'] }, '')).toBeNull();
        expect(
            util.assertType({ type: ['boolean', 'null'] }, false)
        ).toBeNull();
    });
    test('accepts values that match their type', function () {
        expect(util.assertType({ type: 'number' }, 2.5)).toBe(2.5);
        expect(util.assertType({ type: 'integer' }, 2)).toBe(2);
        expect(util.assertType({ type: 'string' }, 'test')).toBe('test');
        expect(util.assertType({ type: 'boolean' }, true)).toBe(true);

        const array = [1, 2, 3];
        expect(util.assertType({ type: 'array' }, array)).toBe(array);

        const object = { a: 1, b: 2, c: 3 };
        expect(util.assertType({ type: 'object' }, object)).toBe(object);
    });
    describe('when the preferred type is an integer', function () {
        describe('when the type is allowed', function () {
            test('allows the value', function () {
                expect(
                    util.assertType({ type: ['integer', 'string'] }, 'test')
                ).toBe('test');
                expect(
                    util.assertType({ type: ['integer', 'boolean'] }, false)
                ).toBe(false);
            });
        });
        describe('when the type is a number', function () {
            test('converts it to an integer', function () {
                expect(util.assertType({ type: 'integer' }, 1.5)).toBe(1);
                expect(util.assertType({ type: 'number' }, 1.5)).toBe(1.5);
            });
        });
        describe('when the type is a string', function () {
            test('parses an integer', function () {
                expect(util.assertType({ type: 'integer' }, '1.5')).toBe(1);
                expect(util.assertType({ type: 'integer' }, '2')).toBe(2);
            });
        });
        describe('when the type is not allowed', function () {
            test('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'integer' }, null)).toBe(0);
            });
        });
    });
    describe('when the preferred type is a number', function () {
        describe('when the type is allowed', function () {
            test('allows the value', function () {
                expect(
                    util.assertType({ type: ['number', 'string'] }, 'test')
                ).toBe('test');
                expect(
                    util.assertType({ type: ['number', 'boolean'] }, false)
                ).toBe(false);
            });
        });
        describe('when the type is a string', function () {
            test('parses a float', function () {
                expect(util.assertType({ type: 'number' }, '1.5')).toBe(1.5);
                expect(util.assertType({ type: 'number' }, '2')).toBe(2);
            });
        });
        describe('when the type is not allowed', function () {
            test('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'number' }, null)).toBe(0.0);
            });
        });
    });
    describe('when the preferred type is a string', function () {
        describe('when the type is a number', function () {
            test('converts the number to a string', function () {
                expect(util.assertType({ type: 'string' }, 1.5)).toBe('1.5');
            });
        });
    });
    describe('when the type does not match the preferred type', function () {
        describe('when the value is falsey', function () {
            test('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'string' }, null)).toBe('');
            });
        });
    });
    describe('when the type is allowed', function () {
        test('returns the value unchanged', function () {
            expect(util.assertType({ type: ['string', 'boolean'] }, true)).toBe(
                true
            );
        });
    });
    describe('when the type is not allowed', function () {
        test('returns defaultForSchema', function () {
            expect(util.assertType({ type: 'string' }, true)).toBe('');
        });
    });
});
describe('findSchema', function () {
    test('iterates over a schema following keys', function () {
        const schema = {
            type: 'object',
            properties: {
                test: { type: 'string' },
                tuple: {
                    type: 'array',
                    items: [{ type: 'string' }, { type: 'number' }],
                },
            },
        };

        expect(util.findSchema([], schema)).toBe(schema);
        expect(util.findSchema(['test'], schema)).toMatchObject({
            type: 'string',
        });
        expect(util.findSchema(['tuple', 1], schema)).toMatchObject({
            type: 'number',
        });
    });
});
describe('valueGetter', function () {
    test('traverses objects to retrieve a value', function () {
        const get = util.valueGetter(
            { test: { property: 'a' } },
            {
                type: 'object',
                properties: {
                    test: {
                        type: 'object',
                        properties: {
                            property: { type: 'string' },
                        },
                    },
                },
            }
        );

        expect(get([])).toMatchObject({ test: { property: 'a' } });
        expect(get('test')).toMatchObject({ property: 'a' });
        expect(get(['test', 'property'])).toBe('a');
    });
    test('traverses arrays to retrieve a value', function () {
        const get = util.valueGetter([null, [3]], {
            type: 'array',
            items: [
                { type: 'null' },
                { type: 'array', items: { type: 'number' } },
            ],
        });

        expect(get([])).toMatchObject([null, [3]]);
        expect(get(0)).toBeNull();
        expect(get([1, 0])).toBe(3);
    });
    test('when encountering undefined, uses defaultForSchema', function () {
        const get = util.valueGetter(undefined, {
            type: 'object',
            properties: {
                test: {
                    type: 'object',
                    properties: {
                        property: { type: 'string', default: 'a' },
                    },
                },
            },
        });

        expect(get(['test', 'property'])).toBe('a');
        expect(get([])).toMatchObject({ test: { property: 'a' } });
    });
});
describe('valueSetter', function () {
    test('traverses objects to set a value', function () {
        const set = util.valueSetter(
            { test: { property: 'a' } },
            {
                type: 'object',
                properties: {
                    test: {
                        type: 'object',
                        properties: {
                            property: { type: 'string' },
                        },
                    },
                },
            }
        );

        expect(set(['test', 'property'], 'b')).toMatchObject({
            test: { property: 'b' },
        });
    });
    test('traverses arrays to set a value', function () {
        const set = util.valueSetter([null, [1]], {
            type: 'array',
            items: [
                { type: 'null' },
                { type: 'array', items: { type: 'integer' } },
            ],
        });

        expect(set([1, 1], 2)).toMatchObject([null, [1, 2]]);
    });
    test('accepts a string or array of strings for a key', function () {
        const set = util.valueSetter(
            {},
            {
                type: 'object',
                properties: {
                    test: { type: 'string' },
                },
            }
        );
        expect(set('test', 'a')).toMatchObject({ test: 'a' });
        expect(set(['test'], 'b')).toMatchObject({ test: 'b' });
    });
    test('uses defaultForSchema when traversing undefined trees', function () {
        const set = util.valueSetter(undefined, {
            type: 'object',
            properties: {
                test: {
                    type: 'object',
                    properties: {
                        property: { type: 'string' },
                    },
                },
            },
        });

        expect(set(['test', 'property'], 'a')).toMatchObject({
            test: { property: 'a' },
        });
    });
    test('pads arrays with defaultForSchema when traversing to an index > length', function () {
        const set = util.valueSetter([null, []], {
            type: 'array',
            items: [
                { type: 'null' },
                { type: 'array', items: { type: 'integer' } },
            ],
        });

        expect(set([1, 2], 1)).toMatchObject([null, [0, 0, 1]]);
    });
});
describe('traverseForm', function () {
    test('takes a single form object or an array', function () {
        const forms = ['test', 'property'];
        const form = 'foo';
        const callback = jest.fn();

        util.traverseForm(forms, callback);
        util.traverseForm(form, callback);

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledWith('property');
        expect(callback).toHaveBeenCalledWith('foo');
    });
    test('visits nested children', function () {
        const nested = { key: 'property', items: ['foo'] };
        const forms = ['test', nested];
        const callback = jest.fn();

        util.traverseForm(forms, callback);

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledWith(nested);
        expect(callback).toHaveBeenCalledWith('foo');
    });
});
describe('clone', function () {
    test('returns pass-by-copy values unmodified', function () {
        expect(util.clone('test')).toBe('test');
        expect(util.clone(1)).toBe(1);
    });
    test('returns copies of pass-by-reference values', function () {
        const array = [1, 2, 3];
        const arrayClone = util.clone(array);
        expect(arrayClone).toMatchObject(array);
        expect(arrayClone).not.toBe(array);

        const object = { a: 1, b: 2, c: 3 };
        const objectClone = util.clone(object);
        expect(objectClone).toMatchObject(object);
        expect(objectClone).not.toBe(object);
    });
    test('copies are deep copies', function () {
        const array = [1, 2, 3];
        const object = { array };
        const clone = util.clone(object);

        expect(clone).toMatchObject(object);
        expect(clone).not.toBe(object);
        expect(clone.array).toMatchObject(array);
        expect(clone.array).not.toBe(array);
    });
});
