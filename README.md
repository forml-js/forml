# rjsf
rjsf - react json schema form

Heavily inspired by the excellent `react-schema-form`, I felt compelled to write
my own version due to some irreconcilable differences in preferred approach.
This library borrows a lot of the internal concepts used in `react-schema-form`,
but takes a different approach in a few key respects, especially with respect to
reading and writing values to and from the model.

## Examples

Examples were taken from `react-schema-form`, and not all of them work
presently. Simply run:

```bash
cd examples
npm install
npm start
```

## Installation

```bash
npm i rjsf
```

## Customization
Custom mapped components can be provided. Look at `mapper/index.js` to see a
list of supported object types. New types may be added and used by explicitly
setting the form type.
