## Members

<dl>
<dt><a href="#ArrayComponent">ArrayComponent</a></dt>
<dd><p>A wrapper for the array that utilizes the useArrayItems hook
to keep track of its children. Invokes the <a href="/docs/context">Context&#39;s</a></p>
<p>Usage:</p>
<pre><code class="language-jsx">const value = [&#39;a&#39;, &#39;b&#39;, &#39;c&#39;];
const form = {type: &#39;array&#39;, items: {type: &#39;string&#39;}};
const error = null;
&lt;ArrayComponent value={value} form={form} error={error} /&gt;</code></pre>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#mapperTypes">mapperTypes</a></dt>
<dd><p>We&#39;re strictly a keyed collection of elements, so generate our
PropTypes.shape from an array of keys</p>
</dd>
</dl>

<a name="ArrayComponent"></a>

## ArrayComponent
A wrapper for the array that utilizes the useArrayItems hook
to keep track of its children. Invokes the [Context's](/docs/context)

Usage:

```jsx
const value = ['a', 'b', 'c'];
const form = {type: 'array', items: {type: 'string'}};
const error = null;
<ArrayComponent value={value} form={form} error={error} />
```

**Kind**: global variable  
**Component**: ArrayComponent  
<a name="mapperTypes"></a>

## mapperTypes
We're strictly a keyed collection of elements, so generate our
PropTypes.shape from an array of keys

**Kind**: global constant  
