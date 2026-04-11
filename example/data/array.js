import * as comment from './comment.jsx';

export const mapper = comment.mapper;
export const schema = {
    type: 'object',
    title: 'Comments',
    description: 'Shouts into the void',
    required: ['comments'],
    properties: {
        comments: {
            type: 'array',
            title: 'Comments',
            maxItems: 2,
            items: comment.schema,
        },
    },
};
export const form = [
    {
        type: 'help',
        description:
            "Array Example. Try adding a couple of forms, reorder by drag'n'drop.",
        variant: 'h4',
        align: 'left',
        color: 'secondary',
    },
    {
        key: 'comments',
        add: 'New',
        disabled: true,
        movementButtons: false,
        items: [{ key: 'comments[]', type: 'comment' }],
    },
];
export const model = {
    comments: [{ name: 'test', comment: 'foo bar' }],
};
