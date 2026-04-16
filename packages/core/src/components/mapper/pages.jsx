import React, { useCallback, useMemo, useState } from 'react';

import { SchemaField } from '#components/schema-field.jsx';
import { useDecorator } from '@forml/hooks';

export function Page(props) {
    const { index, parent, form, onChange, activePage, setPage } = props;
    const Pages = useDecorator('pages');
    const { schema } = form;
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
    const setPage = useCallback(
        (number) => {
            if (number < 0) {
                setPageNumber(0);
            } else if (number >= form.pages.length) {
                if (form.completed) {
                    setPageNumber(form.pages.length);
                } else {
                    setPageNumber(form.pages.length - 1);
                }
            } else {
                setPageNumber(number);
            }
        },
        [setPageNumber, form]
    );
    const Pages = useDecorator('pages');
    const children = useMemo(() => {
        const pages = form.pages.map((step, index) => (
            <Page
                key={index}
                index={index}
                parent={form}
                form={step}
                onChange={onChange}
                activePage={pageNumber}
                setPage={setPage}
            />
        ));

        if (form.completed) {
            pages.push(
                <Page
                    key="completed"
                    index={pages.length}
                    parent={form}
                    form={form.completed}
                    onChange={onChange}
                    activePage={pageNumber}
                    setPage={setPage}
                />
            );
        }
        return pages;
    }, [pageNumber, form, setPage, onChange]);
    return (
        <Pages
            className={form.htmlClass}
            form={form}
            active={pageNumber}
            setPage={setPage}
            onChange={onChange}
        >
            {children}
        </Pages>
    );
}
