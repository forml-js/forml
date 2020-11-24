import Context from '@forml/context';
import { useMapper } from '@forml/hooks';
import { SchemaField } from '../../src/components/schema-field';
import { createElement as h } from 'react';
import { defaultMapper, getMapper } from '../../src/components/mapper';
import { getLocalizer } from '../../src/localizer';
import * as util from '../../src/util';
import renderer from 'react-test-renderer';
import * as barebones from '@forml/decorator-barebones';

function getContext(schema, model = '', errors = {}) {
    const decorator = barebones;
    const localizer = getLocalizer({});
    const getValue = jest.fn(util.valueGetter(model, schema));
    const setValue = jest.fn(util.valueSetter(model, schema));
    const getError = jest.fn(util.errorGetter(errors, schema));
    const mapper = getMapper({
        array: jest.fn(() => 'array'),
        checkbox: jest.fn(() => 'checkbox'),
        date: jest.fn(() => 'date'),
        datetime: jest.fn(() => 'datetime'),
        dynamic: jest.fn(() => 'dynamic'),
        fieldset: jest.fn(() => 'fieldset'),
        help: jest.fn(() => 'help'),
        integer: jest.fn(() => 'integer'),
        multiselect: jest.fn(() => 'multiselect'),
        null: jest.fn(() => 'null'),
        number: jest.fn(() => 'number'),
        password: jest.fn(() => 'password'),
        select: jest.fn(() => 'select'),
        tabs: jest.fn(() => 'tabs'),
        text: jest.fn(() => 'text'),
        textarea: jest.fn(() => 'textarea'),
        tuple: jest.fn(() => 'tuple'),
        file: jest.fn(() => 'file'),
    });
    return { mapper, decorator, localizer, getValue, setValue, getError };
}

test('does not render if no mapped Field is found for type', function () {
    const schema = { type: 'object' };
    const form = { key: [], type: 'custom', schema };
    const context = getContext(schema, {});

    const component = renderer.create(
        h(
            Context.Provider,
            { value: context },
            h(SchemaField, { form, schema })
        )
    );
    expect(component).toMatchSnapshot();
});

test('uses mapper from context', function () {
    const schema = { type: 'string' };
    const form = { key: [], type: 'text', schema };
    const context = getContext(schema);

    const component = renderer.create(
        h(
            Context.Provider,
            {
                value: context,
            },
            h(SchemaField, {
                form,
                schema,
            })
        )
    );

    expect(context.mapper.text).toHaveBeenCalled();
});
