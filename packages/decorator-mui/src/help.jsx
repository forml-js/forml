import { Typography } from '@mui/material';
import { useLocalizer } from '@forml/hooks';
import React from 'react';

export default function Help(props) {
    const { form } = props;
    const localize = useLocalizer();

    const { variant, align, color } = form;
    const { noWrap, paragraph, otherProps } = form;

    const description =
        'description' in form ? localize(form.description) : null;
    const component = paragraph ? 'p' : 'span';

    return (
        <Typography
            variant={variant}
            align={align}
            color={color}
            noWrap={noWrap}
            component={component}
            {...otherProps}
        >
            {description}
        </Typography>
    );
}
