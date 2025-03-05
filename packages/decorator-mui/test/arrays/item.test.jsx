import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import domChai from 'chai-dom';
import Item from '../item';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../../';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

const theme = createTheme({});

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';

    beforeEach(function () {
        form = { type: 'text' };
    });

    test('consistently', function () {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Context.Provider>
                    <Item form={form} otherProps={{}} />
                </Context.Provider>
            </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
    });
});
