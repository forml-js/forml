import {
    mappedKeyOfIndex,
    useActions,
    useActionsFor,
    useModelStore,
    useModelContext,
} from '#model';
import { ModelContext, RenderingContext } from '@forml/context';
import { act, renderHook } from '@testing-library/react';
import * as chai from 'chai';
import domChai from 'chai-dom';
import { describe, it } from 'mocha';
import objectPath from 'objectpath';
import React from 'react';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => {
        return (
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );
    };
}

describe('useActions', function () {
    let wrapper;
    let schema;
    let renderingContext;
    let prefix;
    let modelStore;
    beforeEach(function () {
        prefix = [];
        schema = {
            type: 'object',
            properties: {
                baz: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                foo: {
                    type: 'object',
                    properties: {
                        biz: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        bar: {
                            type: 'object',
                            properties: {
                                fizz: {
                                    type: 'string',
                                },
                                buzz: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        };
        renderingContext = { prefix };
        modelStore = renderHook(() => useModelStore(schema, { baz: [] })).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext });
    });

    it('returns an object of model actions', function () {
        const { result } = renderHook(() => useActions(), {
            wrapper,
        });
        expect(result.current).to.be.an('object');
        expect(result.current).to.have.all.keys(
            'setValue',
            'removeValue',
            'appendArray',
            'removeArray',
            'moveArrayRelative',
            'moveArray'
        );
    });

    describe('setValue', function () {
        it('sets the provided value at the path of the given key', function () {
            const key = ['foo', 'bar', 'fizz'];
            const { result: actions } = renderHook(() => useActions(), {
                wrapper,
            });

            const { model: preModel } = modelStore.getState();
            expect(preModel.foo?.bar?.fizz).not.to.equal('qux');

            act(() => {
                actions.current.setValue(key, 'qux');
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel.foo?.bar?.fizz).to.equal('qux');
        });
    });

    describe('removeValue', function () {
        it('removes the value at the path of the given key', function () {
            const key = ['foo', 'bar', 'fizz'];
            const { result: actions } = renderHook(() => useActions(), {
                wrapper,
            });
            act(() => {
                actions.current.setValue(key, 'qux');
            });

            const { model: preModel } = modelStore.getState();
            expect(preModel.foo?.bar?.fizz).to.equal('qux');

            act(() => {
                actions.current.removeValue(key);
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel.foo?.bar?.fizz).to.be.undefined;
        });
    });

    describe('appendArray', function () {
        it('adds an element to the array under the given key in the model', function () {
            const key = ['baz'];
            const { result: actions } = renderHook(() => useActions(), {
                wrapper,
            });
            const { model: preModel } = modelStore.getState();
            expect(preModel?.baz?.length).to.equal(0);
            act(() => {
                actions.current.appendArray(key);
            });
            const { model: postModel } = modelStore.getState();
            expect(postModel?.baz?.length).to.equal(1);
        });
        describe('with a value', function () {
            it('appends the value to the end of the array', function () {
                const key = ['baz'];
                const { result: actions } = renderHook(() => useActions(), {
                    wrapper,
                });
                const value = 'qux';
                act(() => {
                    actions.current.appendArray(key, value);
                });
                const { model: postModel } = modelStore.getState();
                expect(postModel.baz).to.deep.equal([value]);
            });
        });
        describe('which is undefined in the model', function () {
            beforeEach(function () {
                modelStore = renderHook(() =>
                    useModelStore(schema, { baz: undefined })
                ).result.current;
            });
            it('creates an array with one element', async function () {
                const key = ['baz'];
                const { result: actions } = renderHook(() => useActions(), {
                    wrapper,
                });
                const value = 'qux';
                act(() => {
                    actions.current.appendArray(key, value);
                });
                const fullContext = renderHook(() => useModelContext(), {
                    wrapper,
                });
                const {
                    result: { current: postStore },
                } = fullContext;
                const { model: postModel } = postStore.getState();
                expect(postModel.baz).to.deep.equal([value]);
            });
        });
    });

    describe('removeArray', function () {
        it('removes the element at the given index in the array specified by the key', function () {
            const key = ['baz'];
            const { result: actions } = renderHook(() => useActions(), {
                wrapper,
            });
            act(() => {
                actions.current.appendArray(key);
            });
            const { model: preModel, keyMaps: preKeyMaps } =
                modelStore.getState();
            const firstArrayKey = mappedKeyOfIndex(preKeyMaps, key, 0);
            expect(preModel?.baz?.length).to.equal(1);
            act(() => {
                actions.current.removeArray(key, firstArrayKey);
            });
            const { model: postModel } = modelStore.getState();
            expect(postModel?.baz?.length).to.be.undefined;
        });
    });

    describe('moveArrayRelative', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { baz: ['a', 'b', 'c'] })
            ).result.current;
            wrapper = makeWrapper({
                modelStore,
                renderingContext,
            });
        });

        it('moves the element at the given index in the array specified by the key', function () {
            const key = ['baz'];
            const { result: actions } = renderHook(() => useActions(), {
                wrapper,
            });
            const { model: preModel, keyMaps: preKeyMaps } =
                modelStore.getState();
            const firstArrayKey = mappedKeyOfIndex(preKeyMaps, key, 0);
            expect(preModel.baz).to.deep.equal(['a', 'b', 'c']);

            act(() => {
                actions.current.moveArrayRelative(key, firstArrayKey, 1);
            });
            const { model: postModel, keyMaps: postKeyMaps } =
                modelStore.getState();
            expect(postModel.baz).to.deep.equal(['b', 'a', 'c']);

            act(() => {
                actions.current.moveArrayRelative(key, firstArrayKey, -1);
            });
            const { model: postModel2, keyMaps: postKeyMaps2 } =
                modelStore.getState();
            expect(postModel2.baz).to.deep.equal(['a', 'b', 'c']);
        });
    });

    describe('moveArray', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { baz: ['a', 'b', 'c'] })
            ).result.current;
            wrapper = makeWrapper({
                modelStore,
                renderingContext,
            });
        });
        it('moves the element at the given index in the array specified by the key', function () {
            const key = ['baz'];
            const { result: actions, rerender } = renderHook(
                () => useActions(),
                {
                    wrapper,
                }
            );
            const { model: preModel, keyMaps: preKeyMaps } =
                modelStore.getState();
            const firstArrayKey = mappedKeyOfIndex(preKeyMaps, key, 0);
            expect(preModel.baz).to.deep.equal(['a', 'b', 'c']);

            act(() => {
                actions.current.moveArray(key, firstArrayKey, 2);
            });
            rerender();
            const { model: postModel } = modelStore.getState();
            expect(postModel.baz).to.deep.equal(['b', 'c', 'a']);

            act(() => {
                actions.current.moveArray(key, firstArrayKey, 1);
            });
            rerender();
            const { model: postModel2 } = modelStore.getState();
            expect(postModel2.baz).to.deep.equal(['b', 'a', 'c']);
        });
    });

    describe('with a prefix', function () {
        let prefix;
        beforeEach(function () {
            prefix = ['foo', 'bar'];
            renderingContext = { prefix };
        });
    });
    describe('without a prefix', function () {});
});

describe('useActionsFor', function () {
    let wrapper;
    let schema;
    let renderingContext;
    let prefix;
    let modelStore;
    beforeEach(function () {
        prefix = '';
        schema = {
            type: 'object',
            properties: {
                baz: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                foo: {
                    type: 'object',
                    properties: {
                        bar: {
                            type: 'object',
                            properties: {
                                fizz: {
                                    type: 'string',
                                },
                                buzz: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        };
        renderingContext = { prefix };
        modelStore = renderHook(() => useModelStore(schema, { baz: [] })).result
            .current;
        wrapper = makeWrapper({ modelStore, renderingContext });
    });
    describe('setValue', function () {
        it('sets the value for the given key', function () {
            const key = ['foo', 'bar', 'fizz'];
            const { result: actions } = renderHook(() => useActionsFor(key), {
                wrapper,
            });

            const { model: preModel } = modelStore.getState();
            expect(preModel.foo?.bar?.fizz).to.be.undefined;

            const value = 'hello';
            act(() => {
                actions.current.setValue(value);
            });
            const { model: postModel } = modelStore.getState();
            expect(postModel.foo?.bar?.fizz).to.equal(value);
        });
    });
    describe('removeValue', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { foo: { bar: { fizz: 'hello' } } })
            ).result.current;
            wrapper = makeWrapper({ modelStore, renderingContext });
        });
        it('removes the value for the given key', function () {
            const key = ['foo', 'bar', 'fizz'];
            const { result: actions } = renderHook(() => useActionsFor(key), {
                wrapper,
            });

            const { model: preModel } = modelStore.getState();
            expect(preModel.foo?.bar?.fizz).to.equal('hello');

            act(() => {
                actions.current.removeValue();
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel).not.to.be.undefined;
            expect(postModel.foo?.bar?.fizz).to.be.undefined;
        });
    });
    describe('appendArray', function () {
        describe('given a value', function () {
            it('appends the value to the array for the given key', function () {
                const key = ['baz'];
                const { result: actions } = renderHook(
                    () => useActionsFor(key),
                    {
                        wrapper,
                    }
                );

                const { model: preModel } = modelStore.getState();
                expect(preModel.baz).to.deep.equal([]);

                const value = 'hello';
                act(() => {
                    actions.current.appendArray(value);
                });
                const { model: postModel } = modelStore.getState();
                expect(postModel.baz).to.deep.equal(['hello']);
            });
        });
        describe('given no value', function () {
            it('appends the schema default to the array at the given key', function () {
                const key = ['baz'];
                const { result: actions } = renderHook(
                    () => useActionsFor(key),
                    {
                        wrapper,
                    }
                );

                const { model: preModel } = modelStore.getState();
                expect(preModel.baz).to.deep.equal([]);

                act(() => {
                    actions.current.appendArray();
                });

                const { model: postModel } = modelStore.getState();
                expect(postModel.baz).to.deep.equal(['']);
            });
        });
    });
    describe('removeArray', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { baz: ['hello', 'world'] })
            ).result.current;
            wrapper = makeWrapper({ modelStore, renderingContext });
        });
        it('removes the array item at the given index', function () {
            const key = ['baz'];
            const path = objectPath.stringify(key);
            const { result: actions } = renderHook(() => useActionsFor(key), {
                wrapper,
            });

            const { model: preModel, keyMaps } = modelStore.getState();
            const secondKey = keyMaps[path].indexToKey[1];
            expect(preModel.baz).to.deep.equal(['hello', 'world']);

            act(() => {
                actions.current.removeArray(secondKey);
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel.baz).to.deep.equal(['hello']);

            const firstKey = keyMaps[path].indexToKey[0];
            act(() => {
                actions.current.removeArray(firstKey);
            });
            const { model: postModel2 } = modelStore.getState();
            expect(postModel2.baz).to.be.undefined;
        });
    });
    describe('moveArrayRelative', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { baz: ['a', 'b', 'c'] })
            ).result.current;
            wrapper = makeWrapper({ modelStore, renderingContext });
        });
        it('moves the array item at the given index', function () {
            const key = ['baz'];
            const path = objectPath.stringify(key);
            const { result: actions } = renderHook(() => useActionsFor(key), {
                wrapper,
            });

            const { model: preModel, keyMaps } = modelStore.getState();
            const firstKey = keyMaps[path].indexToKey[0];
            expect(preModel.baz).to.deep.equal(['a', 'b', 'c']);

            act(() => {
                actions.current.moveArrayRelative(key, firstKey, 1);
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel.baz).to.deep.equal(['b', 'a', 'c']);

            act(() => {
                actions.current.moveArrayRelative(key, firstKey, -1);
            });
            const { model: postModel2 } = modelStore.getState();
            expect(postModel2.baz).to.deep.equal(['a', 'b', 'c']);
        });
    });
    describe('moveArray', function () {
        beforeEach(function () {
            modelStore = renderHook(() =>
                useModelStore(schema, { baz: ['a', 'b', 'c'] })
            ).result.current;
            wrapper = makeWrapper({ modelStore, renderingContext });
        });
        it('moves the array item at the given index', function () {
            const key = ['baz'];
            const path = objectPath.stringify(key);
            const { result: actions } = renderHook(() => useActionsFor(key), {
                wrapper,
            });

            const { model: preModel, keyMaps } = modelStore.getState();
            const firstKey = keyMaps[path].indexToKey[0];
            expect(preModel.baz).to.deep.equal(['a', 'b', 'c']);

            act(() => {
                actions.current.moveArray(firstKey, 1);
            });

            const { model: postModel } = modelStore.getState();
            expect(postModel.baz).to.deep.equal(['b', 'a', 'c']);

            act(() => {
                actions.current.moveArray(firstKey, 2);
            });
            const { model: postModel2 } = modelStore.getState();
            expect(postModel2.baz).to.deep.equal(['b', 'c', 'a']);
        });
    });
});
