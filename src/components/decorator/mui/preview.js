import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {createElement as h} from 'react';

export default function Preview(props) {
    const {form, value, index, title} = props;

    return h(Card, {}, h(CardContent, {}, [
                 h(Typography, {}, `[${index}] ${title}`),
                 h('pre', {}, JSON.stringify(value)),
             ]));
}
