const comment = require('./comment');

module.exports = {
    mapper: comment.mapper,
    schema: {
        type: 'object',
        title: 'Comment',
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
    },
    form: [
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
            items: [{ key: 'comments[]', type: 'comment' }],
        },
    ],
};
