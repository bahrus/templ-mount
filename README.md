[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

[![Actions Status](https://github.com/bahrus/templ-mount/workflows/CI/badge.svg)](https://github.com/bahrus/templ-mount/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/templ-mount">

# \<templ-mount\>


<details>

<summary>Status Summary</summary>

The Committee for the Repair of templ-mount is coordinating fundamental adjustments, which include some breaking changes from version 0.0.48.

Repairs were previously put on ice, based on the naive hope that desperately needed browser standards, providing a far more comprehensive solution than what templ-mount can provide, were just around the corner.   

The committee has recently been reminded of how this is [not how things work](https://www.youtube.com/watch?v=0-Yl6FmV6EE).

[![Watch the video](https://img.youtube.com/vi/0-Yl6FmV6EE/maxresdefault.jpg)](https://www.youtube.com/watch?v=0-Yl6FmV6EE)

</details>

templ-mount helps load templates from url's, which point to HTML files or streams.  It takes some ideas from [JQuery's](https://w3techs.com/technologies/overview/javascript_library) [load](https://api.jquery.com/load/)  function, and also [html-include-element](https://www.npmjs.com/package/html-include-element).

<details>
    <summary>templ-mount's origin story</summary>

templ-mount remembers the day its creator first installed a PWA (Flipkart), and was blown away by the liberating effect this could have on web development.  PWA's swept aside significant barriers to the web, in terms of achieving parity with native apps.

templ-mount thinks, though, that in order to satisfactorily reach the promised land of true native competitiveness, we will need to find ways of building applications that can scale, while maintaining fidelity to the various commandments set forth by Lighthouse.  A profound cultural shift (or rediscovery of [old techniques](https://www.liquidweb.com/kb/what-is-a-progressive-jpeg/)?)  is needed in our thinking about the relationship between the client and the server. And, in fact, this has been the focus of many talented, creative developers at the [cutting edges](https://codesandbox.io/s/floral-worker-xwbwv), who are using their engineering prowess to overcome the significant hurdles to good performance imposed by browser vendor lethargy.  

The ability to import HTML (and other data formats) from the ~~heavens~~ server down to ~~Earth~~ the browser would, in templ-mount's opinion, make it much easier and simpler to get Lighthouse's blessing.  Such functionality would best be served by native browser api's, due to the complexities involved -- e.g the ability to truly stream in HTML as it renders, resolving and preemptively downloading relative references, centrally resolving package dependencies via import maps, providing sand-boxing support when needed, etc.   In the meantime, templ-mount is wandering the desert, in search of a surrogate api ([as](https://github.com/github/include-fragment-element) [are](https://www.filamentgroup.com/lab/html-includes/) [many](https://github.com/whatwg/html/issues/2791) [of](https://github.com/Juicy/imported-template/) [templ-mount's](https://api.jquery.com/load/) [compatriots](https://www.npmjs.com/package/@vanillawc/wc-include)).

</details>

## Purpose

It seems that HTML Templates, in particular node cloning [often](https://jsperf.com/clonenode-vs-createelement-performance/32) [provides](https://jsperf.com/innerhtml-vs-importnode/6) [the](https://github.com/sophiebits/innerhtml-vs-createelement-vs-clonenode) [best](https://stackoverflow.com/questions/676249/deep-cloning-vs-setting-of-innerhtml-whats-faster) performing way to generate HTML repeatedly.  They also provide the ability to download content ahead of time, before it is scrolled into view, and stored in a low memory object, thanks to the inertness of HTML templates.  Then, when needed, the content can materialize.  If the content moves out of view, it could, if it is helpful, be temporarily placed into a deep hibernation mode.  In other words, delete the materialized content, while holding on to the low-memory template from which it derived.  This approach might be most beneficial on a low memory device.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser needs to ultimately consume, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net MVC, Ruby on Rails, Django, pug, Java EE MVC, etc.

If this functionality (or some variation) were [built into the browser](https://discourse.wicg.io/t/add-src-attribute-to-template/2721), it would also **provide a way of injecting ShadowDOM without JS, a [long](https://discourse.wicg.io/t/declarative-shadow-dom/1904/15) [sought](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Declarative-Shadow-DOM.md) after [feature](https://github.com/whatwg/dom/issues/510)**.

## Significant to do items.

Reference resolution (e.g. nested script tags with relative paths, import mapping), support for different trust levels, streaming support.

## Retrieving template tags

If the templ-mount/templ-mount.js library is loaded (which we will assume going forward), then anywhere there's a template tag with attributes "import" and "href", templ-mount will retrieve the html from the specified url, and populate the inert template (with one exception which we will note later).

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
```

After loading, an attribute "loaded" is added, and event "load" is fired.

## Specifying cors / other fetch options

Use the request-init attribute to fine tune the fetch request:

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    request-init='{"mode": "cors"}' as=penguins-poop ></template>
```

**NB** If working with a non cors-friendly web site (probably 99.9% of all websites), cors issues can still be resolved using something like cors anywhere:

```html
<template import href=https://cors-anywhere.herokuapp.com/https://link.springer.com/article/10.1007/s00300-003-0563-3 
as=penguins-poop></template>
```

## Preemptive downloading, lazy loading into the DOM tree

If any DOM tag is found with attribute imp-key, templ-mount waits for that tag to become visible, and when it does, it searches for a template with "as" attribute matching the value of imp-key in the same ShadowDOM realm, and "imports" the template into the ShadowDOM of the tag.  The original light children of the tag, if they specify slot attributes, will become slotted into the ShadowDOM.

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
as=penguins-poop></template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-key=penguins-poop>
        <span slot="AdInsert"><a href="https://www.target.com/b/pedialax/-/N-55lp4">Pedia-Lax</a></span>
    </article>
</details>
```

**NB** If using this web component in a Game of Thrones website, the web component could find itself on trial for allegedly [poisoning the King](https://discourse.wicg.io/t/proposal-symbol-namespacing-of-attributes/3515).  

## Lazy downloading, lazy loading into the DOM tree (Stream support to be investigated)

Maybe we would rather save users' bandwidth, because they are unlikely to load some hidden content, and/or they are on an expensive network.  

We can lazy load the downloading as well, only beginning the download when the content is opened / scrolled into view.  We specify this using the when-needed attribute:


```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
          as=penguins-poop when-needed>
</template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-key=penguins-poop>
        <span slot="AdInsert">
            <a href="https://www.target.com/b/pedialax/-/N-55lp4">Pedia-Lax</a>
        </span>
    </article>
</details>
```

**Speculation:**  If this were implemented natively in the browser, it seems likely it would be possible to engineer this so that the content would pipe directly to the target element (article), rendering content as it streams in, and then store the final document in the template for repeated or later use.

Browser standard bearers seem to consider providing a solution that

1.  Saves people from wasting bandwidth needlessly
2.  Avoids premature loading into memory on a [low memory device](https://www.kaiostech.com/meet-the-devices-that-are-powered-by-kaios/), 
3.  Supports streaming on demand 

to be promoting an inferior user experience.  

templ-mount is experiencing a far less affluent lifestyle, trying not to drown in the nearby fire-lake, with only half a bar on its mobile tablet. It disagrees with the previous assessment, and feels a moral duty to at least investigate whether this difficult functionality could be achieved with existing browser api's (to be determined).

## If Shadow DOM is not needed / desired, use without-shadow attribute:

```html

<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    as=penguins-poop without-shadow></template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-key=penguins-poop></article>
</details>
``` 

Note that if you define multiple templates with identical href's, for example one with shadow DOM, one without, only one fetch request should be made for all of them.

## Template Instantiating

If you use ShadowDOM, there is built in support for slotting content.  But if you disable ShadowDOM, as above, but still want to insert some dynamic information, what to do?

This is what the dormant [template instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md) proposal is meant to address.  As that isn't built into the browser, an alternative way of finessing the template is provided by the [trans-render](https://github.com/bahrus/trans-render) library.  To invoke something like this (whether or not you allow ShadowDOM), you can enable ["filtering"](https://www.journaldev.com/1933/java-servlet-filter-example-tutorial) thusly:

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    as=penguins-poop without-shadow enable-filter></template>
<article imp-key=penguins-poop id=myArticle>
<script>
    myArticle.addEventListener('template-cloned', e =>{
        const clone = e.detail.clone; // template clone
        const template = e.detail.template // the template tag used to produce the clone
        //manipulate the clone before it gets inserted into the DOM tree.
    })
</script>
```

## Referencing pre-populated templates, lazy loading in the DOM Tree

If the content of a template is embedded inside a template tag already (as part of the original server-rendered payload), but you want to be able to import a clone using the same syntax, you can do the following:


```html
<template import as=penguins-poop>
    <p>Chinstrap and Adélie penguins generate considerable 
        pressures to propel their faeces away from the edge of the nest.
        ...
    </p>

    ...
</template>
...
<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article imp-key=penguins-poop>
        <span slot="AdInsert"><a href=//www.target.com/b/pedialax/-/N-55lp4>Pedia-Lax</a></span>
    </article>
</details>
```


This, of course, would also provide JS-free, declarative Shadow DOM support if implemented natively (and similar ideas to this have previously been floated by others).


## Activating content

If a template has the append-to-head attribute, then script and style tags inside will be added to the global head tag.  Due to strange Firefox behavior, it is recommended that js references be added via dynamic import:

```html
<template append-to-head id=guid>
    <script type=module>
        import('./blah.js');
    </script>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>
```

Note that there is no href, so this will do nothing more than activate the content.  

I would not expect this kind of template to be present in the opening index.html (else why not just add the tags directly to the head tag?), but rather, from imported templates, which have dependencies.

Ok, I could see it in a standalone html file/stream also, if that file intends to be used both as a standalone web page, and as an embedded template in other web pages.

The id is optional, but, because there's no href, if the template will appear in multiple downloads (despite templ-mount's minimal efforts at de-dup), then providing the id will help templ-mount to avoid unnecessarily cluttering the head tag with duplicate script / style / link tags.


## Disallowing activating content [TODO]

Allowing HTML references to load JS dependencies could be considered dangerous if the site the HTML is coming from is not very trustworthy, and/or appropriate CSP rules are not in place.

Investigations are underway to support the same kind of sandboxing [supported natively by iFrames](https://www.w3schools.com/tags/att_iframe_sandbox.asp).

## Snipping

If the html file / html stream being imported contains at least two instances of the following "magic string":

```html
<!---->
```

then templ-mount *can* be made to only import the content between the first two such strings. This helps allow an html file / stream to serve both as a standalone web page, but also as a template that could be used as an embedded snippet of HTML. (JQuery's load function supports something similar).

At the top of this document, we mentioned the desire to allow servers to send content down in the native format that the browser will consume. This snipping solution goes against that strategy a bit, in the sense that here we are suggesting doing some string manipulation of the content. But most server-side solutions can easily snip out content in a similar way to what we are doing above. But if server-side solutions aren't available, you can snip out the main content thusly:

```html
<template import href=path/to/some/fileOrStream.html as=fos snip></template>
```

## Changing parameters via href attribute of template.

An iFrame allows you to change the src attribute, and the contents inside get replaced, rather than appended to.  That is now supported, but only if modifying the href attribute.

## Changing parameters via href property of template [TODO].

## Defining a Web Component using templ-mount [TODO]

# Viewing This Element Locally

```
$ npm install
$ npm run serve
```

#  Testing 

```
$ npm run test
```
 

