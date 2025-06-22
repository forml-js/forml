import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { SchemaForm } from '#form';
import React from 'react';
import { render } from '@testing-library/react';

chai.use(sinonChai);
const { expect } = chai;

it('uses the supplied mapper', function () {
    const mapper = {
        text: sinon.fake((props) => <div />),
    };

    render(
        <SchemaForm schema={{ type: 'string' }} form={['*']} mapper={mapper} />
    );

    expect(mapper.text).to.have.been.called;
});

it('uses the supplied localizer', function () {
    const localizer = {
        getLocalizedString: sinon.fake((string) => {
            return string;
        }),
    };
    const decorator = {
        text: sinon.fake((props) => <div />),
    };

    render(
        <SchemaForm
            schema={{ type: 'string', title: 'test' }}
            form={['*']}
            localizer={localizer}
            decorator={decorator}
        />
    );

    expect(localizer.getLocalizedString).to.have.been.calledWith('test');
});

it('uses the supplied decorator', function () {
    const decorator = {
        text: sinon.fake((props) => <div />),
        options: {},
    };

    render(
        <SchemaForm
            schema={{ type: 'string' }}
            form={[
                { key: [], type: 'text', title: 'test', description: 'test' },
            ]}
            decorator={decorator}
        />
    );

    expect(decorator.text).to.have.been.called;
});
