import Typography from '@material-ui/core/Typography';
import {createElement as h} from 'react';

export function Help(props) {
    const {form}                                                              = props;
    const {description, variant, align, color, noWrap, paragraph, otherProps} = form;

    return h(Typography, {variant, align, color, noWrap, paragraph, ...otherProps}, description);
}

