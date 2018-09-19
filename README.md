[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/templ-mount@0.0.42/build/ES6/templ-mount.iife.js?compression=gzip">

# \<templ-mount\>

templ-mount allows templates to be loaded from url's, where template elements have the following syntax:

```html
<template data-src="path/to/some/fileOrStream.html"></template>
```

or

```html
<template data-src href="path/to/some/fileOrStream.html"></template>
```

The latter syntax is more IDE friendly, but bears a remote risk that browsers may someday add support for the href attribute for the template element, where the behavior differs from what templ-mount provides.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser will consume it, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net MVC, or Java EE MVC.

## Syntax of templ-mount

Placing templ-mount inside an html document:

```html
<templ-mount></templ-mount>
```

does the following:

1)  It searches for template elements outside any Shadow DOM, with attribute data-src, which can specify the url.  Or you can just add attribute data-src, and specify the actual url using  the href attribute.
2)  It activates script tags found inside template elements containing attribute data-src or data-activate.  It clones nested templates into the header.
2)  It searches for template elements inside its parent element with attribute data-src, and downloads those as well.
3)  It monitors the document.head element for additional template elements with attribute data-src and loads them as they get added.
4)  Once the template is downloaded and inserted into the template, the "loaded" attribute is set.


## Copying the contents of the preloaded template into the header.

As a prelude to the discussion that follows, let's remember (or become aware) that if you clone a template with inert DOM into the document, making it "come alive", script elements contained inside the template do *not* get activated.  This is a point worth bringing up early, and with emphasis, to a new developer just starting out with web components, so they don't get confused and frustrated.  It doesn't seem to be mentioned in the [most](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) widely available documentation on the template element.  The fact that style tags *do* become active contributes to the confusion, I think.

But the need to activate script elements associated with a template is of paramount importance.  Hence the lengthy discussion that follows (and I also note that this ability to activate scripts with templ-mount is responsible for a significant share of the 1.2 kb file size).




### Preemptive loading

If the original template markup, prior to loading the content from a fetch request, contains some script tags, e.g.:

```html
<template id="bb_chart_template" data-src="billboardChart.html" data-ua="Chrome">
    <script async src="https://unpkg.com/xtal-json-editor@0.0.19/xtal-json-editor.js"></script>
    <script type="module" async src="https://unpkg.com/xtal-json-merge@0.2.21/xtal-insert-json.js?module"></script>
    <script type="module" async src="https://unpkg.com/p-d.p-u@0.0.10/p-d.js?module"></script>
    <script src="https://unpkg.com/billboard-charts@0.1.18/billboard-charts.js"></script>
    <script>
            console.log('i am here');
    </script>
</template>
```

then templ-mount clones those script tags into document.head, prior to replacing it with the contents of the html file.

Note the attribute data-ua.  This allows one to specify a user agent string (regular expression).  Templates will only mount if the specified value is found inside the user agent of the browser.  If an additional attribute data-exclude is present, it will only activate if the user agent does *not* match the expression.

This can allow multiple templates pointing to the same html file / stream to point to different javascript files, depending on the browser.

NB:  Unlike Chrome, if MS Edge and Firefox (nightly) see script tags with "src" attributes inside a template, they may (uselessly?) *download* the script references, but they don't *activate* the script.  Edge does this download regardless of the "type" attribute.  Firefox only does this if it recognizes the "type" as a valid JavaScript value.  In my view, this is buggy behavior for both browsers.  Since Edge doesn't have much of a mobile footprint on mobile devices (it uses Safari and Chromium on Android and iOS), the extra download that templ-mount would cause would probably not lead to the destruction of rainforest.  To accommodate Firefox, you can place a colon in the "type" attribute, and templ-mount will remove that colon when it activates the script tags (sigh):

```html
<script type=":module" async src="https://unpkg.com/p-d.p-u@0.0.10/p-d.js?module"></script>
```

The script doesn't get downloaded again when it is activated.

### Template tags used just to load script

Inside your template document itself, you may also want to load some (additional) script dependencies.  This can most transparently be done with the following syntax, where the attribute data-activate is utilized:

```html
<template id="bb_chart_template" data-activate data-ua="Trident" data-exclude>
    <script async src="https://unpkg.com/xtal-json-editor@0.0.19/xtal-json-editor.js"></script>
    <script type="module" async src="https://unpkg.com/xtal-json-merge@0.2.21/xtal-insert-json.js?module"></script>
    <script type="module" async src="https://unpkg.com/p-d.p-u@0.0.10/p-d.js?module"></script>
    <script src="https://unpkg.com/billboard-charts@0.1.18/billboard-charts.js"></script>
    <script>
            console.log('i am here');
    </script>
</template>
```


### Rambling Comments on Script Loading

In the preceding discussion, we've suggested two (non exclusive) approaches to how you could use templ-mount to load JavaScript files:  "Preemptive script loading" vs "activating" scripts found inside the template file itself, "on demand".  

The case for using the first approach -- preemptively starting downloading the JavaScript files while waiting for the template stream itself to generated and downloaded -- is a bit weakened by the existence of the preload / preloadmodule resource hints.  However, loading scripts in this way does allow js files needed with more urgency to load sooner, based on how templates are nested.  And of course the ability to select by user agent could be helpful, as that is not supported out of the box with browsers (the closest thing is the nomodule attribute).

The biggest disadvantage of using preemptive loading, is that in practice it means you will likely need to duplicate references:  Once  inside the template tag, and once inside the actual html document, assuming you want to support the ability to open the template document as a standalone web page (as discussed briefly below).

I.e. reducing redundancy means delaying loading of files a bit.  So there's a bit of a trade-off there, and the right answer may depend on the use case.

## Snipping

If the html file / html stream being imported contains at least two instances of the following "magic string":

```html
<!---->
```

then it will only import the content between the first two such strings.  This helps allow an html file / stream to serve both as standalone web page, but also as a template that could be used as web component.

On this topic, templ-mount works well in combination with [carbon-copy](https://www.webcomponents.org/element/carbon-copy).

At the top of this document, we mentioned the desire to allow servers to send content down in the native format that the browser will consume it.  This snipping solution goes against that strategy a bit, in the sense that here we are suggesting doing some string manipulation of the content.  But most server-side solutions can easily snip out content in a similar way to what we are doing above.  If the developer takes the time to implement this, they won't reap much reward if templ-mount searches for these magic comment strings anyway.

To tell templ-mount not to do any kind of snipping, add:

```html
<template data-src="path/to/some/fileOrStream.html" nosnip></template>
```

This will give a slight performance boost.

## Referencing:

### Node-based local development

>yarn add templ-mount

or

>np install templ-mount --save

If you are using Polymer 3.0 cli server, or you are doing a build-time bundling with webpack (e.g.), you can reference templ-mount.js

### Weightless development

#### Unbundled / non minified

Chrome works well with unpkg's bare import specifiers, where the js reference is followed by the ?module query string parameter.  Other browsers seem more "iffy" with this kind of link, and may require the "iife" link shown below.

```html
<script type="module" src="https://unpkg.com/templ-mount@0.0.13/templ-mount.js?module"></script>
<!-- IE11 bundled non minified -->
<script nomodule src="https://unpkg.com/templ-mount@0.0.13/build/ES5-no-mini/templ-mount.iife.js"></script>
<!-- ES6 IIFE bundled non minified -->
<script type="module" src="https://unpkg.com/templ-mount@0.0.13/templ-mount.iife.js?"></script>
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
$ npm test
```


