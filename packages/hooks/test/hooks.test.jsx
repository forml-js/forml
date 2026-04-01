import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import domChai from 'chai-dom';
import React from 'react';
import {
    useLocalizer,
    useDecorator,
    useMapper,
    useModel,
    useModelStore,
    useGenerator,
    useMerged,
} from '../src/index.jsx';
import { RenderingContext as Context, ModelContext } from '@forml/context';
import { render, renderHook } from '@testing-library/react';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

describe('useLocalizer', function () {
    describe('returns method', function () {
        let date;
        let localizer;

        beforeEach(function () {
            date = new Date(0);
            localizer = {
                getLocalizedString: sinon.fake(
                    (string) => 'localized ' + string
                ),
                getLocalizedDate: sinon.fake((date) => date.toLocaleString()),
                getLocalizedNumber: sinon.fake((number) =>
                    number.toLocaleString()
                ),
            };
        });
        function TestComponent(props) {
            localizer = useLocalizer();
            return (
                <div>
                    <div id="date">{localizer.getLocalizedDate(date)}</div>
                    <div id="string">
                        {localizer.getLocalizedString('test')}
                    </div>
                    <div id="number">{localizer.getLocalizedNumber(1000)}</div>
                </div>
            );
        }

        describe('from Context.Provider', function () {
            it('getLocalizedString', function () {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                );

                expect(container.querySelector('#string').textContent).to.equal(
                    'localized test'
                );
                expect(localizer.getLocalizedString).to.have.been.calledWith(
                    'test'
                );
            });
            it('getLocalizedDate', function () {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                );

                expect(container.querySelector('#date').textContent).to.equal(
                    date.toLocaleString()
                );
                expect(localizer.getLocalizedDate).to.have.been.calledWith(
                    date
                );
            });
            it('getLocalizedNumber', function () {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                );

                expect(container.querySelector('#number').textContent).to.equal(
                    '1,000'
                );
                expect(localizer.getLocalizedNumber).to.have.been.calledWith(
                    1000
                );
            });
        });
    });
});
describe('useDecorator', function () {
    describe('from Context.Provider', function () {
        function TestComponent() {
            const deco = useDecorator();
            return (
                <deco.Input.Group>
                    <deco.Input.Form />
                </deco.Input.Group>
            );
        }
        it('uses the input decorator', function () {
            const decorator = {
                Input: {
                    Group: sinon.fake((props) => (
                        <div id="group">{props.children}</div>
                    )),
                    Form: sinon.fake((props) => <input id="form" {...props} />),
                },
            };

            const { container } = render(
                <Context.Provider value={{ decorator }}>
                    <TestComponent />
                </Context.Provider>
            );

            expect(container.querySelector('#group')).not.to.be.null;
            expect(container.querySelector('#form')).not.to.be.null;
            expect(decorator.Input.Group).to.have.been.called;
            expect(decorator.Input.Form).to.have.been.called;
        });
    });
});
describe('useMapper', function () {
    describe('from Context.Provider', function () {
        function TestComponent(props) {
            const mapper = useMapper();
            return <mapper.Text />;
        }
        let mapper;
        beforeEach(function () {
            mapper = {
                Text: sinon.fake((props) => <input id="input" {...props} />),
            };
        });
        it('uses the input mapper', function () {
            const { container } = render(
                <Context.Provider value={{ mapper }}>
                    <TestComponent />
                </Context.Provider>
            );

            expect(container.querySelector('#input')).not.to.be.null;
            expect(mapper.Text).to.have.been.called;
        });
    });
});
describe('useModel', function () {
    describe('from Context.Provider', function () {
        let model;
        let schema;
        beforeEach(function () {
            schema = {
                type: 'string',
            };
            model = 'value';
        });
        function ModelProvider(props) {
            const model = useModelStore(props.schema, props.model);
            return (
                <ModelContext.Provider value={model}>
                    {props.children}
                </ModelContext.Provider>
            );
        }
        function TestComponent(props) {
            const model = useModel();
            return (
                <div>
                    <div id="getValue">{model.model}</div>
                </div>
            );
        }
        it('uses the supplied values', function () {
            const { container } = render(
                <ModelProvider schema={schema} model={model}>
                    <TestComponent />
                </ModelProvider>
            );

            expect(container.querySelector('#getValue').textContent).to.equal(
                'value'
            );
        });
    });
});
describe('useGenerator', function () {
    describe('when given anything but a function', function () {
        it('returns the value unmodified', function () {
            const schema = {};
            const { result } = renderHook(() => useGenerator(schema));
            expect(result.current).to.equal(schema);
        });
    });
    describe('when given a function', function () {
        it('invokes the function and returns the result', function () {
            const schema = {};
            const generator = sinon.spy(() => schema);
            const { result } = renderHook(() => useGenerator(generator));

            expect(result.current).to.equal(schema);
            expect(generator).to.have.been.calledOnce;
        });
    });
});

describe('useMerged', function () {
    let date;
    let localizer;
    let schema;
    let form;
    let options;
    let wrapper;

    beforeEach(function () {
        schema = {
            type: 'string',
        };
        form = [{ key: [] }];
        wrapper = function ({ children }) {
            return (
                <RenderingContext.Provider value={{}}>
                    <ModelContext.Provider value={{}}>
                        {children}
                    </ModelContext.Provider>
                </RenderingContext.Provider>
            );
        };
    });

    describe('given options', function () {
        let options;
        beforeEach(function () {
            options = { readonly: true };
        });
        it('returns the merged form', function () {
            const { result } = renderHook(() =>
                useMerged(schema, form, options)
            );
            const merged = result.current[0];
            expect(merged.type).to.equal('text');
            expect(merged.readonly).to.be.true;
            expect(merged.schema).to.equal(schema);
        });
    });
    describe('without options', function () {
        it('returns the merged form', function () {
            const { result } = renderHook(() => useMerged(schema, form));
            const merged = result.current[0];
            expect(merged.type).to.equal('text');
            expect(merged.readonly).to.be.undefined;
            expect(merged.schema).to.equal(schema);
        });
    });
});
