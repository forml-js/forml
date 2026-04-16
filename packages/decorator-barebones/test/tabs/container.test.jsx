import Container from '../../src/tabs/container.jsx';
import Tab from '../../src/tabs/tab.jsx';
import Panel from '../../src/tabs/panel.jsx';
import React from 'react';
import { render } from '@testing-library/react';

describe('Container', function () {
    let form;
    let tabForm;
    let panelForm;
    beforeEach(function () {
        form = { type: 'tabs', tabs: [{ title: 'test' }] };
        tabForm = { title: 'tab title' };
        panelForm = tabForm;
    });
    it('renders its tabs and panels', function () {
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
