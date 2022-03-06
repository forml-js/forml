const image = require('../src/assets/react-icon.svg').default;
const icon = 'person';

module.exports.schema = {
    type: 'object',
    title: 'Nested Tabs',
    properties: {
        foo: { type: 'string' },
        bar: { type: 'number' },
        baz: { type: 'boolean' },
    },
};

module.exports.form = [
    {
        type: 'tabs',
        layout: 'horizontal',
        collapse: true,
        title: 'Nested Tabs Demonstration',
        description: 'Create matrices of user input with nested tabs',
        tabs: [
            {
                type: 'tabs',
                layout: 'horizontal',
                title: 'First',
                collapse: true,
                icon,
                description: 'First collection of tabs',
                tabs: [
                    {
                        type: 'fieldset',
                        title: 'Standard',
                        description: 'The original layout of the items',
                        image,
                        items: ['foo', 'bar', 'baz'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Inverted',
                        image,
                        description: 'An inverted layout of the items',
                        items: ['baz', 'foo', 'bar'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Inverted Reversed',
                        image,
                        description: 'A reversed inverted version of the items',
                        items: ['bar', 'foo', 'baz'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Reversed',
                        icon,
                        description: 'A reversed version of the items',
                        items: ['baz', 'bar', 'foo'],
                    },
                ],
            },
            {
                type: 'tabs',
                title: 'Second',
                description: 'An alternative collection of tabs',
                image,
                layout: 'horizontal',
                collapse: true,
                tabs: [
                    {
                        type: 'fieldset',
                        title: 'Inverted Reversed',
                        image,
                        description: 'A reversed inverted version of the items',
                        items: ['bar', 'foo', 'baz'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Reversed',
                        icon,
                        description: 'A reversed version of the items',
                        items: ['baz', 'bar', 'foo'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Standard',
                        icon,
                        description: 'The original layout of the items',
                        items: ['foo', 'bar', 'baz'],
                    },
                    {
                        type: 'fieldset',
                        title: 'Inverted',
                        image,
                        description: 'An inverted layout of the items',
                        items: ['baz', 'foo', 'bar'],
                    },
                ],
            },
        ],
    },
];
