import { SchemaForm } from '../../src';
import React from 'react';
import renderer from 'react-test-renderer';

test('uses the supplied mapper', function() {
    const mapper = {
        text: jest.fn((props) => <div {...props} />),
    };

    const component = renderer.create(
        <SchemaForm
            schema={{ type: 'string' }}
            form={['*']}
            mapper={mapper}
        />
    );

    expect(mapper.text).toHaveBeenCalled();
});

test('uses the supplied localizer', function() {
    const localizer = {
        getLocalizedString: jest.fn((string) => {
            return string;
        }),
    };

    const component = renderer.create(
        <SchemaForm
            schema={{ type: 'string', title: 'test' }}
            form={['*']}
            localizer={localizer}
        />
    );

    expect(localizer.getLocalizedString).toHaveBeenCalledWith('test');
});

test('uses the supplied decorator', function() {
    const decorator = {
        Input: {
            Group: jest.fn((props) => <div {...props} />),
            Form: jest.fn((props) => <div {...props} />),
            Description: jest.fn((props) => <div {...props} />),
        },
        Label: jest.fn((props) => <div {...props} />),
    };

    renderer.create(
        <SchemaForm
            schema={{ type: 'string' }}
            form={[{ key: [], type: 'text', title: 'test', description: 'test' }]}
            decorator={decorator}
        />
    );

    expect(decorator.Label).toHaveBeenCalled();
    expect(decorator.Input.Group).toHaveBeenCalled();
    expect(decorator.Input.Description).toHaveBeenCalled();
    expect(decorator.Input.Form).toHaveBeenCalled();
});
