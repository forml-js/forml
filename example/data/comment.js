import debug from 'debug';
import ObjectPath from 'objectpath';
import { createElement as h, useCallback, useMemo } from 'react';
import { SchemaForm, useContext, useModel } from 'rjsf';

const log = debug('rjsf:example:data:comment');

export const schema = {
    type: 'object',
    title: 'Comment',
    description: 'Tell the internet your feelings',
    properties: {
        name: { title: 'Name', type: 'string', description: 'First and last name' },
        email: {
            title: 'Email',
            type: 'string',
            pattern: '^\\S+@\\S+$',
            description: 'Email will be used for evil.',
        },
        phoneNumber: {
            title: 'Phone Number',
            type: 'string',
            pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}',
            description: 'The best number at which to reach you'
        },
        spam: { title: 'Spam', type: 'boolean', default: true },
        tos: { title: 'Terms and Conditions', type: 'boolean', default: false },
        comment: {
            title: 'Comment',
            type: 'string',
            maxLength: 20,
            validationMessage: "Don't be greedy!",
        },
        type: {
            title: 'Type',
            type: 'string',
            enum: ['home', 'work', 'mobile', 'fax', 'etc'],
        },
        nested: {
            title: 'Nested',
            type: 'array',
            description: 'A nested array of people',
            items: {
                type: 'object',
                properties: {
                    first: { title: 'First', type: 'string' },
                    last: { title: 'Last', type: 'string' }
                },
            },
        },
    },
    required: ['name', 'comment'],
};

export const mapper = {
    comment(props) {
        const { form: parent, value } = props;
        const ctx = useContext();
        const { decorator, mapper, localizer } = ctx;

        return h(SchemaForm, {
            ...props,
            decorator,
            mapper,
            localizer,
            schema,
            form,
            model: value,
        });
    },
};

export function form(props, model) {
    return [
        {
            type: 'fieldset',
            disablePadding: true,
            disableGutters: true,
            items: [
                {
                    type: 'fieldset',
                    items: [
                        'name',
                        'email',
                        'email' in model && {
                            key: 'spam',
                            type: 'checkbox',
                            title: 'Yes I want spam.',
                        },
                    ],
                    layout: 'vertical'
                },
                {
                    type: 'fieldset',
                    layout: 'vertical',
                    items: [
                        'phoneNumber',
                        {
                            key: 'type',
                            type: 'select',
                            titleMap: [
                                { name: 'Home', value: 'home' },
                                { name: 'Work', value: 'work' },
                                { name: 'Mobile', value: 'mobile' },
                                { name: 'Fax', value: 'fax' },
                                { name: 'Etc', value: 'etc' },
                            ],
                        },
                    ]
                },
            ],
            layout: 'horizontal'
        },
        {
            type: 'fieldset',
            layout: 'vertical',
            disableGutters: false,
            items: [
                { key: 'comment', type: 'textarea' },
                {
                    type: 'array',
                    disablePadding: false,
                    disableGutters: true,
                    key: 'nested',
                    items: [
                        {
                            type: 'fieldset',
                            layout: 'vertical',
                            items: [
                                'nested[].first',
                                'nested[].last'
                            ]
                        }
                    ]
                },
            ]
        },
        {
            type: 'fieldset',
            alignItems: 'flex-end',
            items: [
                { key: 'tos' },
            ],
            layout: 'vertical',
        },
    ];
}
