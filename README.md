[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/templ-mount@0.0.46/dist/templ-mount.iife.min.js?compression=gzip">

# \<templ-mount\>

templ-mount helps create templates from url's, which point to HTML files or streams.  It takes some ideas from [html-include-element](https://www.npmjs.com/package/html-include-element).

templ-mount has been rather neglected for a while, but my interest in it has been rekindled due to me relapsing into my usual [impatience with the standards process stance](https://www.youtube.com/watch?v=0-Yl6FmV6EE), and includes some breaking changes from before.

<details>
    <summary>templ-mount's origin story</summary>

templ-mount remembers the day its creator first installed a PWA (Flipkart), and was blown away by the liberating effect this could have on web development.  PWA's swept aside significant barriers to the web, in terms of its competitiveness with native apps.

templ-mount thinks, though, that in order to satisfactorily reach the promised land of true native competitiveness, we will need to find a way of building applications that can scale, while maintaining fidelity to the various commandments set forth by Lighthouse.  A profound cultural shift (or rediscovery of [old techniques](https://www.liquidweb.com/kb/what-is-a-progressive-jpeg/)?)  is needed in our thinking about the relationship between the client and the server. In fairness, it has been the focus of many creative ideas at the cutting edges of the developer community these past few years.  

The ability to import HTML (and other data formats) from the ~~heavens~~ server down to ~~Earth~~ the browser would, in templ-mount's opinion, make it much easier to get Lighthouse's blessing.  Such functionality would best be served by native api's, due to the complexities involved.  In the meantime, templ-mount is wandering the desert, in search of a surrogate api (as are many of temple-mount's compatriots).

</details>

## Purpose

It seems that HTML Templates, in particular node cloning [often](https://jsperf.com/clonenode-vs-createelement-performance/32) [provides](https://jsperf.com/innerhtml-vs-importnode/6) [the](https://github.com/sophiebits/innerhtml-vs-createelement-vs-clonenode) [best](https://stackoverflow.com/questions/676249/deep-cloning-vs-setting-of-innerhtml-whats-faster) performing way to generate HTML repeatedly.  They also provide the ability to download content ahead of time, before it is scrolled into view, and stored in a low memory object, thanks to the inertness of HTML templates.  Then, when needed, the content can materialize.  If the content moves out of view, it could, if it is helpful, be temporarily placed into a deep hibernation mode.  In other words, delete the materialized content, while holding on to the low-memory template from which it derived.  This approach might be most beneficial on a low memory device.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser needs to ultimately consume, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net MVC, or Java EE MVC.

## Out of Scope

Reference resolution (e.g. nested script tags with relative paths).

## Hello world -- Bootstrapping Template

<templ-mount href=include1.html></templ-mount>

loads the template containing the contents of the html file / stream into memory (keyed off of the href). 

the href attribute / property can also be an array of URL's (using JSON notation in the case of the attribute):

<templ-mount href='["include1.html", "include2.html"]'></templ-mount>

```html
<body>
    <templ-mount href="include1.html"></templ-mount>
    <script type="module" src="../templ-mount.js"></script>
</body>
```

To be precise, the template is not actually added to the DOM.  If programmatic access to the template is needed, it can be obtained via

```JavaScript
const {TemplMount} = await import('templ-mount/TemplMount.js');
const template = await TemplMount.template(myURL);
```

Retrieving HTML, but not displaying anything is a rather unsatisfying "Hello world" experience.  For a more satisfying experience, add an attribute -imp, which will be explained in more detail later:

```html
<body>
    <templ-mount href=embalmedChinesePrisoner.html -imp>
       <fungal-treatment slot="anatomicalSnuffbox"></fungal-treatment>
    </templ-mount>
    <script type="module" src="../templ-mount.js"></script>
</body>
```


### Retrieving template tags [TODO]

If, in the same Shadow DOM realm where the templ-mount instance resides, a template tag with attribute "href" is encountered, templ-mount will retrieve the html from the url, and populate the inert template.

```html
<template href=myContent.html></template>
```

After loading, an attribute "loaded" is added, and event "load" is fired.

### Preemptive downloading, lazy loading into memory [TODO]

If, in the same Shadow DOM realm as the templ-mount instance (including the realm outside any Shadow DOM), any tag is found with pseudo attribute -imp, templ-mount waits for that tag to become visible, and when it does, it searches for a template with href matching the value of -imp, and "imports" the template into the ShadowDOM of the tag.  The original children of the tag, if they specify slot attributes, will become slotted into the ShadowDOM.

```html
<templ-mount></templ-mount>
...
<template href=myContent.html></template>
...
<details>
    <summary></summary>
    <article -imp=myContent.html>
        <span slot="mySlot">
    </article>
</details>
```

In the example above, the template tag, and the article tag with -imp attriubte do not need to be in the same shadow DOM realm.  All that is needed is for a templ-mount tag to be present in the shadow DOM realm of each invidual tag, for the functionality to take hold.  This allows templates to be shared across Shadow DOM realms.

There should only be one templ-mount per shadow DOM realm, or work will be duplicated.

In the future examples, we will assume there's an ever present <templ-mount> present in the relevant place, and not 

**NB** If using this web component in a Game of Thrones website, the web component could find itself on trial for allegedly [poisoning the King](https://discourse.wicg.io/t/proposal-symbol-namespacing-of-attributes/3515/4).

### If Shadow DOM is not needed / desired, use -imp-light:

```html
<templ-mount></templ-mount>
...
<template href=myContent.html></template>
...
<details>
    <summary></summary>
    <article -imp-light=myContent.html></article>
</details>
```

### Lazy downloading, lazy loading into memory [TODO], no shadow DOM

```html
<templ-mount></templ-mount>
<details>
    <summary></summary>
    <article -imp-light=myContent.html></article>
</details>
```

This eliminates one tag, so the mechanics of downloading the file are reduced from three tags to two.  But this will not allow some of the "import" finessing described below. 


### Activating content [TODO]

If a template has the -activate pseudo attribute, then script, style and link tags inside will be added to the global head tag.  Due to strange Firefox behavior, it is recommended that js references be added via dynamic import:

<template -activate id=guid>
    <script type=module>
        import('./blah.js');
    </script>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>

Note that there is no href, so this will do nothing more than activating the content.  If the href attribute is present, it will also download the content, and replace the activating content (which should already be added to the global head tag by now).

I would not expect this kind of template to be present in the opening index.html (else why not just add the tags directly to the head tag?), but rather, from imported templates, which have dependencies.

The id is optional, but, because there's no href, if the template will appear in multiple downloads (despite templ-mount's efforts at de-dup), then providing the id will help templ-mount also to unnecessarily clutter the head tag with duplicate script / style / link tags.

### Disallowing activating content [TODO]

Allowing HTML references to load JS dependencies could be considered dangerous if the site the HTML is coming from is not very trustworthy, and/or appropriate CSP rules are not in place.

To prevent "activating" templates, use attribute / property "passive" [=true]

### Snipping [TODO]

If the html file / html stream being imported contains at least two instances of the following "magic string":

<!---->

then it will only import the content between the first two such strings. This helps allow an html file / stream to serve both as a standalone web page, but also as a template that could be used as a web component.

At the top of this document, we mentioned the desire to allow servers to send content down in the native format that the browser will consume. This snipping solution goes against that strategy a bit, in the sense that here we are suggesting doing some string manipulation of the content. But most server-side solutions can easily snip out content in a similar way to what we are doing above. If the developer takes the time to implement this, they won't reap much reward if templ-mount searches for these magic comment strings anyway.

To tell templ-mount not to do any kind of snipping, add -nosnip:

<template href="path/to/some/fileOrStream.html" -nosnip></template>

This will give a slight performance boost.

### Defining a custom element

```html
<!-- Contents of my-component.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <!---->
    <template -activate>
        <script type=module>
            import('./my-custom-element-definition.js#[templateUrl]');  //does import.meta give hash value in all browsers?
        </script>
        <style>
            @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
        </style>
    </template>
    <h1>MyComponentContent</h1>
    <!---->
</body>
</html>

```

templ-mount will/can display the contents outside any templates.   

