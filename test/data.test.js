import * as fs from 'fs';
import * as path from 'path';
import * as renderer from 'react-test-renderer';
import { createElement as h } from 'react';
import { SchemaForm, decorators } from '../lib';
import * as util from '../lib/util';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function importAll(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    const result = {};

    for (let file of files) {
        if (file.isDirectory()) continue;
        const filepath = path.resolve(directory, file.name);

        if (file.name.endsWith('.json')) {
            result[file.name] = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8' }));
        } else if (file.name.endsWith('.js')) {
            result[file.name] = require(filepath);
        }

        if (result[file.name].default)
            result[file.name] = result[file.name].default;

        if (!result[file.name].schema)
            Reflect.deleteProperty(result, file.name);
    }

    return result;
}

describe('samples', function() {
    const samplesPath = path.resolve(__dirname, '../example/data');
    const samples = importAll(samplesPath);
    for (let file in samples) {
        const filename = path.basename(file, path.extname(file));
        describe(filename, function() {
            test('renders with a defaultForSchema model', async function() {
                let { schema, form } = await samples[file];
                let model = util.defaultForSchema(schema);

                const component = renderer.create(h(SchemaForm, {
                    schema,
                    form,
                    model,
                }));

                expect(component).toMatchSnapshot();
            });

            test('renders with the barebones decorator', async function() {
                let { schema, form } = await samples[file];
                let model = util.defaultForSchema(schema);

                const component = renderer.create(h(MuiPickersUtilsProvider, { utils: MomentUtils }, h(SchemaForm, {
                    schema,
                    form,
                    model,
                    decorator: decorators.barebones,
                })));

                expect(component).toMatchSnapshot();
            })

            test('renders with the MaterialUI decorator', async function() {
                let { schema, form } = await samples[file];
                let model = util.defaultForSchema(schema);

                const component = renderer.create(h(MuiPickersUtilsProvider, { utils: MomentUtils }, h(SchemaForm, {
                    schema,
                    form,
                    model,
                    decorator: decorators.mui,
                })));

                expect(component).toMatchSnapshot();
            })
        });
    }
});
