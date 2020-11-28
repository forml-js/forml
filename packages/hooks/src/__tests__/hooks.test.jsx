import React from 'react';
import { useLocalizer, useDecorator, useMapper, useModel } from '../';
import Context from '@forml/context';
import { render } from '@testing-library/react';

describe('useLocalizer', function() {
    describe('returns method', function() {
        let date;
        let localizer;

        beforeEach(function() {
            date = new Date(0);
            localizer = {
                getLocalizedString: jest.fn((string) => 'localized ' + string),
                getLocalizedDate: jest.fn((date) => date.toLocaleString()),
                getLocalizedNumber: jest.fn((number) => number.toLocaleString()),
            }
        })
        function TestComponent(props) {
            localizer = useLocalizer();
            return (
                <div>
                    <div id="date">{localizer.getLocalizedDate(date)}</div>
                    <div id="string">{localizer.getLocalizedString('test')}</div>
                    <div id="number">{localizer.getLocalizedNumber(1000)}</div>
                </div>
            );
        }

        describe('from Context.Provider', function() {
            test('getLocalizedString', function() {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                )

                expect(container.querySelector('#string').textContent).toBe('localized test');
                expect(localizer.getLocalizedString).toHaveBeenCalledWith('test');
            })
            test('getLocalizedDate', function() {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                )

                expect(container.querySelector('#date').textContent).toBe(date.toLocaleString());
                expect(localizer.getLocalizedDate).toHaveBeenCalledWith(date);
            })
            test('getLocalizedNumber', function() {
                const { container } = render(
                    <Context.Provider value={{ localizer }}>
                        <TestComponent />
                    </Context.Provider>
                )

                expect(container.querySelector('#number').textContent).toBe('1,000');
                expect(localizer.getLocalizedNumber).toHaveBeenCalledWith(1000);
            })
        })
    })
})

describe('useDecorator', function() {
    describe('from Context.Provider', function() {
        function TestComponent() {
            const deco = useDecorator();
            return <deco.Input.Group><deco.Input.Form /></deco.Input.Group>;
        }
        test('uses the input decorator', function() {
            const decorator = {
                Input: {
                    Group: jest.fn((props) => <div id="group">{props.children}</div>),
                    Form: jest.fn((props) => <input id="form" {...props} />),
                }
            }

            const { container } = render(
                <Context.Provider value={{ decorator }}>
                    <TestComponent />
                </Context.Provider>
            );

            expect(container.querySelector('#group')).not.toBeNull();
            expect(container.querySelector('#form')).not.toBeNull();
            expect(decorator.Input.Group).toHaveBeenCalled();
            expect(decorator.Input.Form).toHaveBeenCalled();
        })
    })
})

describe('useMapper', function() {
    describe('from Context.Provider', function() {
        function TestComponent(props) {
            const mapper = useMapper();
            return <mapper.Text />
        }
        let mapper;
        beforeEach(function() {
            mapper = {
                Text: jest.fn((props) => <input id="input" {...props} />)
            }
        });
        test('uses the input mapper', function() {
            const { container } = render(
                <Context.Provider value={{ mapper }}>
                    <TestComponent />
                </Context.Provider>
            );

            expect(container.querySelector('#input')).not.toBeNull();
            expect(mapper.Text).toHaveBeenCalled();
        })
    })
})

describe('useModel', function() {
    describe('from Context.Provider', function() {
        let model;
        beforeEach(function() {
            model = {
                getValue: jest.fn(() => 'value'),
                getError: jest.fn(() => 'error'),
                version: 101
            }
        })
        function TestComponent(props) {
            const model = useModel();
            return (
                <div>
                    <div id="getValue">{model.getValue([])}</div>
                    <div id="getError">{model.getError([])}</div>
                    <div id="version">{model.version}</div>
                </div>
            );
        }
        test('uses the supplied values', function() {
            const { container } = render(
                <Context.Provider value={{ ...model }}>
                    <TestComponent />
                </Context.Provider>
            )

            expect(container.querySelector('#getValue').textContent).toBe('value');
            expect(container.querySelector('#getError').textContent).toBe('error');
            expect(container.querySelector('#version').textContent).toBe('101');
            expect(model.getValue).toHaveBeenCalled();
            expect(model.getError).toHaveBeenCalled();
        })
    })
})
