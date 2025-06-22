import { describe, it } from 'mocha';
import * as chai from 'chai';
import ObjectPath from 'objectpath';
import { merge, standardForm, findSchema } from '#forms';

const { expect } = chai;

describe('merge', function () {
    it('requires a schema', function () {
        expect(merge(null)).to.deep.equal([]);
    });
    it('requires a base form', function () {
        expect(merge({ type: 'string' }, null)).to.deep.equal([]);
    });
    it('ignores undefined', function () {
        const schema = { type: 'string' };
        const form = ['', undefined];
        expect(merge(schema, form)).to.deep.equal([
            {
                schema,
                type: 'text',
                key: [],
            },
        ]);
    });
    describe('parses', function () {
        it('an object', function () {
            const schema = { type: 'string' };
            const type = 'text';
            expect(merge(schema, [''])).to.deep.equal([
                {
                    key: [],
                    schema,
                    type,
                },
            ]);
        });
        it('form generators', function () {
            const generator = function () {
                return ['[]'];
            };
            expect(merge({ type: 'string' }, [generator])[0]).to.equal(
                generator
            );
        });
        it('string keys', function () {
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

            expect(merge(schema, form)).to.deep.equal([
                {
                    key: ['foo', 'bar'],
                    schema: schema.properties.foo.properties.bar,
                    type,
                },
            ]);
        });
        it('array keys', function () {
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

            expect(merge(schema, form)).to.deep.equal([
                {
                    key: ['foo', 'bar'],
                    schema: schema.properties.foo.properties.bar,
                    type,
                },
            ]);
        });
        describe('child items', function () {
            it('by merging them with the schema', function () {
                const schema = {
                    type: 'object',
                    properties: {
                        foo: { type: 'string' },
                        bar: { type: 'string' },
                    },
                };
                const form = [{ type: 'fieldset', items: ['foo', 'bar'] }];
                expect(merge(schema, form)).to.deep.equal([
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
            it('child items, merging them with schema', function () {
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

                expect(merge(schema, form)).to.deep.equal([
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
    it('tracks created forms', function () {
        options.path = ['foo'];
        standardForm({}, options);
        expect(options.lookup).to.have.own.property(
            ObjectPath.stringify(['foo'])
        );
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
                it(attribute, function () {
                    expect(
                        standardForm({ [attribute]: 'test' }, options)
                    ).to.deep.include({
                        key: [],
                        [attribute]: 'test',
                    });
                });
            }

            it('readOnly as readonly', function () {
                expect(
                    standardForm({ readOnly: true }, options)
                ).to.deep.include({
                    key: [],
                    readonly: true,
                });
            });

            it('minimum with optional exclusiveMinimum', function () {
                expect(standardForm({ minimum: 0 }, options)).to.deep.include({
                    key: [],
                    minimum: 0,
                });
                expect(
                    standardForm(
                        { minimum: 0, exclusiveMinimum: true },
                        options
                    )
                ).to.deep.include({
                    key: [],
                    minimum: 1,
                });
            });

            it('maximum with optional exclusiveMaximum', function () {
                expect(standardForm({ maximum: 1 }, options)).to.deep.include({
                    key: [],
                    maximum: 1,
                });
                expect(
                    standardForm(
                        { maximum: 1, exclusiveMaximum: true },
                        options
                    )
                ).to.deep.include({
                    key: [],
                    maximum: 0,
                });
            });
        });

        describe('taking from schema, if specified, or else from options', function () {
            const attributes = ['required', 'readonly'];

            for (let attribute of attributes) {
                it(attribute, function () {
                    expect(
                        standardForm({ [attribute]: true }, options)
                    ).to.deep.include({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm({}, { ...options, [attribute]: true })
                    ).to.deep.include({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm(
                            { [attribute]: true },
                            { ...options, [attribute]: false }
                        )
                    ).to.deep.include({
                        key: [],
                        [attribute]: true,
                    });
                    expect(
                        standardForm(
                            { [attribute]: false },
                            { ...options, [attribute]: true }
                        )
                    ).to.deep.include({ key: [], [attribute]: false });
                });
            }
        });
    });
});
describe('findSchema', function () {
    it('iterates over a schema following keys', function () {
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

        expect(findSchema([], schema)).to.equal(schema);
        expect(findSchema(['test'], schema)).to.deep.equal({
            type: 'string',
        });
        expect(findSchema(['tuple', 1], schema)).to.deep.equal({
            type: 'number',
        });
    });
});
