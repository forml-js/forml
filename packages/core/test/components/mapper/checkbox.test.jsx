import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';

import { SchemaForm, getLocalizer, util } from '#core';
import { createElement as h } from 'react';

chai.use(sinonChai);
const { expect } = chai;

describe('checkbox mapper', function () {
    let schema, form, model, onChange, localizer;

    beforeEach(function () {
        schema = { type: 'boolean' };
        form = [{ type: 'checkbox', key: [] }];
        model = util.defaultForSchema(schema);
        onChange = sinon.fake((event, nextModel) => (model = nextModel));
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

        expect(container.querySelector('input[type="checkbox"]')).not.to.be
            .null;
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
