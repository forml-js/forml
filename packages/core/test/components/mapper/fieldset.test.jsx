import { SchemaForm, getLocalizer, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import * as chai from 'chai';
import domChai from 'chai-dom';
import { describe, it } from 'mocha';
import React from 'react';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

describe('fieldset', function () {
    let schema, form, model, onChange, localizer, decorator;

    beforeEach(function () {
        schema = { type: 'object', properties: { foo: { type: 'string' } } };
        form = [{ type: 'fieldset', items: ['foo'] }];
        model = util.defaultForSchema(schema);
        onChange = sinon.fake((event, nextModel) => (model = nextModel));
        decorator = barebones;
    });

    it('renders itself', function () {
        const { container } = render(
            <SchemaForm
                model={model}
                form={form}
                schema={schema}
                onChange={onChange}
                decorator={barebones}
            />
        );

        expect(container.querySelector('fieldset')).not.to.be.null;
        expect(container.querySelector('fieldset input')).not.to.be.null;
    });

    it('uses localizer for title and description', function () {
        const form = [
            {
                type: 'fieldset',
                items: [],
                title: 'title',
                description: 'description',
            },
        ];
        const localizer = getLocalizer({
            getLocalizedString: sinon.fake((id) => id),
        });
        const { container } = render(
            <SchemaForm
                model={model}
                form={form}
                schema={schema}
                onChange={onChange}
                localizer={localizer}
                decorator={barebones}
            />
        );

        expect(localizer.getLocalizedString).to.have.been.calledWith('title');
        expect(localizer.getLocalizedString).to.have.been.calledWith(
            'description'
        );
    });
});
