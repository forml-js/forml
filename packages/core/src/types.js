import t from 'prop-types';

export const FormType = t.oneOfType([
    t.string,
    t.shape({
        key: t.arrayOf(t.oneOfType([t.string, t.number])),
        type: t.string,
    }),
]);
export const FormsType = t.arrayOf(
    function (propValue, key, componentName, location, propFullName) {
        const item = propValue[key];
        const isString = typeof item === 'string';
        const isObject = typeof item === 'object' && item !== null;

        if (!isString && !isObject) {
            return new Error(
                `Invalid prop \`${propFullName}\` of type \`${typeof item}\` supplied to \`${componentName}\`, expected \`string\` or \`object\`.`
            );
        }
        
        // Return null for valid cases (string or object)
        return null;
    }
);
FormType.items = FormsType;
