export function defaultLocalizer() {
    function noop(id) {
        return id;
    }

    return {
        getLocalizedString: noop,
        getLocalizedNumber: noop,
        getLocalizedDate: noop,
    };
}

export function getLocalizer(template) {
    return {...defaultLocalizer(), ...template};
}
