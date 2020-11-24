import merge from 'deepmerge';
import PropTypes from 'prop-types';

import {clone} from './util';

export function defaultDecorator() {
  return {
    Arrays: {
      Item: noop,
      Items: noop,
    },
    Tabs: {
      Container: noop,
      Tab: noop,
      Panel: noop,
    },
    Input: {
      Description: noop,
      Form: noop,
      Group: noop,
      Option: noop,
      Select: noop,
    },
    Checkbox: noop,
    FieldSet: noop,
    Group: noop,
    Label: noop,
    Text: noop,
  };

  function noop() {
    return null;
  }
}

export function getDecorator(template) {
  const decorator = merge(defaultDecorator(), template);
  return decorator;
}

/**
 * Type definition for decorators
 */
export const decoratorShape = PropTypes.shape({
  /** Array decorations */
  Arrays: PropTypes.shape({
    /** Individual item */
    Item: PropTypes.elementType,
    /** Collection of items */
    Items: PropTypes.elementType,
  }),
  /** Tab decorations */
  Tabs: PropTypes.shape({
    /** Outer wrapper */
    Container: PropTypes.elementType,
    /** Tab selector */
    Tab: PropTypes.elementType,
    /** Tab body panel */
    Panel: PropTypes.elementType,
  }),
  /** Input decorations */
  Input: PropTypes.shape({
    /** Description and error wrapper */
    Description: PropTypes.elementType,
    /** Base input element */
    Form: PropTypes.elementType,
    /** Form and label wrapper */
    Group: PropTypes.elementType,
    /** Select menu option wrapper */
    Option: PropTypes.elementType,
    /** Select menu */
    Select: PropTypes.elementType,
  }),
  /** Specialized checkbox decorator */
  Checkbox: PropTypes.elementType,
  /** Input collection decorator */
  FieldSet: PropTypes.elementType,
  /** General collection decorator */
  Group: PropTypes.elementType,
  /** Input label decorator */
  Label: PropTypes.elementType,
  /** Basic text decorator */
  Text: PropTypes.elementType,
});
