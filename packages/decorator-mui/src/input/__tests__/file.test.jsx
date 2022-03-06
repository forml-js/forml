import FileComponent from '../file';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    let form;

    beforeEach(function () {
        form = { type: 'file' };
    });

    describe('with form options', function () {
        let fields = {
            format: ['data_url', 'name'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    test(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <FileComponent form={form} />
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });

    test('consistently', function () {
        const { container } = render(<FileComponent form={form} />);

        expect(container).toMatchSnapshot();
    });
});
