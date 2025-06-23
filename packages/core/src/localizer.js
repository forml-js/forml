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

    return autoTemplate(noop);
}

function autoTemplate(template) {
    if (typeof template === 'function') {
        if (!('getLocalizedString' in template)) {
            Object.assign(
                template,
                {
                    getLocalizedString: template,
                    getLocalizedDate: template,
                    getLocalizedNumber: template,
                },
                template
            );
        }
        
        // Create a routing function that uses the specialized methods
        function route(value) {
            if (value instanceof Date) {
                return template.getLocalizedDate(value);
            } else if (typeof value === 'number') {
                return template.getLocalizedNumber(value);
            } else {
                return template.getLocalizedString(value);
            }
        }
        
        // Copy all the specialized methods to the route function
        route.getLocalizedString = template.getLocalizedString;
        route.getLocalizedDate = template.getLocalizedDate;
        route.getLocalizedNumber = template.getLocalizedNumber;
        
        return route;
    } else {
        Object.assign(
            route,
            {
                getLocalizedString: noop,
                getLocalizedDate: noop,
                getLocalizedNumber: noop,
            },
            template
        );
        return route;
    }

    function noop(id) {
        return id;
    }
    function route(value) {
        if (value instanceof Date) {
            return route.getLocalizedDate(value);
        } else if (typeof value === 'number') {
            return route.getLocalizedNumber(value);
        } else {
            return route.getLocalizedString(value);
        }
    }
}

/**
 * Construct a localizer, using noop for any missing methods
 * @return {Localizer}
 */
export function getLocalizer(template) {
    return autoTemplate(template);
}
