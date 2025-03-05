import ArrayComponent from '../items';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme();

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';
    let localizer;

    beforeEach(function () {
        form = { type: 'array', items: [{ key: [] }] };
        localizer = { getLocalizedString: jest.fn((id) => id) };
    });

    describe('with form options', function () {
        let fields = {
            disableGutters: [true, false],
            disablePadding: [true, false],
            icon: ['person', 'favorite'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    test(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <ThemeProvider theme={theme}>
                                <RenderingContext.Provider
                                    value={{ decorator, localizer }}
                                >
                                    <ArrayComponent
                                        form={form}
                                        title={title}
                                        description={description}
                                    />
                                </RenderingContext.Provider>
                            </ThemeProvider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });

    test('with title and description', function () {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RenderingContext.Provider value={{ decorator, localizer }}>
                    <ArrayComponent
                        form={form}
                        title={title}
                        description={description}
                    />
                </RenderingContext.Provider>
            </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with title and no description', function () {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RenderingContext.Provider value={{ decorator, localizer }}>
                    <ArrayComponent form={form} title={title} />
                </RenderingContext.Provider>
            </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with description and no title', function () {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RenderingContext.Provider value={{ decorator, localizer }}>
                    <ArrayComponent form={form} description={title} />
                </RenderingContext.Provider>
            </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with no title or description', function () {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RenderingContext.Provider value={{ decorator, localizer }}>
                    <ArrayComponent form={form} />
                </RenderingContext.Provider>
            </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
    });
});
