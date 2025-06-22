import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import domChai from 'chai-dom';
import { SchemaForm, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { fireEvent, render } from '@testing-library/react';
import { createElement as h } from 'react';
import * as jsf from 'json-schema-faker';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

describe('integer', function () {
    let schema, form, model, onChange, decorator;

    beforeEach(function () {
        schema = { type: 'integer' };
        form = [{ key: [], type: 'integer' }];
        model = jsf.generate(schema);
        onChange = sinon.fake((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    it('tolerates empty strings onChange', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal(0);
    });

    it('tolerates minus character onChange', function () {
        const { container } = render(
            h(SchemaForm, {
                schema,
                form,
                model,
                onChange,
                decorator,
            })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: '-' },
        });

        expect(onChange).to.have.been.called;
        expect(model).to.equal('-');
    });

    it('does not tolerate non-numeric strings', function () {
        const { container } = render(
            h(SchemaForm, { schema, form, model, onChange, decorator })
        );

        fireEvent.change(container.querySelector('input'), {
            target: { value: 'a' },
        });

        expect(onChange).not.to.have.been.called;
    });
});
