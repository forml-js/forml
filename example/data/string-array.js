export default {
    schema: {
        type: 'array',
        title: 'Simple String Array',
        items: {
            type: 'string',
        },
        default: ['*.dat', '*.g12li', '*.g12lo', '*.tmed'],
    },
    form: [{ key: [], movementButtons: false }],
};
