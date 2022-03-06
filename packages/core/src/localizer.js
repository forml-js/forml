/**
 * @typedef Localizer
 * @property {function():string} getLocalizedString - A string localizer
 * @property {function():string} getLocalizedDate - A date/time localizer
 * @property {function():string} getLocalizedNumber - A number localizer
 */

/**
 * The default localizer, which performs no operations.
 * @return {Localizer}
 */
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

/**
 * Construct a localizer, using noop for any missing methods
 * @return {Localizer}
 */
export function getLocalizer(template) {
    return { ...defaultLocalizer(), ...template };
}
