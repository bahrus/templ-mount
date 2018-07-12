# \<templ-mount\>

templ-mount is a ~1.0 KB (gzipped / minified) dependency free custom element. 

It allows templates to be loaded from url&#39;s

```html
<templ-mount></templ-mount>
```

does the following:

1)  It searches for template elements outside any Shadow DOM, with attribute data-src, which can specify the url.  Or you can just add attribute data-src, and specify the actual url using  the href attribute, if you are willing to assume href won't become a standard attribute in the future).  It preemptively downloads those template references.
2)  It searches for template elements inside its parent element with attribute data-src, and downloads those as well.
3)  It monitors the document.head element for additional template elements with attribute data-src and loads them as they get added.
4)  Once the template is downloaded and inserted into the template, the "loaded" attribute is set.


## Copying the contents of the preloaded template into the header.

If the template contains some content, e.g.:

```html
<template id="bb_chart_template" data-src="billboardChart.html" data-ua="Chrome">
    <script async src="https://unpkg.com/xtal-json-editor@0.0.19/xtal-json-editor.js"></script>
    <script type="module" async src="https://unpkg.com/xtal-json-merge@0.2.21/xtal-insert-json.js?module"></script>
    <script type="module" async src="https://unpkg.com/p-d.p-u@0.0.10/p-d.js?module"></script>
    <script src="https://unpkg.com/billboard-charts@0.1.18/billboard-charts.js"></script>
</template>
```

then the content inside the template gets cloned into document.head, prior to replacing it with the contents of the html file.

Note the attribute data-ua.  This allows you to specify a user agent string.  Templates will only mount if the specified value is found inside the user agent of the browser.

This can allow multiple templates pointing to the same html file to point to different javascript files, depending on the browser.


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
