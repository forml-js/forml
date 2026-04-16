import {
    ArrayPlaceholder,
    buildKeyMaps,
    addArrayKeyForIndex,
    mapArrayKeysToIndex,
    mappedIndexOfKey,
    mappedKeyOfIndex,
    moveArrayKeyForIndex,
    dropArrayKeyForIndex,
    usePrefix,
    usePrefixed,
    useModelStore,
} from '#model';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { renderHook } from '@testing-library/react';

let schema;
let renderingContext;
let prefix;
beforeEach(function () {
    prefix = '';
    schema = {
        type: 'array',
        items: { type: 'string' },
    };
    renderingContext = { prefix };
});

describe('buildKeyMaps', function () {
    describe('with an array schema', function () {
        it('creates a map record under the empty-string key', function () {
            const schema = { type: 'array', items: { type: 'string' } };
            const model = [];
            const keyMaps = buildKeyMaps(schema, model);
            expect(keyMaps['']).to.be.an('object');
        });
        describe('the map record', function () {
            let keyMaps;
            let schema;
            let model;
            let keyMap;
            beforeEach(function () {
                schema = { type: 'array', items: { type: 'string' } };
                model = [];
                keyMaps = buildKeyMaps(schema, model);
                keyMap = keyMaps[''];
            });
            it('includes a key-to-index map', function () {
                expect(keyMap)
                    .to.have.property('keyToIndex')
                    .that.is.an('object');
            });
            it('includes an index-to-key map', function () {
                expect(keyMap)
                    .to.have.property('indexToKey')
                    .that.is.an('object');
            });

            describe('given an empty model', function () {
                it('creates empty maps', function () {
                    const schema = { type: 'array', items: { type: 'string' } };
                    const model = [];
                    const keyMaps = buildKeyMaps(schema, model);
                    expect(keyMaps[''].indexToKey).to.be.an('object').that.is
                        .empty;
                    expect(keyMaps[''].keyToIndex).to.be.an('object').that.is
                        .empty;
                });
            });

            describe('given a model with items', function () {
                beforeEach(function () {
                    model = ['a', 'b', 'c'];
                    keyMaps = buildKeyMaps(schema, model);
                    keyMap = keyMaps[''];
                });
                it('creates a key for each item', function () {
                    expect(Object.keys(keyMap.keyToIndex).length).to.equal(3);
                    expect(Object.values(keyMap.keyToIndex)).to.have.members([
                        0, 1, 2,
                    ]);
                });
                it('maps each index to a key', function () {
                    expect(keyMap.indexToKey).to.have.property('0').that.is.a
                        .string;
                    expect(keyMap.indexToKey).to.have.property('1').that.is.a
                        .string;
                    expect(keyMap.indexToKey).to.have.property('2').that.is.a
                        .string;
                });
            });
        });
    });
});
describe('mappedKeyOfIndex', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        it('throws an error', function () {
            expect(() => mappedKeyOfIndex(keyMaps, 'a', 0)).to.throw(
                'array keymaps not found'
            );
        });
    });

    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = { type: 'array', items: { type: 'string' } };
            model = ['a', 'b', 'c'];
            keyMaps = buildKeyMaps(schema, model);
        });
        describe('given a key', function () {
            it('returns the key for the given index', function () {
                expect(mappedKeyOfIndex(keyMaps, [], 0)).to.be.a.string;
            });
        });
    });
});
describe('mapArrayKeysToIndex', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        describe('given a key', function () {
            let key;
            describe('with array placeholders', function () {
                beforeEach(function () {
                    key = ['a', 'b', ArrayPlaceholder(['a', 'b'], 'c')];
                });
                it('throws an error', function () {
                    expect(() => mapArrayKeysToIndex(keyMaps, key)).to.throw(
                        'array keymaps not found'
                    );
                });
            });
            describe('with no array placeholders', function () {
                beforeEach(function () {
                    key = ['a', 'b', 'c'];
                });
                it('returns the key unchanged', function () {
                    expect(mapArrayKeysToIndex(keyMaps, key)).to.deep.equal(
                        key
                    );
                });
            });
        });
    });
    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = {
                type: 'object',
                properties: {
                    a: { type: 'string' },
                    b: { type: 'array', items: { type: 'string' } },
                    c: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                            bar: { type: 'array', items: { type: 'string' } },
                        },
                    },
                    d: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                foo: { type: 'string' },
                                bar: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            };
            model = {
                a: '',
                b: [],
                c: { foo: '', bar: [] },
                d: [],
            };
            keyMaps = buildKeyMaps(schema, model);
        });
        describe('given a key', function () {
            describe('with no array placeholders', function () {
                let key;
                beforeEach(function () {
                    key = ['a', 'b', 'c'];
                });
                it('returns the key unchanged', function () {
                    expect(mapArrayKeysToIndex(keyMaps, key)).to.deep.equal(
                        key
                    );
                });
            });
            describe('with array placeholders', function () {
                describe('which are not found', function () {
                    it('throws an "array key not found" error', function () {
                        const key = ['a', 'b', ArrayPlaceholder(['b'], 'c')];
                        expect(() =>
                            mapArrayKeysToIndex(keyMaps, key)
                        ).to.throw('array key not found');
                    });
                });
                describe('which are found', function () {
                    beforeEach(function () {
                        model = {
                            a: '',
                            b: ['a', 'b'],
                            c: { foo: '', bar: ['a', 'b'] },
                            d: [
                                { foo: '', bar: ['a', 'b'] },
                                { foo: '', bar: ['b', 'c'] },
                            ],
                        };
                        keyMaps = buildKeyMaps(schema, model);
                    });
                    it('replaces array placeholders with indexes', function () {
                        const key1 = [
                            'b',
                            ArrayPlaceholder(
                                ['b'],
                                mappedKeyOfIndex(keyMaps, ['b'], 1)
                            ),
                        ];
                        expect(
                            mapArrayKeysToIndex(keyMaps, key1)
                        ).to.deep.equal(['b', 1]);

                        const key2 = [
                            'c',
                            'bar',
                            ArrayPlaceholder(
                                ['c', 'bar'],
                                mappedKeyOfIndex(keyMaps, ['c', 'bar'], 1)
                            ),
                        ];
                        expect(
                            mapArrayKeysToIndex(keyMaps, key2)
                        ).to.deep.equal(['c', 'bar', 1]);

                        const key3 = [
                            'd',
                            1,
                            'bar',
                            ArrayPlaceholder(
                                ['d', 1, 'bar'],
                                mappedKeyOfIndex(keyMaps, ['d', 1, 'bar'], 1)
                            ),
                        ];
                        expect(
                            mapArrayKeysToIndex(keyMaps, key3)
                        ).to.deep.equal(['d', 1, 'bar', 1]);
                    });
                });
            });
        });
    });
});
describe('mappedIndexOfKey', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        it('throws an error', function () {
            expect(() => mappedIndexOfKey(keyMaps, 'a', 'b')).to.throw(
                'array keymaps not found'
            );
        });
    });
    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = { type: 'array', items: { type: 'string' } };
            model = ['a', 'b', 'c'];
            keyMaps = buildKeyMaps(schema, model);
        });
        describe('given a key', function () {
            describe('which is not found', function () {
                it('throws an "array key not found" error', function () {
                    expect(() => mappedIndexOfKey(keyMaps, [], 'd')).to.throw(
                        'array key not found'
                    );
                });
            });
            describe('which is found', function () {
                it('returns the mapped index of the key', function () {
                    expect(
                        mappedIndexOfKey(keyMaps, [], keyMaps[''].indexToKey[1])
                    ).to.equal(1);
                });
            });
        });
    });
});
describe('dropArrayKeyForIndex', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        it('throws an error', function () {
            expect(() => dropArrayKeyForIndex(keyMaps, 'a', 0)).to.throw(
                'array keymaps not found'
            );
        });
    });
    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = {
                type: 'object',
                properties: {
                    a: { type: 'string' },
                    b: { type: 'array', items: { type: 'string' } },
                    c: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                            bar: { type: 'array', items: { type: 'string' } },
                        },
                    },
                    d: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                foo: { type: 'string' },
                                bar: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            };
            model = {
                a: '',
                b: ['a', 'b'],
                c: { foo: '', bar: ['a', 'b'] },
                d: [
                    { foo: '', bar: ['a', 'b'] },
                    { foo: '', bar: ['b', 'c'] },
                ],
            };
            keyMaps = buildKeyMaps(schema, model);
        });
        describe('given a key', function () {
            describe('which is not found', function () {
                it('throws an "array key not found" error', function () {
                    expect(() =>
                        dropArrayKeyForIndex(keyMaps, ['b'], 2)
                    ).to.throw('array key not found');
                });
            });
            describe('which is found', function () {
                it('returns updated keymaps with the key removed', function () {
                    expect(keyMaps.b.indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0', '1');
                    expect(keyMaps['c.bar'].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0', '1');
                    expect(keyMaps['d[1].bar'].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0', '1');

                    const updatedKeyMaps = dropArrayKeyForIndex(
                        keyMaps,
                        ['b'],
                        0
                    );
                    expect(updatedKeyMaps.b.indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0');

                    const updatedKeyMaps2 = dropArrayKeyForIndex(
                        keyMaps,
                        ['c', 'bar'],
                        1
                    );
                    expect(updatedKeyMaps2['c.bar'].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0');

                    const updatedKeyMaps3 = dropArrayKeyForIndex(
                        keyMaps,
                        ['d', 1, 'bar'],
                        0
                    );
                    expect(updatedKeyMaps3['d[1].bar'].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0');
                });
            });
        });
    });
});
describe('moveArrayKeyForIndex', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        it('throws an error', function () {
            expect(() => moveArrayKeyForIndex(keyMaps, 'a', 0, 1)).to.throw(
                'array keymaps not found'
            );
        });
    });
    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = { type: 'array', items: { type: 'string' } };
            model = ['a', 'b', 'c'];
            keyMaps = buildKeyMaps(schema, model);
        });
        describe('given a key', function () {
            describe('which is not found', function () {
                it('throws an "array key not found" error', function () {
                    expect(() =>
                        moveArrayKeyForIndex(keyMaps, [], 'a', 0)
                    ).to.throw('array key not found');
                });
            });
            describe('which is found', function () {
                it('returns updated keymaps with the key moved', function () {
                    expect(keyMaps[''].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0', '1', '2');
                    const updatedKeyMaps = moveArrayKeyForIndex(
                        keyMaps,
                        [],
                        0,
                        2
                    );
                    expect(updatedKeyMaps[''].indexToKey)
                        .to.be.an('object')
                        .that.has.keys('0', '1', '2');
                    expect(updatedKeyMaps[''].indexToKey[2]).to.equal(
                        keyMaps[''].indexToKey[0]
                    );
                    expect(updatedKeyMaps[''].indexToKey[1]).to.equal(
                        keyMaps[''].indexToKey[2]
                    );
                    expect(updatedKeyMaps[''].indexToKey[0]).to.equal(
                        keyMaps[''].indexToKey[1]
                    );
                });
            });
        });
    });
});
describe('addArrayKeyForIndex', function () {
    describe('with empty keyMaps', function () {
        let keyMaps;
        beforeEach(function () {
            keyMaps = {};
        });
        it('throws an error', function () {
            expect(() => addArrayKeyForIndex(keyMaps, 'a', 0)).to.throw(
                'array keymaps not found'
            );
        });
    });

    describe('with populated keyMaps', function () {
        let schema;
        let model;
        let keyMaps;
        beforeEach(function () {
            schema = { type: 'array', items: { type: 'string' } };
            model = ['a', 'b', 'c'];
            keyMaps = buildKeyMaps(schema, model);
        });

        it('returns updated keymaps with the key added', function () {
            expect(keyMaps[''].indexToKey)
                .to.be.an('object')
                .that.has.keys('0', '1', '2');
            const updatedKeyMaps = addArrayKeyForIndex(keyMaps, [], 3);
            expect(updatedKeyMaps[''].indexToKey)
                .to.be.an('object')
                .that.has.keys('0', '1', '2', '3');

            expect(mappedKeyOfIndex(updatedKeyMaps, [], 3)).to.be.a.string;
        });
    });
});
describe('usePrefix', function () {
    let prefix;
    let wrapper;
    beforeEach(function () {
        prefix = [];
        wrapper = ({ children }) => (
            <RenderingContext.Provider value={{ prefix }}>
                {children}
            </RenderingContext.Provider>
        );
    });
    it('returns the prefix from the rendering context', function () {
        const { result } = renderHook(() => usePrefix(), {
            wrapper,
        });
        expect(result.current).to.equal(prefix);
    });
});
describe('usePrefixed', function () {
    let prefix;
    let wrapper;
    beforeEach(function () {
        prefix = ['foo'];
        wrapper = ({ children }) => (
            <RenderingContext.Provider value={{ prefix }}>
                {children}
            </RenderingContext.Provider>
        );
    });
    describe('given a key', function () {
        it('returns the key with the prefix prepended', function () {
            const { result } = renderHook(() => usePrefixed(['bar']), {
                wrapper,
            });
            expect(result.current).to.deep.equal(['foo', 'bar']);
        });
    });
});
