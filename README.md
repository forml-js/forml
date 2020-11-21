# Table of Contents

1.  [rjsf](#org4dec357)
    1.  [Documentation](#documentation)
    2.  [Examples](#org3b18bac)
    3.  [Installation](#installation)
    4.  [Usage](#org09cd307)
    5.  [Customization](#org29eb409)
    6.  [Localization](#org673cf98)

<a id="org4dec357"></a>

# rjsf

[![Build Status](https://travis-ci.org/fauxsoup/rjsf.svg?branch=master)](https://travis-ci.org/fauxsoup/rjsf)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/rjsf)
[![Coverage Status](https://coveralls.io/repos/github/fauxsoup/rjsf/badge.svg?branch=master)](https://coveralls.io/github/fauxsoup/rjsf?branch=master)
![npm](https://img.shields.io/npm/v/rjsf)
![npm](https://img.shields.io/npm/l/rjsf)

rjsf - react json schema form

A lightweight, efficient form rendering library for use with your JSON schemas. Automatically generate and customize working forms for use in your application. Great for rapid prototyping and general usage.

<a id="documentation"></a>

## Documentation

View the documentation at [rjsf.io](https://www.rjsf.io)!

<a id="org3b18bac"></a>

## Examples

You can view the [running demo](https://fauxsoup.github.io/rjsf).

Alternatively, you can run them yourself.

    cd examples
    npm install
    npm start

<a id="installation"></a>

## Installation

```bash
npm i rjsf
```

<a id="org09cd307"></a>

## Usage

Basic usage is as follows:

```jsx
import { SchemaForm, decorators } from 'rjsf';
import { useState } from 'react';

export function MyForm(props) {
    const [model, setModel] = useState('');
    const schema = { type: 'string', title: 'Sample Form' };
    const form = ['*'];
    const decorator = decorators.barebones;

    return (
        <SchemaForm
            model={model}
            schema={schema}
            decorator={decorator}
            form={form}
            onChange={onChange}
        />
    );

    function onChange(event, model) {
        setModel(model);
    }
}
```

The `example` directory&rsquo;s `index.js` uses `SchemaForm` both for the example selector and the example itself.

<a id="org29eb409"></a>

## Customization

Custom mapped components can be provided. Look at `mapper/index.js` to see a
list of supported object types. New types may be added and used by explicitly
setting the form type.

Appearance/final rendering is handled by the `decorator` components. Currently a `barebones` (pure HTML) and `MaterialUI` decorators are provided.

<a id="org673cf98"></a>

## Localization

`rjsf` supports localization via injection. To inject a localizer:

```jsx
import { SchemaForm, decorators } from 'rjsf';
import { useTranslate } from 'react-i18next';
import { useState } from 'react';

export function MyTranslatedForm(props) {
    const [model, setModel] = useState({});
    const { t } = useTranslate();
    const decorator = decorators.mui;
    const schema = {
        type: 'object',
        properties: {
            key: {
                type: 'string',
                title: 'Titles are passed through getLocalizedString',
                description: 'Descriptions too',
            },
        },
    };

    const localizer = { getLocalizedString: t };

    return (
        <SchemaForm
            model={model}
            schema={schema}
            localizer={localizer}
            decorator={decorator}
            onChange={onChange}
        />
    );

    function onChange(event, model) {
        setModel(model);
    }
}
```
