import * as forml from '../src/index.js';

describe('Core exports', function () {
    it.only('exports util module', function () {
        expect(forml.util.clone).to.be.a('function');
        expect(forml.util.traverseForm).to.be.a('function');
        expect(forml.util.getTypeOf).to.be.a('function');
        expect(forml.util.useMergedRef).to.be.a('function');
        expect(forml.util.compose).to.be.a('function');
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

