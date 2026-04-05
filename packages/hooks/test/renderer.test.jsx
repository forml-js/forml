import React from 'react';
import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ObjectPath from 'objectpath';
import { renderHook } from '@testing-library/react';
import * as renderer from '#renderer';
import { RenderingContext } from '@forml/context';

chai.use(sinonChai);
const { expect } = chai;

describe('useTitleFor', function () {
    describe('without a form', function () {
        it('throws an error', function () {
            expect(() => renderHook(() => renderer.useTitleFor())).to.throw;
        });
    });
    describe('with a form', function () {
        describe('with a titleFun', function () {
            let titleFun;
            beforeEach(function () {
                titleFun = sinon.fake((value) => value);
            });
            describe('given a value', function () {
                it('calls the titleFun with the value', function () {
                    const { result } = renderHook(() =>
                        renderer.useTitleFor({ titleFun }, 'foo')
                    );
                    expect(result.error).to.be.undefined;
                    expect(result.current).to.equal('foo');
                    expect(titleFun).to.have.been.calledWith('foo');
                });
            });
            describe('given no value', function () {
                it('calls the titleFun', function () {
                    const { result } = renderHook(() =>
                        renderer.useTitleFor({ titleFun })
                    );
                    expect(result.error).to.be.undefined;
                    expect(result.current).to.be.undefined;
                    expect(titleFun).to.have.been.calledWith(undefined);
                });
            });
            it('returns the result of the titleFun', function () {
                const { result } = renderHook(() =>
                    renderer.useTitleFor({ titleFun }, 'foo')
                );
                expect(result.error).to.be.undefined;
                expect(result.current).to.equal('foo');
            });
        });
        describe('without a titleFun', function () {
            it('returns the title', function () {
                const { result: withFormResult } = renderHook(() =>
                    renderer.useTitleFor({ title: 'foo' })
                );
                expect(withFormResult.error).to.be.undefined;
                expect(withFormResult.current).to.equal('foo');
            });
        });
    });
});

describe('useMappedField', function () {
    const mapper = {
        Text: {},
    };
    const wrapper = ({ children }) => (
        <RenderingContext.Provider value={{ mapper }}>
            {children}
        </RenderingContext.Provider>
    );
    it('returns the specified mapped field from the rendering context', function () {
        const { result } = renderHook(() => renderer.useMappedField('Text'), {
            wrapper,
        });
        expect(result.current).to.equal(mapper.Text);
    });
});

describe('useDecorator', function () {
    const decorator = {
        text: {},
    };
    const wrapper = ({ children }) => (
        <RenderingContext.Provider value={{ decorator }}>
            {children}
        </RenderingContext.Provider>
    );
    describe('without a type', function () {
        it('returns the decorator from the rendering context', function () {
            const { result } = renderHook(() => renderer.useDecorator(), {
                wrapper,
            });
            expect(result.current).to.equal(decorator);
        });
    });
    describe('with a type', function () {
        describe('which is not found', function () {
            it('returns null', function () {
                const { result } = renderHook(
                    () => renderer.useDecorator('foo'),
                    {
                        wrapper,
                    }
                );
                expect(result.current).to.be.null;
            });
        });
        describe('which is found', function () {
            it('returns the requested field type from the rendering context', function () {
                const { result } = renderHook(
                    () => renderer.useDecorator('text'),
                    {
                        wrapper,
                    }
                );
                expect(result.current).to.equal(decorator.text);
            });
        });
    });
});

describe('useLocalizer', function () {
    const localizer = {};
    const wrapper = ({ children }) => (
        <RenderingContext.Provider value={{ localizer }}>
            {children}
        </RenderingContext.Provider>
    );
    it('returns the localizer from the rendering context', function () {
        const { result } = renderHook(() => renderer.useLocalizer(), {
            wrapper,
        });
        expect(result.current).to.equal(localizer);
    });
});

describe('useLocalizedString', function () {
    const localizer = {
        getLocalizedString: sinon.fake((id) => id),
    };
    const wrapper = ({ children }) => (
        <RenderingContext.Provider value={{ localizer }}>
            {children}
        </RenderingContext.Provider>
    );
    it('returns the localizer from the rendering context', function () {
        const { result } = renderHook(
            () => renderer.useLocalizedString('foo'),
            {
                wrapper,
            }
        );
        expect(localizer.getLocalizedString).to.have.been.calledWith('foo');
        expect(result.current).to.equal(localizer.getLocalizedString('foo'));
    });
});
