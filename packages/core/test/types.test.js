import { describe, it } from 'mocha';
import * as chai from 'chai';
import PropTypes from 'prop-types';
import { FormType, FormsType } from '../src/types.js';

const { expect } = chai;

describe('FormType', function () {
    it('accepts string values', function () {
        const result = PropTypes.checkPropTypes(
            { test: FormType },
            { test: 'string-form' },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('accepts object with key and type properties', function () {
        const validForm = {
            key: ['nested', 'property'],
            type: 'text',
        };
        const result = PropTypes.checkPropTypes(
            { test: FormType },
            { test: validForm },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('accepts object with string key', function () {
        const validForm = {
            key: 'simple',
            type: 'text',
        };
        const result = PropTypes.checkPropTypes(
            { test: FormType },
            { test: validForm },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('accepts object with array of mixed string and number keys', function () {
        const validForm = {
            key: ['property', 0, 'nested'],
            type: 'array',
        };
        const result = PropTypes.checkPropTypes(
            { test: FormType },
            { test: validForm },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('has items property pointing to FormsType', function () {
        expect(FormType.items).to.equal(FormsType);
    });
});

describe('FormsType', function () {
    it('accepts array of string forms', function () {
        const validForms = ['form1', 'form2', 'form3'];
        const result = PropTypes.checkPropTypes(
            { test: FormsType },
            { test: validForms },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('accepts array of object forms', function () {
        const validForms = [
            { key: ['nested'], type: 'text' },
            { key: 'simple', type: 'number' },
        ];
        const result = PropTypes.checkPropTypes(
            { test: FormsType },
            { test: validForms },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('accepts mixed array of strings and objects', function () {
        const validForms = ['string-form', { key: ['nested'], type: 'text' }];
        const result = PropTypes.checkPropTypes(
            { test: FormsType },
            { test: validForms },
            'prop',
            'TestComponent'
        );
        expect(result).to.be.undefined;
    });

    it('rejects array with invalid types', function () {
        const invalidForms = ['valid', 42, 'another-valid'];
        // Capture console.error output to verify error message
        const originalError = console.error;
        let errorMessage = '';
        console.error = (message) => {
            errorMessage = message;
        };

        PropTypes.checkPropTypes(
            { test: FormsType },
            { test: invalidForms },
            'prop',
            'TestComponent'
        );

        console.error = originalError;
        expect(errorMessage).to.contain('Invalid prop');
        expect(errorMessage).to.contain('test');
        expect(errorMessage).to.contain('number');
        expect(errorMessage).to.contain('expected `string` or `object`');
    });

    it('rejects array with null values', function () {
        const invalidForms = ['valid', null];
        // Capture console.error output to verify error message
        const originalError = console.error;
        let errorMessage = '';
        console.error = (message) => {
            errorMessage = message;
        };

        PropTypes.checkPropTypes(
            { test: FormsType },
            { test: invalidForms },
            'prop',
            'TestComponent'
        );

        console.error = originalError;
        expect(errorMessage).to.contain('Invalid prop');
        expect(errorMessage).to.contain('test');
        expect(errorMessage).to.contain('object');
        expect(errorMessage).to.contain('expected `string` or `object`');
    });

    it('rejects array with boolean values', function () {
        const invalidForms = [true, 'valid'];
        // Capture console.error output to verify error message
        const originalError = console.error;
        let errorMessage = '';
        console.error = (message) => {
            errorMessage = message;
        };

        PropTypes.checkPropTypes(
            { test: FormsType },
            { test: invalidForms },
            'prop',
            'TestComponent'
        );

        console.error = originalError;
        expect(errorMessage).to.contain('Invalid prop');
        expect(errorMessage).to.contain('test');
        expect(errorMessage).to.contain('boolean');
        expect(errorMessage).to.contain('expected `string` or `object`');
    });

    it('rejects array with function values', function () {
        const invalidForms = [function () {}, 'valid'];
        // Capture console.error output to verify error message
        const originalError = console.error;
        let errorMessage = '';
        console.error = (message) => {
            errorMessage = message;
        };

        PropTypes.checkPropTypes(
            { test: FormsType },
            { test: invalidForms },
            'prop',
            'TestComponent'
        );

        console.error = originalError;
        expect(errorMessage).to.contain('Invalid prop');
        expect(errorMessage).to.contain('test');
        expect(errorMessage).to.contain('function');
        expect(errorMessage).to.contain('expected `string` or `object`');
    });

    it('provides correct component and prop names in error messages', function () {
        const invalidForms = [123];
        // Capture console.error output to verify error message
        const originalError = console.error;
        let errorMessage = '';
        console.error = (message) => {
            errorMessage = message;
        };

        PropTypes.checkPropTypes(
            { testProp: FormsType },
            { testProp: invalidForms },
            'prop',
            'MyComponent'
        );

        console.error = originalError;
        expect(errorMessage).to.contain('MyComponent');
        expect(errorMessage).to.contain('testProp');
    });
});

