import Container from '../container';
import Tab from '../tab';
import Panel from '../panel';
import React from 'react';
import { render } from '@testing-library/react';

describe('renders', function () {
    let form;
    let tabForm;
    let panelForm;
    beforeEach(function () {
        form = { type: 'tabs', tabs: [{ title: 'test' }] };
        tabForm = { title: 'tab title' };
        panelForm = tabForm;
    });
    test('its tabs and panels', function () {
        const { container } = render(
            <Container
                tabs={[<Tab form={tabForm} />]}
                panels={[
                    <Panel form={panelForm}>
                        <div id="panel_test">test</div>
                    </Panel>,
                ]}
            />
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('button')).not.toBeNull();
        expect(container.querySelector('button').textContent).toBe('tab title');
        expect(container.querySelector('#panel_test')).not.toBeNull();
    });
});
