# \<templ-mount\>

templ-mount is a 855B (gzipped / minified) dependency free custom element. 

It allows templates to be loaded from url&#39;s

```html
<templ-mount></templ-mount>
```

does the following:

1)  It searches for template elements outside any Shadow DOM, with attribute data-src.  It preemptively downloads those template references.
2)  It searches for template elements inside its parent element with attribute data-src.
3)  It monitors the document.head element for additional template elements with attribute data-src and loads them as they get added.
4)  Once the template is downloaded and inserted into the template, the "loaded" attribute is set.

```html
<!-- sample.html -->
<head>
</head>
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
