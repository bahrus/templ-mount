[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

# \<templ-mount\>

templ-mount is a ~1.2 KB (gzipped / minified) dependency free custom element. 

It allows templates to be loaded from url's, where templates have the following syntax:

```html
<template data-src="path/to/some/fileOrStream.html"></template>
```

or

```html
<template data-src href="path/to/some/fileOrStream.html"></template>
```


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

Although there are some complications mentioned below, by adding script tags as shown above in document.head, those script tags will be activated.

You don't need to give a specific url in data-src to cause the script tags to be added (and activated) int he header, as long as data-src attribute is present.

Note the attribute data-ua.  This allows you to specify a user agent string.  Templates will only mount if the specified value is found inside the user agent of the browser.  If the value of data-ua starts with "!" then it will activate if the user agent does *not* contain the value.

This can allow multiple templates pointing to the same html file to point to different javascript files, depending on the browser.

Templates can be nested, and this will load resources in a somewhat logical order.

If the html file / html stream contains at least two instances of the following "magic string":

```html
<!---->
```

Then it will only import the content between the first two such strings.  This helps allow an html file / stream to serve both as standalone web page, but also as a template that could be used as web component.

templ-mount works well in combination with [carbon-copy](https://www.webcomponents.org/element/carbon-copy).


## Referencing:

### Node-based local development

>yarn add templ-mount

or

>np install templ-mount --save

If you are using Polymer 3.0 cli server, or you are doing a build-time bundling with webpack (e.g.), you can reference templ-mount.js

### Weightless development

#### Unbundled / non minified

Chrome or Firefox Nightly (possibly Safari), but not Edge (due to bug?):

```html
<script type="module" src="https://unpkg.com/templ-mount@0.0.13/templ-mount.js?module"></script>
<!-- IE11 bundled non minified -->
<script nomodule src="https://unpkg.com/templ-mount@0.0.13/build/ES5-no-mini/templ-mount.iife.js"></script>
```

### Bundled / minified
```html
<script type="module" src="http://cdn.jsdelivr.net/npm/templ-mount@0.0.13/templ-mount.iife.min.js"></script> <!-- not minified, for some reason-->
<!-- IE11 bundled minified -->
<script nomodule src="http://cdn.jsdelivr.net/npm/templ-mount@0.0.13//build/ES5-no-mini/templ-mount.iife.min.js"></script>
```

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
