import Typography from '@material-ui/core/Typography';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

/**
 * @component Help
 */
export default function Help(props) {
    const {form}       = props;
    const {otherProps, description} = form;

    const localize = useLocalizer();
    const deco     = useDecorator();

    return h(deco.Text, {form}, localize.getLocalizedString(description));
}

