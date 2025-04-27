import Array from './arrays/index.jsx';
import Checkbox from './checkbox.jsx';
import Date from './date.jsx';
import DateTime from './datetime.jsx';
import FieldSet from './fieldset.jsx';
import File from './file.jsx';
import Help from './help.jsx';
import Multiselect from './multiselect.jsx';
import Select from './select.jsx';
import Tabs from './tabs/index.jsx';
import Text from './text.jsx';

export const array = Array;
export const checkbox = Checkbox;
export const date = Date;
export const datetime = DateTime;
export const fieldset = FieldSet;
export const file = File;
export const help = Help;
export const multiselect = Multiselect;
export const select = Select;
export const tabs = Tabs;
export const text = Text;
export const options = {};

const decorator = {
    array,
    checkbox,
    date,
    datetime,
    fieldset,
    file,
    help,
    multiselect,
    select,
    tabs,
    text,
    options: {},
};

export default decorator;

export function withOptions(options) {
    return { ...decorator, options };
}
