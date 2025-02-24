import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { SchemaForm, getLocalizer, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import React, { createElement as h } from 'react';

chai.use(sinonChai);
const { expect } = chai;

describe('date', function () {
    let schema, form, model, onChange, localizer, decorator;

    beforeEach(function () {
        schema = { type: 'string', format: 'date' };
        form = [{ key: [], type: 'date' }];
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

        expect(container.querySelector('input')).not.to.be.null;
    });

    it('uses localizer for title and description', function () {
        const form = [
            {
                type: 'checkbox',
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
