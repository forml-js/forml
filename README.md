# Table of Contents

1.  [forml](#org4dec357)
    1.  [Documentation](#documentation)
    2.  [Examples](#org3b18bac)
    3.  [Installation](#installation)
    4.  [Usage](#org09cd307)
    5.  [Customization](#org29eb409)
    6.  [Localization](#org673cf98)

<a id="org4dec357"></a>

# forml

[![Build Status](https://travis-ci.org/forml-js/forml.svg?branch=master)](https://travis-ci.org/forml-js/forml)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/forml/core)
[![Coverage Status](https://coveralls.io/repos/github/forml-js/forml/badge.svg?branch=master)](https://coveralls.io/github/forml-js/forml?branch=master)
![npm](https://img.shields.io/npm/v/forml/core)
![npm](https://img.shields.io/npm/l/forml/core)

forml - react json schema form

A lightweight, efficient form rendering library for use with your JSON schemas. Automatically generate and customize working forms for use in your application. Great for rapid prototyping and general usage.

<a id="documentation"></a>

## Documentation

View the documentation at [forml.io](https://www.forml.io)!

<a id="org3b18bac"></a>

## Examples

You can view the [running demo](https://forml-js.github.io/forml).

Alternatively, you can run them yourself.

    cd examples
    npm install
    npm start

<a id="installation"></a>

## Installation

```bash
# Substitute @forml/decorator-mui with your preferred decorator
npm i @forml/core @forml/decorator-mui
```

<a id="org09cd307"></a>

## Usage

Basic usage is as follows:

```jsx
import { SchemaForm } from '@forml/core;
import * as decorator from '@forml/decorator-mui';
import { useState } from 'react';

export function MyForm(props) {
    const [model, setModel] = useState('');
    const schema = { type: 'string', title: 'Sample Form' };
    const form = ['*'];

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

`forml` supports localization via injection. To inject a localizer:

```jsx
import { SchemaForm, decorators } from '@forml/core;
import * as decorator from '@forml/decorator-mui';
import { useTranslate } from 'react-i18next';
import { useState } from 'react';

export function MyTranslatedForm(props) {
    const [model, setModel] = useState({});
    const { t } = useTranslate();
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
