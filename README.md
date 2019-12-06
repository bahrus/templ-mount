[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/templ-mount">

# \<templ-mount\>


<details>

<summary>Status Summary</summary>

The Committee for the Repair of templ-mount is coordinating fundamental adjustments, which include some breaking changes from version 0.0.48.

Repairs were previously put on ice, based on the naive hope that desperately needed browser standards, providing a far more comprehensive solution than what templ-mount can provide, were just around the corner.   

The committee has recently been reminded of how this is [not how things work](https://www.youtube.com/watch?v=0-Yl6FmV6EE).

[![Watch the video](https://img.youtube.com/vi/0-Yl6FmV6EE/maxresdefault.jpg)](https://www.youtube.com/watch?v=0-Yl6FmV6EE)

</details>

templ-mount helps load templates from url's, which point to HTML files or streams.  It takes some ideas from [html-include-element](https://www.npmjs.com/package/html-include-element).

<details>
    <summary>templ-mount's origin story</summary>

templ-mount remembers the day its creator first installed a PWA (Flipkart), and was blown away by the liberating effect this could have on web development.  PWA's swept aside significant barriers to the web, in terms of achieving parity with native apps.

templ-mount thinks, though, that in order to satisfactorily reach the promised land of true native competitiveness, we will need to find a way of building applications that can scale, while maintaining fidelity to the various commandments set forth by Lighthouse.  A profound cultural shift (or rediscovery of [old techniques](https://www.liquidweb.com/kb/what-is-a-progressive-jpeg/)?)  is needed in our thinking about the relationship between the client and the server. And, in fact, this has been the focus of many talented, creative developers at the [cutting edges](https://codesandbox.io/s/floral-worker-xwbwv) (though frankly custom elements seems like the most natural fit for this, but whatever :-) ).  

The ability to import HTML (and other data formats) from the ~~heavens~~ server down to ~~Earth~~ the browser would, in templ-mount's opinion, make it much easier and simpler to get Lighthouse's blessing.  Such functionality would best be served by native browser api's, due to the complexities involved -- e.g the ability to truly stream in HTML as it renders, resolving and preemptively downloading relative references, centrally resolving package dependencies via import maps, providing sand-boxing support when needed, etc.   In the meantime, templ-mount is wandering the desert, in search of a surrogate api ([as](https://github.com/github/include-fragment-element) [are](https://www.filamentgroup.com/lab/html-includes/) [many](https://github.com/whatwg/html/issues/2791) [of](https://github.com/Juicy/imported-template/) [templ-mount's](https://api.jquery.com/load/) [compatriots](https://www.npmjs.com/package/@vanillawc/wc-include)).

</details>

## Purpose

It seems that HTML Templates, in particular node cloning [often](https://jsperf.com/clonenode-vs-createelement-performance/32) [provides](https://jsperf.com/innerhtml-vs-importnode/6) [the](https://github.com/sophiebits/innerhtml-vs-createelement-vs-clonenode) [best](https://stackoverflow.com/questions/676249/deep-cloning-vs-setting-of-innerhtml-whats-faster) performing way to generate HTML repeatedly.  They also provide the ability to download content ahead of time, before it is scrolled into view, and stored in a low memory object, thanks to the inertness of HTML templates.  Then, when needed, the content can materialize.  If the content moves out of view, it could, if it is helpful, be temporarily placed into a deep hibernation mode.  In other words, delete the materialized content, while holding on to the low-memory template from which it derived.  This approach might be most beneficial on a low memory device.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser needs to ultimately consume, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net MVC, Ruby on Rails, Django, pug, Java EE MVC, etc.

## Out of Scope

Reference resolution (e.g. nested script tags with relative paths, import mapping), support for different trust levels.


## Retrieving template tags

If, in the same Shadow DOM realm where the templ-mount instance resides, a template tag with attributes "import" and "href" is encountered, templ-mount will retrieve the html from the url, and populate the inert template.

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
```

After loading, an attribute "loaded" is added, and event "load" is fired.

## Specifying cors / other fetch options

Use the request-init attribute:

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

If, in the same ShadowDOM realm as a templ-mount instance (including the realm outside any Shadow DOM), any tag is found with attribute imp-key, templ-mount waits for that tag to become visible, and when it does, it searches for a template with "as" attribute matching the value of imp-key in the same ShadowDOM realm, and "imports" the template into the ShadowDOM of the tag.  The original light children of the tag, if they specify slot attributes, will become slotted into the ShadowDOM.

```html
<templ-mount></templ-mount>
...
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

**NB** If using this web component in a Game of Thrones website, the web component could find itself on trial for allegedly [poisoning the King](https://discourse.wicg.io/t/proposal-symbol-namespacing-of-attributes/3515).  You can, however, configure what attribute to use within each ShadowDOM realm, by specifying:

```html
<templ-mount import-key=something-else>
```

In the future examples, we will assume there's a \<templ-mount\> tag in the relevant place (each Shadow DOM realm) as needed.

## Lazy downloading, lazy loading into the DOM tree

Maybe we would rather save users' bandwidth, because they are unlikely to load some hidden content, or they are on an expensive network.  

We can lazy load the downloading as well, using the when-needed attribute:


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

### Referencing pre-populated templates

If the content of a template is embedded inside a template tag already (as part of the original server-rendered payload), but you want to be able to import a clone using the same syntax, you can do the following:


```html
<template import as=penguins-poop>
    <p>Chinstrap and Adélie penguins generate considerable pressures to propel their faeces away from the edge of the nest.
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


### Activating content

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


### Disallowing activating content - out of scope

Allowing HTML references to load JS dependencies could be considered dangerous if the site the HTML is coming from is not very trustworthy, and/or appropriate CSP rules are not in place.

My preference on this would be to indicate something like this:

```html
<template import href=//myCDN.com/blah-blah.html as=blah without-js without-wasm></template>
```

This means import the document blah-blah.html, but don't allow templ-mount to activate any script / webAssembly inside, including content coming from recursive imports triggered by blah-blah.html.

But that seems really difficult to implement outside the browser internals, in a foolproof way, without parsing and processing the content, and ratcheting up the size of this component.

So this is going to be kept out of scope (for now, at least).

### Snipping

If the html file / html stream being imported contains at least two instances of the following "magic string":

```html
<!---->
```

then templ-mount *can* be made to only import the content between the first two such strings. This helps allow an html file / stream to serve both as a standalone web page, but also as a template that could be used as an embedded snippet of HTML, or as a  web component (see below).

At the top of this document, we mentioned the desire to allow servers to send content down in the native format that the browser will consume. This snipping solution goes against that strategy a bit, in the sense that here we are suggesting doing some string manipulation of the content. But most server-side solutions can easily snip out content in a similar way to what we are doing above. But if server-side solutions aren't available, you can snip out the main content thusly:

```html
<template import href=path/to/some/fileOrStream.html as=fos snip></template>
```

# Viewing Your Element

```
$ npm install
$ npm run serve
```
 

