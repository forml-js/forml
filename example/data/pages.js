import * as forml from '@forml/core';
import * as comment from './comment';
import { schema } from './kitchenSink.js';
export { schema };
export const form = [
    {
        type: 'pages',
        title: 'Settings',
        collapse: true,
        description: 'A multi-page example for your consideration',
        layout: 'horizontal',
        pages: [
            {
                type: 'fieldset',
                title: 'Simple Keys',
                description: 'Forms rendered without customization',
                items: [
                    'textWithDefault',
                    'textNoDefault',
                    'textWithRegex',
                    'staticDropdown',
                    { key: 'file', type: 'file' },
                ],
            },
            {
                type: 'fieldset',
                title: 'Full Forms',
                description: 'Highly customized forms',
                items: [
                    {
                        key: 'textArea',
                        type: 'textarea',
                        placeholder: 'Make a comment',
                    },
                    {
                        key: 'helpMessage',
                        type: 'help',
                    },
                    {
                        key: 'checkbox',
                        type: 'checkbox',
                    },
                    {
                        key: 'date',
                        type: 'date',
                    },
                    forml.compose(comment.form, ['comment']),
                ],
            },
            {
                type: 'fieldset',
                title: 'Combo Forms',
                description: 'Highly customized standard forms',
                items: [
                    {
                        key: 'textArea',
                        type: 'textarea',
                        placeholder: 'Make a comment',
                    },
                    {
                        key: 'helpMessage',
                        variant: 'body2',
                        type: 'help',
                    },
                    'checkbox',
                    'date',
                    {
                        type: 'dynamic',
                        key: ['comment'],
                        generate: comment.form,
                    },
                ],
            },
            {
                type: 'fieldset',
                title: 'Singular Field',
                description:
                    'A single field to ensure heights are calculated correctly',
                items: ['checkbox'],
            },
        ],
    },
];
