import { useCallback, useMemo, useState } from 'react';

import { SchemaField } from '#components/schema-field.jsx';
import { useDecorator } from '@forml/hooks';

export function Page(props) {
    const { index, parent, form, onChange, activePage, setPage } = props;
    const Pages = useDecorator('pages');
    const { schema } = form;
    console.log('Page(form: %o)', form);
    return (
        <Pages.Page
            title={form.title}
            description={form.description}
            form={form}
            parent={parent}
            index={index}
            setPage={setPage}
            activePage={activePage}
        >
            <SchemaField form={form} schema={schema} onChange={onChange} />
        </Pages.Page>
    );
}
export default function Pages(props) {
    const { form, onChange } = props;
    const [pageNumber, setPageNumber] = useState(0);
    const Pages = useDecorator('pages');
    const children = useMemo(
        () =>
            form.pages.map((form, index) => (
                <Page
                    index={index}
                    parent={form}
                    form={form}
                    onChange={onChange}
                    activePage={pageNumber}
                    setPage={setPageNumber}
                />
            )),
        [pageNumber, form, setPageNumber, onChange]
    );
    return (
        <Pages
            className={form.htmlClass}
            form={form}
            active={pageNumber}
            setPage={setPageNumber}
            onChange={onChange}
        >
            {children}
        </Pages>
    );
}
