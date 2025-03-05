import { useValue } from '@forml/hooks';
export default {
    schema: {
        type: 'object',
        title: 'Basic Array Example',
        properties: {
            array: {
                type: 'array',
                title: 'Basic Array',
                items: [
                    {
                        type: 'number',
                        title: 'Index',
                    },
                    {
                        type: 'array',
                        title: 'Foo',
                        items: {
                            type: 'string',
                        },
                    },
                ],
            },
        },
    },
    form: [
        {
            type: 'fieldset',
            items: [
                {
                    key: [],
                    type: 'fieldset',
                    items: [
                        'array[0]',
                        {
                            type: 'dynamic',
                            key: [],
                            generate: function () {
                                const index = useValue(['array', 0]);
                                const value = useValue(['array', 1, index]);
                                return [
                                    {
                                        type: 'help',
                                        description: `Currently selected index: ${index}`,
                                    },
                                    {
                                        type: 'help',
                                        description: `Currently selected value: ${value}`,
                                    },
                                ];
                            },
                        },
                    ],
                },
                { key: 'array[1]', type: 'array', items: ['array[1][]'] },
            ],
        },
    ],
};
