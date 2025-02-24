import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ARRAY_PLACEHOLDER } from '#constants';
import * as rules from '#rules';

describe('enumToTitles', function () {
    it('stringifies values to create titles', function () {
        expect(
            rules.enumToTitles(['a', 1, undefined, true, { test: 'b' }])
        ).to.deep.equal(['a', '1', 'undefined', 'true', '{"test":"b"}']);
    });
});

describe('test', function () {
    const options = { path: [], lookup: {} };
    describe('when the preferred type is object', function () {
        it('chooses type fieldset', function () {
            const schema = { type: 'object' };
            const form = { type: 'fieldset' };
            expect(rules.test(schema, options)).to.deep.include(form);
        });
        it('creates child items for its properties', function () {
            const schema = {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                    bar: { type: 'number' },
                },
            };
            const form = {
                type: 'fieldset',
                items: [
                    {
                        key: ['foo'],
                        type: 'text',
                        schema: schema.properties.foo,
                    },
                    {
                        key: ['bar'],
                        type: 'number',
                        schema: schema.properties.bar,
                    },
                ],
            };
            expect(rules.test(schema, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is array', function () {
        const type = 'array';
        describe('when the array is a list', function () {
            const items = { type: 'string' };
            describe('when the items are an enumeration', function () {
                const enm = ['a', 'b', 'c'];
                describe('when the schema requires uniqueItems', function () {
                    const uniqueItems = true;
                    it('chooses type multiselect', function () {
                        const schema = {
                            type,
                            uniqueItems,
                            items: { ...items, enum: enm },
                        };
                        const form = { type: 'multiselect' };
                        expect(rules.test(schema, options)).to.deep.include(
                            form
                        );
                    });
                    it("uses the schema's enumNames as titles", function () {
                        const enumNames = ['A', 'B', 'C'];
                        const schema = {
                            type,
                            uniqueItems,
                            items: { ...items, enum: enm, enumNames },
                        };
                        const form = { type: 'multiselect', titles: enumNames };
                        expect(rules.test(schema, options)).to.deep.include(
                            form
                        );
                    });
                    it('adds titles if not provided', function () {
                        const schema = {
                            type,
                            uniqueItems,
                            items: { ...items, enum: enm },
                        };
                        const form = { type: 'multiselect', titles: enm };
                        expect(rules.test(schema, options)).to.deep.include(
                            form
                        );
                    });
                });
            });
            it('choose type array', function () {
                const schema = { type, items };
                const form = {
                    type: 'array',
                    items: [
                        {
                            key: [ARRAY_PLACEHOLDER],
                            type: 'text',
                            schema: schema.items,
                        },
                    ],
                };
                expect(rules.test(schema, options)).to.deep.include(form);
            });
        });
        describe('when the array is a tuple', function () {
            const items = [{ type: 'string' }, { type: 'integer' }];
            it('chooses type tuple', function () {
                const schema = { type, items };
                const form = { type: 'tuple' };
                expect(rules.test(schema, options)).to.deep.include(form);
            });
        });
    });
    describe('when there is an enumeration', function () {
        const match = { type: 'string', enum: ['a', 'b', 'c'] };
        const form = { type: 'select' };
        const titles = ['a', 'b', 'c'];
        it('chooses type select', function () {
            expect(rules.test(match, options)).to.deep.include(form);
        });
        it("uses the schema's enumNames", function () {
            const enumNames = ['A', 'B', 'C'];
            const schema = { ...match, enumNames };
            const matchForm = { key: [], type: 'select', titles: enumNames };

            expect(rules.test(schema, options)).to.deep.include(matchForm);
        });
        it('includes titles', function () {
            expect(rules.test(match, options)).to.deep.include({
                ...form,
                titles,
            });
        });
    });
    describe('when the preferred type is string', function () {
        describe('when the format is date', function () {
            const match = { type: ['string', 'null'], format: 'date' };
            const form = {
                key: [],
                type: 'date',
            };
            it('chooses type date', function () {
                expect(rules.test(match, options)).to.deep.include(form);
            });
        });
        describe('when the format is date-time', function () {
            const match = { type: ['string', 'null'], format: 'date-time' };
            const form = {
                type: 'datetime',
                key: [],
            };
            it('chooses type datetime', function () {
                expect(rules.test(match, options)).to.deep.include(form);
            });
        });
        it('chooses type text', function () {
            const match = { type: 'string' };
            const form = { type: 'text' };
            expect(rules.test(match, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is boolean', function () {
        it('chooses checkbox', function () {
            const match = { type: 'boolean' };
            const form = { type: 'checkbox' };
            expect(rules.test(match, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is integer', function () {
        it('chooses type integer', function () {
            const schema = { type: 'integer' };
            const form = { type: 'integer' };
            expect(rules.test(schema, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is number', function () {
        it('chooses type number', function () {
            const schema = { type: 'number' };
            const form = { type: 'number' };
            expect(rules.test(schema, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is null', function () {
        it('chooses type null', function () {
            const schema = { type: 'null' };
            const form = { type: 'null' };
            expect(rules.test(schema, options)).to.deep.include(form);
        });
    });
    describe('when the preferred type is unrecognized', function () {
        it('chooses no type', function () {
            const schema = { type: 'test' };
            expect(rules.test(schema, options)).to.be.undefined;
        });
    });
});
