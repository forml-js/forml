import ObjectPath from 'objectpath';
import {
    merge,
    standardForm,
    findSchema,
    findNextSchema,
    getDefaults,
} from '#forms';
import { ARRAY_PLACEHOLDER } from '#constants';

describe('merge', function () {
    describe('when the form descriptor includes an asterisk', function () {
        let schema = {
            type: 'object',
            properties: {
                foo: { type: 'string' },
                bar: { type: 'string' },
            },
        };
        let { form: defaultForm } = getDefaults(schema);
        describe('as the only entry', function () {
            it('returns the standard/default form for the schema', function () {
                expect(merge(schema, ['*'], {})).to.deep.equal(defaultForm);
            });
        });
        describe('among other entries', function () {
            it('inserts the standard/default form for the schema', function () {
                const form = merge(schema, ['foo', '*', 'bar']);
                expect(form.length).to.equal(defaultForm.length + 2);
                expect(form[0].key).to.deep.equal(['foo']);
                expect(form[form.length - 1].key).to.deep.equal(['bar']);
                expect(form.slice(1, form.length - 1)).to.deep.equal(
                    defaultForm
                );
            });
        });
    });
    describe('with a prefix', function () {
        const fooSchema = { type: 'string' };
        const barSchema = { type: 'number' };
        const schema = {
            type: 'object',
            properties: {
                fizz: {
                    type: 'object',
                    properties: {
                        buzz: {
                            type: 'object',
                            properties: {
                                foo: fooSchema,
                                bar: barSchema,
                            },
                        },
                    },
                },
            },
        };
        const prefix = ['fizz', 'buzz'];

        it('includes the prefix in all merged keys', function () {
            const keys = ['foo', 'bar'];
            const forms = merge(schema, keys, { prefix });
            for (let index = 0; index < forms.length; index++) {
                const form = forms[index];
                const key = keys[index];
                expect(form.key).to.deep.equal([...prefix, key]);
            }
        });
    });
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
    describe('with the readonly option set to true', function () {
        let schema = {
            type: 'object',
            properties: {
                foo: { type: 'string' },
                bar: { type: 'number' },
            },
        };
        describe('and a form that does not specify a readonly value', function () {
            it('takes the value from the option', function () {
                const mergedForms = merge(schema, ['foo', 'bar'], {
                    readonly: true,
                });
                expect(mergedForms[0]).to.include({
                    readonly: true,
                });
                expect(mergedForms[1]).to.include({
                    readonly: true,
                });
            });
        });
        describe('and a form that specifies a readonly value', function () {
            it('takes the value from the form', function () {
                const mergedForms = merge(
                    schema,
                    [{ key: ['foo'], readonly: false }, 'bar'],
                    {
                        readonly: true,
                    }
                );
                expect(mergedForms[0]).to.include({
                    readonly: false,
                });
                expect(mergedForms[1]).to.include({
                    readonly: true,
                });
            });
        });
    });
    describe('given a key with one or more blank strings', function () {
        it('replaces the strings with array placeholders', function () {
            const schema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        foo: { type: 'string' },
                        bar: {
                            type: 'array',
                            items: {
                                type: 'number',
                            },
                        },
                    },
                },
            };

            const merged = merge(schema, [
                { key: ['', 'foo'] },
                { key: ['', 'bar', ''] },
            ]);
            expect(merged[0].key).to.deep.equal([ARRAY_PLACEHOLDER, 'foo']);
            expect(merged[1].key).to.deep.equal([
                ARRAY_PLACEHOLDER,
                'bar',
                ARRAY_PLACEHOLDER,
            ]);
        });
    });
    describe('given a form with titles', function () {
        describe('and no titleMap', function () {
            describe('with enum on the base schema', function () {
                it('creates a titleMap based on the titles', function () {
                    const schema = {
                        type: 'string',
                        enum: [1, 2, 3],
                    };
                    const merged = merge(schema, [
                        { key: [], titles: ['a', 'b', 'c'] },
                    ]);
                    expect(merged[0].titleMap).to.deep.equal([
                        { name: 'a', value: 1 },
                        { name: 'b', value: 2 },
                        { name: 'c', value: 3 },
                    ]);
                });
            });
            describe('with enum on the child items schema', function () {
                it('creates a titleMap based on the titles', function () {
                    const schema = {
                        type: 'array',
                        items: { type: 'number', enum: [1, 2, 3] },
                    };
                    const merged = merge(schema, [
                        { key: [], titles: ['a', 'b', 'c'] },
                    ]);
                    expect(merged[0].titleMap).to.deep.equal([
                        { name: 'a', value: 1 },
                        { name: 'b', value: 2 },
                        { name: 'c', value: 3 },
                    ]);
                });
            });
            describe('with a localize function', function () {
                it('passes the titles through the localize function', function () {
                    const schema = {
                        type: 'array',
                        items: { type: 'number', enum: [1, 2, 3] },
                    };
                    const localize = vi.fn((name) => `localized ${name}`);
                    const merged = merge(
                        schema,
                        [{ key: [], titles: ['a', 'b', 'c'] }],
                        { localize }
                    );
                    expect(localize).to.have.been.calledWith('a');
                    expect(localize).to.have.been.calledWith('b');
                    expect(localize).to.have.been.calledWith('c');
                    expect(merged[0].titleMap).to.deep.equal([
                        { name: 'localized a', value: 1 },
                        { name: 'localized b', value: 2 },
                        { name: 'localized c', value: 3 },
                    ]);
                });
            });
        });
        describe('and a titleMap', function () {
            it('does not replace the existing titleMap', function () {
                const schema = {
                    type: 'string',
                    enum: [1, 2, 3],
                };
                const merged = merge(schema, [
                    {
                        key: [],
                        titles: ['a', 'b', 'c'],
                        titleMap: [
                            { name: 'A', value: 1 },
                            { name: 'B', value: 2 },
                            { name: 'C', value: 3 },
                        ],
                    },
                ]);
                expect(merged[0].titleMap).to.deep.equal([
                    { name: 'A', value: 1 },
                    { name: 'B', value: 2 },
                    { name: 'C', value: 3 },
                ]);
            });
        });
    });
    describe('with a localize function in the options', function () {
        let localize;
        let schema;
        beforeEach(function () {
            localize = vi.fn((text) => `localized ${text}`);
            schema = { type: 'array', items: { type: 'string' } };
        });
        describe('given a form with a title', function () {
            it('passes the title through the localize function', function () {
                const form = [{ key: [], title: 'title' }];
                const merged = merge(schema, form, { localize });
                expect(localize).to.have.been.calledWith('title');
                expect(merged[0].title).to.equal('localized title');
            });
        });
        describe('given a form with a description', function () {
            it('passes the description through the localize function', function () {
                const form = [{ key: [], description: 'desc' }];
                const merged = merge(schema, form, { localize });
                expect(localize).to.have.been.calledWith('desc');
                expect(merged[0].description).to.equal('localized desc');
            });
        });
        describe('given a form with a placeholder', function () {
            it('passes the placeholder through the localize function', function () {
                const form = [{ key: [], placeholder: 'placeholder' }];
                const merged = merge(schema, form, { localize });
                expect(localize).to.have.been.calledWith('placeholder');
                expect(merged[0].placeholder).to.equal('localized placeholder');
            });
        });
        describe('given a form with a titleFun', function () {
            let titleFun;
            beforeEach(function () {
                titleFun = vi.fn((value) => `titled ${value}`);
            });
            describe('while skipTitleFun is true', function () {
                it('does not modify the titleFun', function () {
                    localize.skipTitleFun = true;
                    const form = [{ key: [], titleFun }];
                    const merged = merge(schema, form, { localize });
                    expect(merged[0].titleFun).to.equal(titleFun);
                    expect(merged[0].titleFun('test')).to.equal('titled test');
                });
            });
            describe('while skipTitleFun is false', function () {
                it('wraps the localize function around the titleFun', function () {
                    const form = [{ key: [], titleFun }];
                    const merged = merge(schema, form, { localize });
                    expect(merged[0].titleFun).not.to.equal(titleFun);
                    expect(merged[0].titleFun('test')).to.equal(
                        'localized titled test'
                    );
                });
            });
        });
        describe('given a form for an array', function () {
            describe('with addText', function () {
                it('passes addText through the localize function', function () {
                    const form = [{ key: [], addText: 'new item' }];
                    const merged = merge(schema, form, { localize });
                    expect(localize).to.have.been.calledWith('new item');
                    expect(merged[0].addText).to.equal('localized new item');
                });
            });
            describe('without addText', function () {
                describe('with a title', function () {
                    it('creates addText based on the title', function () {
                        const form = [{ key: [], title: 'test' }];
                        const merged = merge(schema, form, { localize });
                        expect(merged[0].addText).to.not.be.undefined;
                    });
                    it('passes the created addText through the localize function', function () {
                        const form = [{ key: [], title: 'test' }];
                        const merged = merge(schema, form, { localize });
                        expect(localize).to.have.been.calledWith('Add');
                        expect(merged[0].addText).to.equal(
                            'localized Add localized test'
                        );
                    });
                });
                describe('without a title', function () {
                    it('creates generic addText', function () {
                        const form = [{ key: [] }];
                        const merged = merge(schema, form, { localize });
                        expect(localize).to.have.been.calledWith('Add');
                        expect(merged[0].addText).to.equal('localized Add');
                    });
                });
            });
        });
    });
    describe('without a localize function in the options', function () {
        let schema;
        beforeEach(function () {
            schema = { type: 'array', items: { type: 'string' } };
        });
        describe('given a form with addText', function () {
            describe('with a title', function () {
                it('creates addText based on the title', function () {
                    const form = [{ key: [], title: 'test' }];
                    const merged = merge(schema, form);
                    expect(merged[0].addText).to.equal('Add test');
                });
            });
            describe('without a title', function () {
                it('creates generic addText', function () {
                    const form = [{ key: [] }];
                    const merged = merge(schema, form);
                    expect(merged[0].addText).to.equal('Add');
                });
            });
        });
    });
    describe('with an array form', function () {
        let form;
        let schema;
        beforeEach(function () {
            schema = {
                type: 'array',
                items: [{ type: 'string' }, { type: 'number' }],
            };
            form = [{ key: [] }];
        });
        describe('and readonly in the options', function () {
            it('sets readonly on the child forms', function () {
                const options = { readonly: true };
                const merged = merge(schema, form, options);
                for (let item of merged[0].items) {
                    expect(item.readonly).to.be.true;
                }
            });
        });
        describe('and readonly in the form', function () {
            it('sets readonly on the child forms', function () {
                const options = {};
                form[0].readonly = true;
                const merged = merge(schema, form, options);
                for (let item of merged[0].items) {
                    expect(item.readonly).to.be.true;
                }
            });
        });
        describe('and readOnly in the schema', function () {
            it('sets readonly on the child forms', function () {
                const options = {};
                schema.readOnly = true;
                const merged = merge(schema, form, options);
                for (let item of merged[0].items) {
                    expect(item.readonly).to.be.true;
                }
            });
        });
        describe('without any readonly', function () {
            it('does not set readonly on the child forms', function () {
                const options = {};
                const merged = merge(schema, form, options);
                for (let item of merged[0].items) {
                    expect(item.readonly).to.be.undefined;
                }
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
    describe('given no arguments', function () {
        it('throws an error', function () {
            expect(() => findSchema()).to.throw;
        });
    });
    describe('given an empty key path', function () {
        it('returns the current schema', function () {
            expect(findSchema([], schema)).to.equal(schema);
        });
    });
    describe('given a populated key path', function () {
        describe('and the path leads to another schema', function () {
            it('returns the second schema', function () {
                expect(findSchema(['test'], schema)).to.deep.equal({
                    type: 'string',
                });
                expect(findSchema(['tuple', 1], schema)).to.deep.equal({
                    type: 'number',
                });
            });
        });
        describe('and the path leads nowhere', function () {
            it('fails catastrophically', function () {
                expect(function () {
                    findSchema(['burt', 'bacharach']);
                }).to.throw;
            });
        });
    });
});
describe('findNextSchema', function () {
    describe('given an array schema', function () {
        describe('with items being an array of schemas', function () {
            const firstSchema = { type: 'string' };
            const secondSchema = { type: 'number' };
            const arraySchema = {
                type: 'array',
                items: [firstSchema, secondSchema],
            };

            it('rturns the child schema from the corresponding index', function () {
                expect(findNextSchema(arraySchema, [0])).to.equal(firstSchema);
                expect(findNextSchema(arraySchema, [1])).to.equal(secondSchema);
            });
            it('returns undefined the index does not match a child', function () {
                expect(findNextSchema(arraySchema, [2])).to.be.undefined;
            });
        });
        describe('with items being a single schema', function () {
            const childSchema = { type: 'number' };
            const arraySchema = {
                type: 'array',
                items: childSchema,
            };

            it('returns the same child schema every time', function () {
                expect(findNextSchema(arraySchema, [0])).to.equal(childSchema);
                expect(findNextSchema(arraySchema, [1])).to.equal(childSchema);
                expect(findNextSchema(arraySchema, [2])).to.equal(childSchema);
            });
        });
    });
    describe('given an object schema', function () {
        describe('with additionalProperties', function () {
            const additionalPropertiesSchema = { type: 'number' };
            const fooSchema = { type: 'string' };
            const barSchema = { type: 'string' };
            const objectSchema = {
                type: 'object',
                properties: { foo: fooSchema, bar: barSchema },
                additionalProperties: additionalPropertiesSchema,
            };
            describe('and a key defined in its properties', function () {
                it('returns the schema from properties', function () {
                    expect(findNextSchema(objectSchema, 'foo')).to.equal(
                        fooSchema
                    );
                    expect(findNextSchema(objectSchema, 'bar')).to.equal(
                        barSchema
                    );
                });
            });
            describe('and a key not defined in its properties', function () {
                it('returns the additionalProperties schema', function () {
                    expect(findNextSchema(objectSchema, 'fizz')).to.equal(
                        additionalPropertiesSchema
                    );
                    expect(findNextSchema(objectSchema, 'buzz')).to.equal(
                        additionalPropertiesSchema
                    );
                });
            });
        });
        describe('without additionalProperties', function () {
            const fooSchema = { type: 'string' };
            const barSchema = { type: 'string' };
            const objectSchema = {
                type: 'object',
                properties: { foo: fooSchema, bar: barSchema },
            };
            describe('and a key defined in its properties', function () {
                it('returns the schema from properties', function () {
                    expect(findNextSchema(objectSchema, 'foo')).to.equal(
                        fooSchema
                    );
                    expect(findNextSchema(objectSchema, 'bar')).to.equal(
                        barSchema
                    );
                });
            });
            describe('and a key not defined in its properties', function () {
                it('returns undefined', function () {
                    expect(findNextSchema(objectSchema, 'fizz')).to.be
                        .undefined;
                    expect(findNextSchema(objectSchema, 'buzz')).to.be
                        .undefined;
                });
            });
        });
    });
});
