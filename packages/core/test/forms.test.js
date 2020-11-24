import ObjectPath from 'objectpath';
import { merge, standardForm } from '../src/forms';

describe('merge', function () {
    describe('requires', function () {
        test('a schema', function () {
            expect(merge(null)).toMatchObject([]);
        });
        test('a base form', function () {
            expect(merge({ type: 'string' }, null)).toMatchObject([]);
        });
    });
    describe('ignores', function () {
        test('undefined', function () {
            const schema = { type: 'string' };
            const form = ['', undefined];
            expect(merge(schema, form)).toMatchObject([
                {
                    schema,
                    type: 'text',
                    key: [],
                },
            ]);
        });
    });
    describe('parses', function () {
        test('an object', function () {
            const schema = { type: 'string' };
            const type = 'text';
            expect(merge(schema, [''])).toMatchObject([
                {
                    key: [],
                    schema,
                    type,
                },
            ]);
        });
        test('form generators', function () {
            const generator = function () {
                return ['[]'];
            };
            expect(merge({ type: 'string' }, [generator])[0]).toBe(generator);
        });
        test('string keys', function () {
            const schema = {
                type: 'object',
                properties: {
                    foo: {
                        type: 'object',
                        properties: { bar: { type: 'string' } },
                    },
                },
            };
            const form = ['foo.bar'];
            const type = 'text';

            expect(merge(schema, form)).toMatchObject([
                {
                    key: ['foo', 'bar'],
                    schema: schema.properties.foo.properties.bar,
                    type,
                },
            ]);
        });
        test('array keys', function () {
            const schema = {
                type: 'object',
                properties: {
                    foo: {
                        type: 'object',
                        properties: { bar: { type: 'string' } },
                    },
                },
            };
            const form = [{ key: ['foo', 'bar'] }];
            const type = 'text';

            expect(merge(schema, form)).toMatchObject([
                {
                    key: ['foo', 'bar'],
                    schema: schema.properties.foo.properties.bar,
                    type,
                },
            ]);
        });
        describe('child items', function () {
            test('by merging them with the schema', function () {
                const schema = {
                    type: 'object',
                    properties: {
                        foo: { type: 'string' },
                        bar: { type: 'string' },
                    },
                };
                const form = [{ type: 'fieldset', items: ['foo', 'bar'] }];
                expect(merge(schema, form)).toMatchObject([
                    {
                        type: 'fieldset',
                        items: [
                            {
                                type: 'text',
                                key: ['foo'],
                                schema: { type: 'string' },
                            },
                            {
                                type: 'text',
                                key: ['bar'],
                                schema: { type: 'string' },
                            },
                        ],
                    },
                ]);
            });
        });
        describe('tabs', function () {
            test('child items, merging them with schema', function () {
                const schema = {
                    type: 'object',
                    properties: {
                        foo: { type: 'string' },
                        bar: { type: 'string' },
                    },
                };
                const form = [
                    {
                        type: 'tabs',
                        tabs: [{ items: ['foo'] }, { items: ['bar'] }],
                    },
                ];

                expect(merge(schema, form)).toMatchObject([
                    {
                        type: 'tabs',
                        tabs: [
                            {
                                items: [
                                    {
                                        key: ['foo'],
                                        type: 'text',
                                        schema: { type: 'string' },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        key: ['bar'],
                                        type: 'text',
                                        schema: { type: 'string' },
                                    },
                                ],
                            },
                        ],
                    },
                ]);
            });
        });
    });
});
describe('standardForm', function () {
    let options;
    beforeEach(function () {
        options = { path: [], lookup: {} };
    });
    test('tracks created forms', function () {
        options.path = ['foo'];
        standardForm({}, options);
        expect(options.lookup).toHaveProperty(ObjectPath.stringify(['foo']));
    });
    describe('parses the schema', function () {
        describe('copying from the schema', function () {
            const attributes = [
                'title',
                'description',
                'maxLength',
                'minLength',
                'validationMessage',
            ];

            for (let attribute of attributes) {
                test(attribute, function () {
                    expect(
                        standardForm({ [attribute]: 'test' }, options)
                    ).toMatchObject({
                        key: [],
                        [attribute]: 'test',
                    });
                });
            }

            test('readOnly as readonly', function () {
                expect(standardForm({ readOnly: true }, options)).toMatchObject(
                    {
                        key: [],
                        readonly: true,
                    }
                );
            });

            test('minimum with optional exclusiveMinimum', function () {
                expect(standardForm({ minimum: 0 }, options)).toMatchObject({
                    key: [],
                    minimum: 0,
                });
                expect(
                    standardForm(
                        { minimum: 0, exclusiveMinimum: true },
                        options
                    )
                ).toMatchObject({
                    key: [],
                    minimum: 1,
                });
            });

            test('maximum with optional exclusiveMaximum', function () {
                expect(standardForm({ maximum: 1 }, options)).toMatchObject({
                    key: [],
                    maximum: 1,
                });
                expect(
                    standardForm(
                        { maximum: 1, exclusiveMaximum: true },
                        options
                    )
                ).toMatchObject({
                    key: [],
                    maximum: 0,
                });
            });
        });

        describe('taking from schema, if specified, or else from options', function () {
            const attributes = ['required', 'readonly'];

            for (let attribute of attributes) {
                test(attribute, function () {
                    expect(
                        standardForm({ [attribute]: true }, options)
                    ).toMatchObject({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm({}, { ...options, [attribute]: true })
                    ).toMatchObject({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm(
                            { [attribute]: true },
                            { ...options, [attribute]: false }
                        )
                    ).toMatchObject({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm(
                            { [attribute]: false },
                            { ...options, [attribute]: true }
                        )
                    ).toMatchObject({ key: [], [attribute]: false });
                });
            }
        });
    });
});
