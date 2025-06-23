import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as util from '#util';

chai.use(sinonChai);
const { expect } = chai;

const { clone, getNextValue, getTypeOf } = util;

describe('defaultForSchema', function () {
    it('returns the default value if specified in the schema', function () {
        expect(
            util.defaultForSchema({ type: 'string', default: 'test' })
        ).to.equal('test');
        expect(
            util.defaultForSchema({ type: 'boolean', default: true })
        ).to.equal(true);
        expect(
            util.defaultForSchema({ type: 'boolean', default: false })
        ).to.equal(false);
        expect(util.defaultForSchema({ type: 'number', default: 3 })).to.equal(
            3
        );
        expect(
            util.defaultForSchema({ type: 'number', default: 3.1 })
        ).to.equal(3.1);
    });
    describe('when given one type', function () {
        it('returns an empty value of the type', function () {
            expect(util.defaultForSchema({ type: 'null' })).to.be.null;
            expect(util.defaultForSchema({ type: 'string' })).to.equal('');
            expect(util.defaultForSchema({ type: 'number' })).to.equal(0.0);
            expect(util.defaultForSchema({ type: 'integer' })).to.equal(0);
            expect(util.defaultForSchema({ type: 'boolean' })).to.equal(false);
            expect(
                util.defaultForSchema({
                    type: 'array',
                    items: { type: 'string' },
                })
            ).to.deep.equal([]);
            expect(
                util.defaultForSchema({
                    type: 'array',
                    items: [{ type: 'string' }],
                })
            ).to.deep.equal(['']);
            expect(util.defaultForSchema({ type: 'object' })).to.deep.equal({});
            expect(
                util.defaultForSchema({
                    type: 'object',
                    properties: {
                        test: {
                            type: 'string',
                        },
                    },
                })
            ).to.deep.equal({});
            expect(
                util.defaultForSchema({
                    type: 'object',
                    required: ['test'],
                    properties: {
                        test: {
                            type: 'string',
                        },
                    },
                })
            ).to.deep.equal({ test: '' });
            expect(util.defaultForSchema({ type: 'unknown' })).to.be.undefined;
        });
    });
    describe('when given many types', function () {
        it('returns an empty value of the preferredType', function () {
            expect(
                util.defaultForSchema({ type: ['string', 'integer'] })
            ).to.equal('');
            expect(
                util.defaultForSchema({ type: ['number', 'string'] })
            ).to.equal(0.0);
            expect(
                util.defaultForSchema({ type: ['integer', 'string'] })
            ).to.equal(0);
            expect(
                util.defaultForSchema({ type: ['boolean', 'number'] })
            ).to.equal(false);
            expect(
                util.defaultForSchema({
                    type: ['array', 'object'],
                    items: { type: 'string' },
                    properties: {
                        test: { type: 'string' },
                    },
                })
            ).to.deep.equal([]);
            expect(
                util.defaultForSchema({
                    type: ['array', 'object'],
                    items: [{ type: 'string' }],
                    properties: {
                        test: { type: 'string' },
                    },
                })
            ).to.deep.equal(['']);
            expect(
                util.defaultForSchema({ type: ['object', 'array'] })
            ).to.deep.equal({});
            expect(util.defaultForSchema({ type: ['unknown', 'integer'] })).to
                .be.undefined;
        });
    });
});
describe('assertType', function () {
    it('nullifies falsey values if allowed', function () {
        expect(util.assertType({ type: ['integer', 'null'] }, 0)).to.be.null;
        expect(util.assertType({ type: ['number', 'null'] }, 0.0)).to.be.null;
        expect(util.assertType({ type: ['string', 'null'] }, '')).to.be.null;
        expect(util.assertType({ type: ['boolean', 'null'] }, false)).to.be
            .null;
    });
    it('accepts values that match their type', function () {
        expect(util.assertType({ type: 'number' }, 2.5)).to.equal(2.5);
        expect(util.assertType({ type: 'integer' }, 2)).to.equal(2);
        expect(util.assertType({ type: 'string' }, 'test')).to.equal('test');
        expect(util.assertType({ type: 'boolean' }, true)).to.equal(true);
        expect(util.assertType({ type: 'boolean' }, false)).to.equal(false);

        const array = [1, 2, 3];
        expect(util.assertType({ type: 'array' }, array)).to.equal(array);

        const object = { a: 1, b: 2, c: 3 };
        expect(util.assertType({ type: 'object' }, object)).to.equal(object);
    });
    describe('when there is a default value', function () {
        it('it allows the default to be overwritten', function () {
            expect(
                util.assertType(
                    {
                        type: 'integer',
                        default: 1,
                    },
                    2
                )
            ).to.equal(2);
            expect(
                util.assertType(
                    {
                        type: 'number',
                        default: 1.1,
                    },
                    3.1
                )
            ).to.equal(3.1);
            expect(
                util.assertType(
                    {
                        type: 'string',
                        default: 'test',
                    },
                    'testb'
                )
            ).to.equal('testb');
            expect(
                util.assertType(
                    {
                        type: 'boolean',
                        default: true,
                    },
                    false
                )
            ).to.equal(false);
            expect(
                util.assertType(
                    {
                        type: 'boolean',
                        default: false,
                    },
                    true
                )
            ).to.equal(true);
        });
    });
    describe('when the preferred type is an integer', function () {
        describe('when the type is allowed', function () {
            it('allows the value', function () {
                expect(
                    util.assertType({ type: ['integer', 'string'] }, 'test')
                ).to.equal('test');
                expect(
                    util.assertType({ type: ['integer', 'boolean'] }, false)
                ).to.equal(false);
            });
        });
        describe('when the type is a number', function () {
            it('converts it to an integer', function () {
                expect(util.assertType({ type: 'integer' }, 1.5)).to.equal(1);
                expect(util.assertType({ type: 'number' }, 1.5)).to.equal(1.5);
            });
        });
        describe('when the type is a string', function () {
            describe('and the value is empty', function () {
                it('allows the value to pass', function () {
                    expect(util.assertType({ type: 'integer' }, '')).to.equal(
                        ''
                    );
                });

                // This covers a distinct form behavior: deleting the last
                // remaining character.
                it('does not return defaultForSchema', function () {
                    expect(
                        util.assertType(
                            {
                                type: 'integer',
                                default: 1,
                            },
                            ''
                        )
                    ).to.equal('');
                });
            });
            it('allows the minus character', function () {
                expect(util.assertType({ type: 'integer' }, '-')).to.equal('-');
            });
            it('othewise parses an integer', function () {
                expect(util.assertType({ type: 'integer' }, '1.5')).to.equal(1);
                expect(util.assertType({ type: 'integer' }, '2')).to.equal(2);
            });
        });
        describe('when the type is not allowed', function () {
            it('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'integer' }, null)).to.equal(0);
            });
        });
    });
    describe('when the preferred type is a number', function () {
        describe('when the type is allowed', function () {
            it('allows the value', function () {
                expect(
                    util.assertType({ type: ['number', 'string'] }, 'test')
                ).to.equal('test');
                expect(
                    util.assertType({ type: ['number', 'boolean'] }, false)
                ).to.equal(false);
            });
        });
        describe('when the type is a string', function () {
            it('allows it if empty', function () {
                expect(util.assertType({ type: 'number' }, '')).to.equal('');
            });
            it('allows the minus character', function () {
                expect(util.assertType({ type: 'number' }, '-')).to.equal('-');
            });
            it('parses a float', function () {
                expect(util.assertType({ type: 'number' }, '1.5')).to.equal(
                    1.5
                );
                expect(util.assertType({ type: 'number' }, '2')).to.equal(2);
            });
        });
        describe('when the type is not allowed', function () {
            it('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'number' }, null)).to.equal(0.0);
            });
        });
    });
    describe('when the preferred type is a string', function () {
        describe('when the type is a number', function () {
            it('converts the number to a string', function () {
                expect(util.assertType({ type: 'string' }, 1.5)).to.equal(
                    '1.5'
                );
            });
        });
    });
    describe('when the type does not match the preferred type', function () {
        describe('when the value is falsey', function () {
            it('returns defaultForSchema', function () {
                expect(util.assertType({ type: 'string' }, null)).to.equal('');
            });
        });
    });
    describe('when the type is allowed', function () {
        it('returns the value unchanged', function () {
            expect(
                util.assertType({ type: ['string', 'boolean'] }, true)
            ).to.equal(true);
        });
    });
    describe('when the type is not allowed', function () {
        it('returns defaultForSchema', function () {
            expect(util.assertType({ type: 'string' }, true)).to.equal('');
        });
    });
});
describe('traverseForm', function () {
    it('takes a single form object or an array', function () {
        const forms = ['test', 'property'];
        const form = 'foo';
        const callback = sinon.fake();

        util.traverseForm(forms, callback);
        util.traverseForm(form, callback);

        expect(callback).to.have.been.calledWith('test');
        expect(callback).to.have.been.calledWith('property');
        expect(callback).to.have.been.calledWith('foo');
    });
    it('visits nested children', function () {
        const nested = { key: 'property', items: ['foo'] };
        const forms = ['test', nested];
        const callback = sinon.fake();

        util.traverseForm(forms, callback);

        expect(callback).to.have.been.calledWith('test');
        expect(callback).to.have.been.calledWith(nested);
        expect(callback).to.have.been.calledWith('foo');
    });
});
describe('clone', function () {
    it('returns pass-by-copy values unmodified', function () {
        expect(util.clone('test')).to.equal('test');
        expect(util.clone(1)).to.equal(1);
    });
    it('returns copies of pass-by-reference values', function () {
        const array = [1, 2, 3];
        const arrayClone = util.clone(array);
        expect(arrayClone).to.deep.equal(array);
        expect(arrayClone).not.to.equal(array);

        const object = { a: 1, b: 2, c: 3 };
        const objectClone = util.clone(object);
        expect(objectClone).to.deep.equal(object);
        expect(objectClone).not.to.equal(object);
    });
    it('copies are deep copies', function () {
        const array = [1, 2, 3];
        const object = { array };
        const clone = util.clone(object);

        expect(clone).to.deep.equal(object);
        expect(clone).not.to.equal(object);
        expect(clone.array).to.deep.equal(array);
        expect(clone.array).not.to.equal(array);
    });
});
describe('getNextValue', function () {
    it('returns defaultForSchema when value[key] is undefined', function () {
        const schema = { type: 'string', default: 'test default' };
        const value = { otherKey: 'exists' };
        const key = 'missingKey';

        const result = getNextValue(schema, value, key);
        expect(result).to.equal('test default');
    });

    it('returns assertType result when value[key] exists', function () {
        const schema = { type: 'string' };
        const value = { existingKey: 'test value' };
        const key = 'existingKey';

        const result = getNextValue(schema, value, key);
        expect(result).to.equal('test value');
    });
});
describe('getTypeOf', function () {
    it('returns getPreferredType result for undefined values', function () {
        const schema = { type: ['string', 'number'] };
        const result = getTypeOf(schema, undefined);

        expect(result).to.equal('string'); // First non-null type
    });

    it('handles schema with single type', function () {
        const schema = { type: 'integer' };
        const result = getTypeOf(schema, undefined);

        expect(result).to.equal('integer');
    });
});
