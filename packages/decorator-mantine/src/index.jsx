import Array from './array/index.jsx';
import Checkbox from './checkbox.jsx';
import Date from './date.jsx';
import DateTime from './datetime.jsx';
import Fieldset from './fieldset.jsx';
import File from './file.jsx';
import Help from './help.jsx';
import Notice from './notice.jsx';
import Select from './select.jsx';
import Tabs from './tabs/index.jsx';
import Text from './text.jsx';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

const decorator = {
    array: Array,
    checkbox: Checkbox,
    date: Date,
    datetime: DateTime,
    fieldset: Fieldset,
    file: File,
    help: Help,
    notice: Notice,
    options: {},
    withOptions,
    select: Select,
    tabs: Tabs,
    text: Text,
};

export default decorator;

export function withOptions(options) {
    return { ...decorator, options };
}
