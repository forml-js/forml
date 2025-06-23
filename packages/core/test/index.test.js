import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as forml from '../src/index.js';

const { expect } = chai;

describe('Core exports', function () {
    it('exports util module', function () {
        expect(forml.util).to.be.an('object');
        expect(forml.util.clone).to.be.a('function');
        expect(forml.util.traverseForm).to.be.a('function');
        expect(forml.util.getTypeOf).to.be.a('function');
    });

    it('exports main components', function () {
        expect(forml.SchemaForm).to.be.a('function');
        expect(forml.SchemaField).to.be.a('function');
    });

    it('exports localizer functions', function () {
        expect(forml.defaultLocalizer).to.be.a('function');
        expect(forml.getLocalizer).to.be.a('function');
    });
});