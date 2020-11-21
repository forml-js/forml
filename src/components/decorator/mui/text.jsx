import Typography from '@material-ui/core/Typography';
import React from 'react';

/**
 * @component
 */
export default function Text(props) {
    const { form } = props;
    const { variant, align, color } = form;
    const { noWrap, paragraph } = form;

    return (
        <Typography
            variant={variant}
            align={align}
            color={color}
            noWrap={noWrap}
            paragraph={paragraph}
            {...form.otherProps}
        >
            {props.children}
        </Typography>
    );
}
