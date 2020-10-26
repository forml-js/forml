import { SchemaForm } from '../../src/components/schema-form';
import { createElement as h } from 'react';
import renderer from 'react-test-renderer';

describe('SchemaForm', function() {
    test('uses the supplied mapper', function() {
        const mapper = {
            text: jest.fn((props) => h('div'))
        };

        const component = renderer.create(h(SchemaForm, {
            schema: { type: 'string' },
            form: ['*'],
            mapper
        }));

        expect(mapper.text).toHaveBeenCalled();
    })

    test('uses the supplied localizer', function() {
        const localizer = {
            getLocalizedString: jest.fn((string) => {
                return string;
            }),
        };

        const component = renderer.create(h(SchemaForm, {
            schema: { type: 'string', title: 'test' },
            form: ['*'],
            localizer,
        }))

        expect(localizer.getLocalizedString).toHaveBeenCalledWith('test');
    })

    test('uses the supplied decorator', function() {
        const decorator = {
            Input: {
                Form: jest.fn((_props) => h('div')),
            }
        }

        renderer.create(h(SchemaForm, {
            schema: { type: 'string' },
            form: [{ key: [], type: 'text' }],
            decorator,
        }));

        expect(decorator.Input.Form).toHaveBeenCalled();
    })
});
