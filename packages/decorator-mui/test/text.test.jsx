import Text from '../text';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';

    beforeEach(function () {
        form = { type: 'text' };
    });

    describe('with form options', function () {
        let fields = {
            variant: [undefined, 'h1', 'h2'],
            align: [undefined, 'left', 'right'],
            color: [undefined, 'primary', 'secondary'],
            noWrap: [undefined, true, false],
            paragraph: [undefined, true, false],
            otherProps: [undefined, {}],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    test(`${value}`, function () {
                        if (value !== undefined)
                            form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Text
                                    form={form}
                                    title={title}
                                    description={description}
                                />
                            </Context.Provider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
