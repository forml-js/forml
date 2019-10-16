import t from 'prop-types';

export const FormType  = t.shape({
    key: t.arrayOf(t.string),
    type: t.string,
});
export const FormsType = t.arrayOf(t.oneOfType([
    t.string,
    FormType,
]));
FormType.items         = FormsType;
