import { wrapInTestContext } from 'react-dnd-test-utils';
import { DndProvider } from 'react-dnd';
import Context from '../../../src/context';
import { getDecorator } from '../../../src/components/decorator';
import { getMapper } from '../../../src/components/mapper';
import { getLocalizer } from '../../../src/localizer';
import * as util from '../../../src/util';
import { createElement as h } from 'react';
import renderer from 'react-test-renderer';

const mapperTypes = [
    'array',
    'checkbox',
    'date',
    'datetime',
    'fieldset',
    'help',
    'integer',
    'multiselect',
    'null',
    'number',
    'password',
    'select',
    'tabs',
    'text',
    'textarea',
    'tuple',
];

describe('defaultMapper', function() {
    const mapper = getMapper({});
    mapperTypes.forEach((type) => {
        test(`includes entry for ${type}`, function() {
            expect(mapper[type]).not.toBeUndefined();
        })
    })
})

describe('getMapper', function() {
    const text = jest.fn((props) => 'text');
    const custom = jest.fn((propx) => 'custom');
    const mapper = getMapper({
        text,
        custom,
    });

    mapperTypes.forEach((type) => {
        test(`includes entry for ${type}`, function() {
            expect(mapper[type]).not.toBeUndefined();
        })
    });

    test('accepts custom field types', function() {
        expect(mapper.custom).not.toBeUndefined();
    });

    test('can override built-in types', function() {
        expect(mapper.text).toBe(text);
    })
})


describe('rendering', function() {
    const mapper = getMapper({});
    const localizer = getLocalizer({});
    const decorator = getDecorator({});
    const context = { mapper, localizer, decorator }

    mapperTypes.forEach(rendersElement('label', ['tabs', 'array', 'tuple', 'help', 'fieldset', 'null']))

    function rendersElement(element, excluded = []) {
        return function callback(type) {
            if (excluded.includes(type)) return;

            test(`includes a ${element} for ${type} if supplied`, function() {
                const schema = { type: 'null' };
                const form = { type, schema, key: [], title: 'test', titleMap: [], items: [], tabs: [] };
                const getValue = jest.fn(util.valueGetter(null, schema));
                const setValue = jest.fn(util.valueSetter(null, schema));
                const mappedComponent = wrapInTestContext(mapper[type]);
                const component = renderer.create(
                    h(
                        Context.Provider,
                        { value: { ...context, getValue, setValue } },
                        h(mappedComponent, { schema, form })
                    )
                ).toJSON();

                expect(component).toMatchSnapshot();
                expect(component.children.find((child) => child.type === element)).not.toBeUndefined();
            });
        }
    }
});
