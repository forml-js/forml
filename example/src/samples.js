import debug from "debug";
const log = debug("forml:example:samples");
function importAll(context) {
  const keys = context.keys();
  const result = {};

  for (let key of keys) {
    result[key] = context(key);

    if (result[key].default) result[key] = result[key].default;

    if (!result[key].schema) Reflect.deleteProperty(result, key);
  }

  return result;
}

export const samples = importAll(
  require.context("../data/", true, /\.js(on)?$/)
);

const defaultSample = { schema: { type: "null" }, form: ["*"] };
export function getSample(name) {
  const sample = samples[name] ?? defaultSample;
  log("getSample() -> %o", sample);
  return sample;
}
