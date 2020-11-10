## Constants

<dl>
<dt><a href="#ajv">ajv</a></dt>
<dd><p>A hook that uses a memoized Ajv instance and a compiled version of the schema
to produce a validate function.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#defaultForSchema">defaultForSchema(schema)</a> ⇒ <code>*</code></dt>
<dd><p>Returns a default value for schema. If the schema defines a default value,
that will be returned. If no default is specified, an &quot;empty&quot; value of the
specified type will be returned.</p>
</dd>
<dt><a href="#getPreferredType">getPreferredType(types)</a></dt>
<dd><p>Return the first type from a type list</p>
</dd>
<dt><a href="#valueGetter">valueGetter(model, schema)</a> ⇒ <code><a href="#ValueGetter">ValueGetter</a></code></dt>
<dd></dd>
<dt><a href="#errorGetter">errorGetter(errors)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#updateAndClone">updateAndClone(keys, model, schema, value, depth)</a> ⇒ <code>*</code></dt>
<dd><p>Walk a key path along a schema tree and model, updating the model according
to the schema along the way, until reaching the final key, whereupon we set
the supplied value. Returns the updated model or value set.</p>
</dd>
<dt><a href="#valueSetter">valueSetter(model, schema, setModel)</a></dt>
<dd><p>Set a value using a hook setter</p>
</dd>
<dt><a href="#findSchema">findSchema(keys, schema)</a> ⇒ <code>object</code></dt>
<dd><p>Walk the schema along the path of keys and return the last entry visited</p>
</dd>
<dt><a href="#getNextSchema">getNextSchema(schema, key)</a></dt>
<dd><p>Return the child schema defined by key in this schema</p>
</dd>
<dt><a href="#getNextValue">getNextValue(schema, value, key)</a></dt>
<dd><p>Return the child model defined by key in this model, or if it is undefined
the default value for the schema.</p>
</dd>
<dt><a href="#traverseForm">traverseForm(forms, visitor)</a></dt>
<dd><p>Invoke a function for every form in forms</p>
</dd>
<dt><a href="#clone">clone(*)</a></dt>
<dd><p>A copy of clone that works on ES6 modules. Does not actually clone
primitives.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ValueGetter">ValueGetter</a> ⇒ <code>*</code></dt>
<dd><p>Searches the enclosed model along the path of keys</p>
</dd>
<dt><a href="#ValueSetter">ValueSetter</a> ⇒ <code>*</code></dt>
<dd><p>Updates the enclosed model with value along the path of keys</p>
</dd>
</dl>

<a name="ajv"></a>

## ajv
A hook that uses a memoized Ajv instance and a compiled version of the schema
to produce a validate function.

**Kind**: global constant  

| Param | Description |
| --- | --- |
| object | schema - The schema to compile for validation |

<a name="defaultForSchema"></a>

## defaultForSchema(schema) ⇒ <code>\*</code>
Returns a default value for schema. If the schema defines a default value,
that will be returned. If no default is specified, an "empty" value of the
specified type will be returned.

**Kind**: global function  

| Param | Type |
| --- | --- |
| schema | <code>object</code> | 

<a name="getPreferredType"></a>

## getPreferredType(types)
Return the first type from a type list

**Kind**: global function  

| Param | Type |
| --- | --- |
| types | <code>Array.&lt;string&gt;</code> | 

<a name="valueGetter"></a>

## valueGetter(model, schema) ⇒ [<code>ValueGetter</code>](#ValueGetter)
**Kind**: global function  

| Param | Type |
| --- | --- |
| model | <code>\*</code> | 
| schema | <code>object</code> | 

<a name="errorGetter"></a>

## errorGetter(errors) ⇒ <code>function</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>object</code> | Map of object path to error |

<a name="updateAndClone"></a>

## updateAndClone(keys, model, schema, value, depth) ⇒ <code>\*</code>
Walk a key path along a schema tree and model, updating the model according
to the schema along the way, until reaching the final key, whereupon we set
the supplied value. Returns the updated model or value set.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| keys | <code>Array.&lt;(string\|number)&gt;</code> |  | The object path to walk |
| model | <code>\*</code> |  | The model to update |
| schema | <code>object</code> |  | The schema definition for the model |
| value | <code>\*</code> |  | The final value to write |
| depth | <code>number</code> | <code>0</code> | The current depth of recursion |

<a name="valueSetter"></a>

## valueSetter(model, schema, setModel)
Set a value using a hook setter

**Kind**: global function  

| Param | Type |
| --- | --- |
| model | <code>\*</code> | 
| schema | <code>object</code> | 
| setModel | <code>function</code> | 

<a name="findSchema"></a>

## findSchema(keys, schema) ⇒ <code>object</code>
Walk the schema along the path of keys and return the last entry visited

**Kind**: global function  

| Param | Type |
| --- | --- |
| keys | <code>Array.&lt;(string\|number)&gt;</code> | 
| schema | <code>object</code> | 

<a name="getNextSchema"></a>

## getNextSchema(schema, key)
Return the child schema defined by key in this schema

**Kind**: global function  

| Param | Type |
| --- | --- |
| schema | <code>object</code> | 
| key | <code>string</code> \| <code>number</code> | 

<a name="getNextValue"></a>

## getNextValue(schema, value, key)
Return the child model defined by key in this model, or if it is undefined
the default value for the schema.

**Kind**: global function  

| Param | Type |
| --- | --- |
| schema | <code>object</code> | 
| value | <code>\*</code> | 
| key | <code>string</code> \| <code>number</code> | 

<a name="traverseForm"></a>

## traverseForm(forms, visitor)
Invoke a function for every form in forms

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| forms | <code>Array.&lt;object&gt;</code> | The forms tree to visit |
| visitor | <code>function</code> | The visitor function to invoke |

<a name="clone"></a>

## clone(*)
A copy of clone that works on ES6 modules. Does not actually clone
primitives.

**Kind**: global function  

| Param | Description |
| --- | --- |
| * | value - The value to clone |

<a name="ValueGetter"></a>

## ValueGetter ⇒ <code>\*</code>
Searches the enclosed model along the path of keys

**Kind**: global typedef  
**Returns**: <code>\*</code> - - The value found at keys  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Array.&lt;(string\|number)&gt;</code> | Object path to get |

<a name="ValueSetter"></a>

## ValueSetter ⇒ <code>\*</code>
Updates the enclosed model with value along the path of keys

**Kind**: global typedef  
**Returns**: <code>\*</code> - - The new model  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Array.&lt;(string\|number)&gt;</code> | Object path to set |
| value | <code>\*</code> | Value to set at keys |

