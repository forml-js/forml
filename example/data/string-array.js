export const schema = {
    type: 'array',
    title: 'Simple String Array',
    items: {
        type: 'string',
    },
    default: ['*.dat', '*.g12li', '*.g12lo', '*.tmed'],
};
export const form = [{ key: [], movementButtons: false }];
