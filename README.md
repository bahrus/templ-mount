[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/templ-mount@0.0.46/dist/templ-mount.iife.min.js?compression=gzip">

# \<templ-mount\>


<details>

<summary>Status Summary</summary>

The Committee for the Repair of templ-mount is coordinating much needed enhancements, which will include some breaking changes.

Repairs were previously put on ice, based on the naive hope that desperately needed browser standards, providing a far more comprehensive solution than templ-mount can provide, were just around the corner.   

The committee has recently been reminded of how this is [not how things work](https://www.youtube.com/watch?v=0-Yl6FmV6EE).

[![Watch the video](https://img.youtube.com/vi/0-Yl6FmV6EE/maxresdefault.jpg)](https://www.youtube.com/watch?v=0-Yl6FmV6EE)

</details>

templ-mount helps create templates from url's, which point to HTML files or streams.  It takes some ideas from [html-include-element](https://www.npmjs.com/package/html-include-element).

<details>
    <summary>templ-mount's origin story</summary>

templ-mount remembers the day its creator first installed a PWA (Flipkart), and was blown away by the liberating effect this could have on web development.  PWA's swept aside significant barriers to the web, in terms of achieving parity with native apps.

templ-mount thinks, though, that in order to satisfactorily reach the promised land of true native competitiveness, we will need to find a way of building applications that can scale, while maintaining fidelity to the various commandments set forth by Lighthouse.  A profound cultural shift (or rediscovery of [old techniques](https://www.liquidweb.com/kb/what-is-a-progressive-jpeg/)?)  is needed in our thinking about the relationship between the client and the server. And, in fact, this has been the focus of many talented and creative developers at the cutting edges.  

The ability to import HTML (and other data formats) from the ~~heavens~~ server down to ~~Earth~~ the browser would, in templ-mount's opinion, make it much easier and simpler to get Lighthouse's blessing.  Such functionality would best be served by native browser api's, due to the complexities involved -- e.g the ability to truly stream in HTML as it renders, resolving and preemptively downloading relative references, centrally resolving package dependencies via import maps, providing sand-boxing support when needed, etc.   In the meantime, templ-mount is wandering the desert, in search of a surrogate api (as are many of templ-mount's compatriots).

</details>

## Purpose

It seems that HTML Templates, in particular node cloning [often](https://jsperf.com/clonenode-vs-createelement-performance/32) [provides](https://jsperf.com/innerhtml-vs-importnode/6) [the](https://github.com/sophiebits/innerhtml-vs-createelement-vs-clonenode) [best](https://stackoverflow.com/questions/676249/deep-cloning-vs-setting-of-innerhtml-whats-faster) performing way to generate HTML repeatedly.  They also provide the ability to download content ahead of time, before it is scrolled into view, and stored in a low memory object, thanks to the inertness of HTML templates.  Then, when needed, the content can materialize.  If the content moves out of view, it could, if it is helpful, be temporarily placed into a deep hibernation mode.  In other words, delete the materialized content, while holding on to the low-memory template from which it derived.  This approach might be most beneficial on a low memory device.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser needs to ultimately consume, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net MVC, Ruby on Rails, Django, pug, Java EE MVC, etc.

## Out of Scope

Reference resolution (e.g. nested script tags with relative paths, import mapping), support for different trust levels.

## Hello world -- Retrieving (and displaying) templates

```html
<templ-mount href=include1.html></templ-mount>
```

loads the template containing the contents of the html file / stream into memory (keyed off of the href). 

The href attribute / property can also be an array of URL's (using JSON notation in the case of the attribute):


```html
<templ-mount href='["include1.html", "include2.html"]'></templ-mount>
```

In contrast to what we will see a bit later, templ-mount's href templates are not actually added to the DOM.  If programmatic access to the template is needed, it can be obtained via the following api:

```JavaScript
const {TemplMount} = await import('templ-mount/TemplMount.js');
const template = await TemplMount.template(myURL);
```

Retrieving HTML, but not displaying anything, is a rather unsatisfying "Hello world" experience.  For a more satisfying experience, add an attribute imp-t, short for "import template", which will be explained in more detail later:

```html
<body>
    <templ-mount href=embalmedChinesePrisoner.html imp-t>
       <fungal-treatment slot="anatomicalSnuffbox"></fungal-treatment>
    </templ-mount>
</body>
```

### Retrieving template tags

It might be more comforting, rather than using a templ-mount tag, to use a template tag, as this would allow you to see the contents of the template.  To do so:

If, in the same Shadow DOM realm where the templ-mount instance resides, a template tag with attribute "href" is encountered, templ-mount will retrieve the html from the url, and populate the inert template.

```html
<template href=//link.springer.com/article/10.1007/s00300-003-0563-3></template>
```

After loading, an attribute "loaded" is added, and event "load" is fired.

### Preemptive downloading, lazy loading into the DOM tree, potentially across Shadow DOM boundaries

If, in the same Shadow DOM realm as a templ-mount instance (including the realm outside any Shadow DOM), any tag is found with pseudo attribute imp-t, templ-mount waits for that tag to become visible, and when it does, it searches for a template with href matching the value of imp-t, and "imports" the template into the ShadowDOM of the tag.  The original light children of the tag, if they specify slot attributes, will become slotted into the ShadowDOM.

```html
<templ-mount></templ-mount>
...
<template href=//link.springer.com/article/10.1007/s00300-003-0563-3></template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article href=//link.springer.com/article/10.1007/s00300-003-0563-3 imp-t>
        <span slot="AdInsert"><a href="https://www.target.com/b/pedialax/-/N-55lp4">Pedia-Lax</a></span>
    </article>
</details>
```

**NB** If using this web component in a Game of Thrones website, the web component could find itself on trial for allegedly [poisoning the King](https://discourse.wicg.io/t/proposal-symbol-namespacing-of-attributes/3515).

In the example above, the template tag, and the article tag with imp-t attribute matching the template's href attribute, do not need to be in the same Shadow DOM realm.  All that is required is for a templ-mount tag to be present in the Shadow DOM realm of each individual tag, for the functionality to take hold.  This allows templates to be shared across Shadow DOM realms.

There should only be one templ-mount per shadow DOM realm, or work will be duplicated.

In the future examples, we will assume there's an \<templ-mount\> in the relevant place as needed.

### Aliasing

If the template tag *is* in the same Shadow DOM realm as the article tag, and that article tag wants to import that template tag's content, aliasing is supported:

```html
<template href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-t=penguins-poop>
        <span slot="AdInsert"><a href=//www.target.com/b/pedialax/-/N-55lp4>Pedia-Lax</a></span>
    </article>
</details>
```

### If Shadow DOM is not needed / desired, use limp-t:

```html

<template href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article limp-t=penguins-poop></article>
</details>
```

### Lazy downloading, lazy loading into memory

If no template tag is present, the imp-t attribute can still cause the url to load (into a template in memory) and cloned into the Shadow DOM, only downloading, as well as cloning will only happen when the tag becomes visible.

```html
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article href=//link.springer.com/article/10.1007/s00300-003-0563-3 imp-t>
        <span slot="AdInsert"><a href=//www.target.com/b/pedialax/-/N-55lp4>Pedia-Lax</a></span>
    </article>
</details>
```

This saves the user bandwidth, especially if they never actually open the article summary, at the expense of having to wait a little bit when the content becomes visible.

This also eliminates one tag, so the mechanics of downloading the file are reduced from three tags to two (counting the templ-mount tag, one in each shadow DOM realm).  But this will not allow some of the "import" finessing described below. 

### Registering already loaded template [TODO]

If the content of a template is embedded inside a template tag already (part of the server-rendered payload), but you want to be able to import a clone using the same syntax, you can do the following:


```html
<template as=penguins-poop>
    <p>Chinstrap and Adélie penguins generate considerable pressures to propel their faeces away from the edge of the nest.
        ...
    </p>

    ...
</template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-t=penguins-poop>
        <span slot="AdInsert"><a href=//www.target.com/b/pedialax/-/N-55lp4>Pedia-Lax</a></span>
    </article>
</details>
```


### Activating content [TODO]

If a template has the activate attribute, then script, style and link tags inside will be added to the global head tag.  Due to strange Firefox behavior, it is recommended that js references be added via dynamic import:

```html
<template activate id=guid>
    <script type=module>
        import('./blah.js');
    </script>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>
```

Note that there is no href, so this will do nothing more than activate the content.  If the href attribute *is* present, it will also download the content, and replace the activating content (which should already be added to the global head tag by now).

I would not expect this kind of template to be present in the opening index.html (else why not just add the tags directly to the head tag?), but rather, from imported templates, which have dependencies.

The id is optional, but, because there's no href, if the template will appear in multiple downloads (despite templ-mount's efforts at de-dup), then providing the id will help templ-mount to avoid unnecessarily cluttering the head tag with duplicate script / style / link tags.


### Disallowing activating content - out of scope

Allowing HTML references to load JS dependencies could be considered dangerous if the site the HTML is coming from is not very trustworthy, and/or appropriate CSP rules are not in place.

My preference on this would be to indicate something like this:

```html
<template href=//myCDN.com/blah-blah.html passive></template>
```

This means import the document blah-blah.html, but don't allow templ-mount to activate any content inside, including content coming from recursive imports triggered by blah-blah.html

but that seems really difficult to implement outside the browser internals, in a foolproof way, without parsing and processing the content, and ratcheting up the size of this component.

So this is going to be kept out of scope (for now, at least).

### Snipping [TODO]

If the html file / html stream being imported contains at least two instances of the following "magic string":

```html
<!---->
```

then templ-mount *can* be made to only import the content between the first two such strings. This helps allow an html file / stream to serve both as a standalone web page, but also as a template that could be used as an embedded snippet of HTML, or as a  web component (see below).

At the top of this document, we mentioned the desire to allow servers to send content down in the native format that the browser will consume. This snipping solution goes against that strategy a bit, in the sense that here we are suggesting doing some string manipulation of the content. But most server-side solutions can easily snip out content in a similar way to what we are doing above. But if server-side solutions aren't available, you can snip out the main content thusly.

<template href="path/to/some/fileOrStream.html" snip></template>

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
    <template activate>
        <script type=module>
            import('./my-custom-element-definition.js#[templateUrl(s)]');  //does import.meta give hash value in all browsers?
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

 

