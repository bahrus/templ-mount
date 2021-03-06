[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/templ-mount)

<a href="https://nodei.co/npm/templ-mount/"><img src="https://nodei.co/npm/templ-mount.png"></a>

[![Actions Status](https://github.com/bahrus/templ-mount/workflows/CI/badge.svg)](https://github.com/bahrus/templ-mount/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/templ-mount">

# \<templ-mount\>



## Status Summary

The Committee for the Repair of templ-mount is coordinating fundamental adjustments, which include some breaking changes from version 0.0.48.

Repairs were previously put on ice, based on the naive hope that desperately needed browser standards, providing a far more comprehensive solution than what templ-mount can provide, were just around the corner.   

The committee has recently been reminded of how this is [not how these things work](https://www.youtube.com/watch?v=AXgWZyb_HgE).

[![Watch the video](https://img.youtube.com/vi/AXgWZyb_HgE/maxresdefault.jpg)](https://www.youtube.com/watch?v=AXgWZyb_HgE)



templ-mount helps load templates from url's, which point to HTML files or streams.  It takes some ideas from [JQuery's](https://w3techs.com/technologies/overview/javascript_library) [load](https://api.jquery.com/load/)  function,  [html-include-element](https://www.npmjs.com/package/html-include-element) and the [streaming-element-backpressure](https://streams.spec.whatwg.org/demos/streaming-element-backpressure.html).

## templ-mount's origin story

templ-mount remembers the day its creator first installed a PWA (Flipkart), and was blown away by the liberating effect this could have on web development.  PWA's swept aside significant barriers to the web, in terms of achieving parity with native apps.

templ-mount thinks, though, that in order to satisfactorily reach the promised land of true native competitiveness, we will need to find ways of building applications that can [scale, while maintaining fidelity to the various commandments set forth by Lighthouse](https://www.seetheholyland.net/temple-mount/#attachment_4489).  A profound cultural shift (or rediscovery of [old techniques](https://www.liquidweb.com/kb/what-is-a-progressive-jpeg/)?)  is needed in our thinking about the relationship between the client and the server (or cloud). And, in fact, this *has* been the focus of many talented, creative developers at the [cutting edges](https://codesandbox.io/s/floral-worker-xwbwv), who are using their engineering prowess to overcome the significant hurdles to good performance imposed by browser vendor lethargy.

[![Scale of Souls](https://www.seetheholyland.net/wp-content/uploads/Temple-Mount8.jpg)](https://www.seetheholyland.net/temple-mount/#attachment_4489)

The ability to stream HTML (and other data formats) from the ~~heavens~~ server/cloud down to ~~Earth~~ the browser would, in templ-mount's opinion, make it much easier and simpler to get Lighthouse's blessings.  Such functionality would best be served by native browser api's, due to the complexities involved -- e.g. the ability to [truly stream in HTML as it renders](https://itnext.io/your-single-page-app-is-now-a-polyfill-7881fb01694e), resolving and preemptively downloading relative references, centrally resolving package dependencies, providing sand-boxing support when needed, etc.   In the meantime, templ-mount is wandering the desert, in search of a surrogate api ([as](https://github.com/github/include-fragment-element) [are](https://www.filamentgroup.com/lab/html-includes/) [many](https://github.com/whatwg/html/issues/2791) [of](https://github.com/Juicy/imported-template/) [templ-mount's](https://api.jquery.com/load/) [compatriots](https://www.npmjs.com/package/@vanillawc/wc-include)).


## Purpose

It seems that HTML Templates, in particular node cloning [often](https://jsperf.com/clonenode-vs-createelement-performance/32) [provides](https://jsperf.com/innerhtml-vs-importnode/6) [the](https://github.com/sophiebits/innerhtml-vs-createelement-vs-clonenode) [best](https://stackoverflow.com/questions/676249/deep-cloning-vs-setting-of-innerhtml-whats-faster) performing way to generate HTML repeatedly.  They also provide the ability to download content ahead of time, before it is scrolled into view, and stored in a low memory object, thanks to the inertness of HTML templates.  Then, when needed, the content can materialize.  If the content moves out of view, it could, if it is helpful, be temporarily placed into a deep hibernation mode.  In other words, delete the materialized content, while holding on to the low-memory template from which it derived.  This approach might be most beneficial on a low memory device.

One of the driving forces behind this component is it allows applications to follow the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) and to send data to the browser in the format that the browser needs to ultimately consume, without (expensive) translations from one format into another.  It can work well with server-side-centric frameworks, like PHP, asp.net (core) MVC, Ruby on Rails, Django, pug, Java EE MVC, etc.

If this functionality (or some variation) were [built into the browser](https://discourse.wicg.io/t/add-src-attribute-to-template/2721), it would also **provide a way of injecting ShadowDOM without JS, a [long](https://discourse.wicg.io/t/declarative-shadow-dom/1904/15) [sought](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Declarative-Shadow-DOM.md) after [feature](https://github.com/whatwg/dom/issues/510)**.

**NB:** Declarative Shadow DOM support is [becoming a thing!](https://web.dev/declarative-shadow-dom/).  

## Significant to-do items.

Reference resolution (e.g. nested script tags with relative paths, import mapping), support for different trust levels.

## Retrieving template tags

If the templ-mount/templ-mount.js library is loaded (which we will assume going forward), then anywhere there's a template tag with attributes "import" and "href", templ-mount will retrieve the html from the specified url, and populate the inert template (with one exception which we will note later).

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
```

After loading, an attribute "loaded" is added, property "loaded" set to true, and event "load" is fired.

## Using the web component

If you use templ-mount to handle all your template loading, there's no need to be aware that templ-mount is in fact a custom element.

But if you want to use templ-mount to load templates within your Shadow DOM Realm only, without using templ-mount to manage all template loading globally, you will need to expose templ-mount the web component:

```html
 ⏵ #shadow-root (open)
    ...
    <templ-mount></templ-mount>
    ...
    <template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 as=penguins-poop></template>
```

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

## Lazy downloading, lazy loading into the DOM tree (with preliminary stream support via stream-orator)

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

Browser standard-bearers seem to consider providing a solution that

1.  Saves people from wasting bandwidth needlessly
2.  Avoids premature loading into memory on a [low memory device](https://www.kaiostech.com/meet-the-devices-that-are-powered-by-kaios/), 
3.  Supports streaming on demand 

to be promoting an inferior user experience.  

Sure, if you are a high-flying financier, and you need your web browser to be open at all times to your stock portfolio, which needs to update with every stock fluctuation, of course lazy loading isn't the best user experience. Time is Money!

But what about Tiny Tim, your assistant's little brother, suffering from renal tubular acidosis, an easily curable disease?  He toils away, shining people's shoes (shoes -- if only he could afford such a luxury).  One of his customers forgot to bring cash, and paid Tiny Tim instead with a disposable feature phone the customer was about to throw away.  This is Tiny Tim's opportunity to look up a community hospital that will treat him for free, but the phone only has 3 minutes of battery life left, and is down to the last 580KB of data, struggling with 1g speed at best.  

Tim searches for "community hospitals near me", and watches his remaining data disappear while downloading, as part of the original payload, an ad sponsoring the search.

The ad allows Tiny Tim to join a waiting list to purchase Maurizio Cattelan’s next installment of his masterpiece series "Comedian, Nth Edition." But hey, at least the ad wasn't delivered inside an iFrame.  Progress!  

This is the optimal user experience, according to the experts.

templ-mount isn't so sure, and feeling pangs of guilt, now provides preliminary support for streaming via existing browser api's when available (Chrome has good support, Firefox is in development).  templ-mount's streaming support is engineered so that the content can pipe directly to the target element (article), rendering content as it streams in, and then the final document is stored in the template for repeated or later use.

<details>
    <summary>Stream of Obliviousness</summary>

1.  Chrome seems to be quite far along in supporting streaming.
2.  Demos are [here](https://streams.spec.whatwg.org/demos/).
3.  Demos rely on iFrame, and document.write, which is somewhat limited in what it can write -- from my experience, the iframe streaming / writing doesn't work when it encounters a script tag, for example (maybe if the script throws an error it fails?).
4.  Firefox support for [WritableStream](https://platform-status.mozilla.org/) is in development.
5.  Safari has provided no indication of time-frame for stream support.
6.  More [details](https://caniuse.com/#feat=streams)
7.  Chrome (and the demos linked above) only supports a TextReader/Decoder, and relies on a temporary iframe to chunk the response into the target DOM element.
8.  Significantly, what does not appear to be in any near-term road map is native support for an [XML/HTML Reader](https://en.wikipedia.org/wiki/Simple_API_for_XML) .
9.  In theory, the trans-render syntax could be usable for a streaming XML/HTML Reader, but that appears to be an irrelevant observation in the near term.  The only relevance I can see is if future support for this kind of streaming would have any impact on the current api (i.e. desire not to get boxed in).

Tentative proposal:

Use stream api if browser supports and "when-needed" and "stream" attribute are present.

</details>

### Breaking Up Above the Fold Content

It also seems likely that the same streaming effect could be put to good use in the case that:

```html
<article imp-key=penguins-poop>
    <span slot="AdInsert">
        <a href="https://www.target.com/b/pedialax/-/N-55lp4">Pedia-Lax</a>
    </span>
</article>
```

... is immediately visible on page load.  Now we need to retrieve the content immediately upon loading the page, and appending that to the visible article tag.  Rendering while the html streams in could also help here.

Why would we want to *not* include the content of article in the original payload, even though it will be in an immediately viewable area?  

First, the assumption that it is immediately visible should be considered.  In some cases, what is immediately visible will depend on the device, so it is a matter of guesswork.

But assuming it is guaranteed to be immediately visible by everyone, why bother?  The advantage of breaking up the loading page into these pieces, is that each sub section may depend on live back-end data coming from different sources.  Requiring that the server cannot send down any HTML until all such back-end queries have completed would mean performance would be driven by the slowest query.

In addition, the surrounding content -- for example, the layout shell -- may be a perfect candidate for (offline) caching, whereas the HTML content containing dynamic data might not be.

**NB:**  If using this approach to load the page progressively and in pieces, care should be taken to apply css tricks to avoid unnecessary page reflows.

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

If you use ShadowDOM, there is built-in support for slotting content.  But if you disable ShadowDOM, as above, but still want to insert some dynamic information, what to do?

This is what the ~dormant~[active](https://www.w3.org/wiki/TPAC/2020/SessionIdeas) [template instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md) proposal is meant to address.  As that isn't built into the browser, an alternative way of finessing the template is provided by the [trans-render](https://github.com/bahrus/trans-render) library.  To invoke something like this (whether or not you allow ShadowDOM), you can enable ["filtering"](https://www.journaldev.com/1933/java-servlet-filter-example-tutorial) thusly:

```html
<template import href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    as=penguins-poop without-shadow enable-filter></template>
<article imp-key=penguins-poop id=myArticle>
<script>
    myArticle.addEventListener('template-cloned', e =>{
        const clone = e.detail.clone; // template clone
        const template = e.detail.template // the template tag used to produce the clone
        //manipulate the clone before it gets inserted into the DOM tree, for more cost-effective manipulation.
    });
    myArticle.addEventListener('insertion-complete', e =>{
        //fired after template has been appended into target.
        //DOM manipulation will tend to be more costly now.
    })
</script>
```
<details>

<summary>Considerations when using streaming [subject to change]</summary>

templates with attribute "stream" will be streamed into the target element the first time that url is used (if "when-needed" attribute is also present).  This has a significant impact on template instantiating, in terms of lifecycle events, and other considerations, that developers need to be aware of.  

If streaming is used, the template-cloned event will not be fired the first time content is added to the live DOM tree (i.e. becomes active content).  Only event "stream-complete" will be fired, at which point DOM manipulation will tend to be more expensive. 

```html
<template import stream href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    as=penguins-poop when-needed without-shadow enable-filter ></template>
<article imp-key=penguins-poop id=myArticle>
<script>
    myArticle.addEventListener('stream-complete', e =>{
         // nothing to pass, really?
    })
</script>
```

If streaming is *not* used (when "stream" is not present or the content is already downloaded), an event can now be fired *before* the content has been added to the tree.  Manipulation of the pre-committed DOM is now considerably cheaper.

Even if the stream attribute is present, event 'template-cloned' will also be fired if the url was already downloaded.  

But in the case that the content needs to be modified while streaming, another event is fired, which does not bubble:

```html
<template id=myTemplate import stream href=//link.springer.com/article/10.1007/s00300-003-0563-3 
    as=penguins-poop when-needed without-shadow enable-filter ></template>
<article imp-key=penguins-poop id=myArticle>
<script>
    myTemplate.addEventListener('stream-chunk', e =>{
         e.detail.text = e.detail.text.substring(100);
    })
</script>
```

This provides the opportunity to modify the stream before it gets added to the DOM.

Note that only Chrome supports streaming currently.  In order to not make the more capable browser(s) suffer, browsers that don't stream will still have event "stream-complete" fired, only after the content has been added to the live DOM Tree.

Note that web components embedded in the stream can (I think) do interesting things while the content is being streamed, so that appears to be a nice use case for web components, which components [like](https://github.com/bahrus/p-et-alia) [these](https://github.com/bahrus/if-diff) try to take advantage of.

</details>

## Referencing pre-populated templates, lazy loading into the DOM Tree

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


This, of course, would also provide JS-free, declarative Shadow DOM support if implemented natively, and similar ideas to this have previously been floated by others -- however, it appears that this idea might not line up very well with current popular approaches of hydrating.  Perhaps if template instantiation were added, this approach would be more useful for those frameworks.

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

### Lhs, Rhs snipping

The left hand side and right hand side of the snipping can be specified:

```html
<template import href=path/to/some/fileOrStream.html as=fos snip='{"lhs":"<body","rhs":"</body>"}'></template>
```

## Changing parameters via href attribute of template or via href property

An iFrame allows you to change the src attribute, and the contents inside get replaced, rather than appended to.  That is now supported, both as an attribute and as a property.




<!-- ## Dehydrating server-rendered content [TODO, tentative]

<template import penguins-poop on=DOMContentLoaded as penguins-poop></template>

<details>
    <summary>Pressures produced when penguins pooh — calculations on avian defaecation</summary>
    <article id=penguins-poop>
        <a href=//www.target.com/b/pedialax/-/N-55lp4 slot="AdInsert">Pedia-Lax</a>
        <p>Chinstrap and Adélie penguins generate considerable 
            pressures to propel their faeces away from the edge of the nest.
            ...
        </p>
    </article>
    ...
</details> -->




## Defining a Web Component using templ-mount [untested idea]

Suppose you are developing a web component used to help illustrate the sequence of moves behind a chess match between Kasparov and Deep Blue.

You first create a [template](https://codepen.io/sybiljas/pen/zYOyjjN) [for](https://codepen.io/anon/pen/JQRwxa) [a](https://codepen.io/anon/pen/YoPXyJ) [chess](https://codepen.io/SampathParavasthu/pen/WmNwGQ) [board](https://codepen.io/rawright-the-sans/pen/BvBrYG).  

I've taken an average of the number of lines of custom JavaScript needed to create these boards: 0.  Okay, the first example is all HTML, but it uses a js-based web-component, css-doodle, for fancier effects, though.  Having the browser natively support HTML **with dependencies** seems to be beyond anyone's wildest dreams currently.  Just not technically feasible, we are told.  Anyway...

We know exactly where the chess pieces will be when the game starts, so we don't really need fancy JS in our web component for that, just the html for the board, as shown in the code-pens.  

The web component's JS will only be used to transform the html of the original board into different variations, depending on what moves are made.  The JS is used only for the subsequent boards, in other words.

Unfortunately, the browser vendors have not been very kind to HTML-first solutions, which this screams for  (as do many of the award-winning [code-pens](https://www.google.com/search?q=best+codepens+of&rlz=1C1CHBF_enUS875US875&oq=best+codepens+of+&aqs=chrome..69i57j0l5.3835j0j7&sourceid=chrome&ie=UTF-8)).

Suppose we stipulate that referencing a web component must consist of a single reference.  The most natural thing for a web component like this would be for that initial  definition to be in an HTML file, which can immediately display the original board, and which would then download the JS in preparation for the second board.  But browser vendors aren't looking out for people like Tiny Tim, so we must make the web component load JS first.  At least I don't see a way to make this HTML first, as it ought to be, with existing standards.

In order to provide the quickest visual, our web component, chess-board.js (say) can do the following:

<!-- 1.  Dynamically, asynchronously reference templ-mount/templ-mount.js, which will start downloading templates as needed, if they contain the import href attributes.
2.  Append (and hold on to a reference for) a template tag to document.body which points to the HTML for the original board via import href="chessboard.html".  templ-mount will begin the download for this template as soon as it is downloaded (~886 Bytes gzipped/compressed).  The url for the HTML file can be relative to chess-board.js, based on import.meta.url. -->

Server-render the original chessboard inside a templ-mount tag.  Use https://github.com/bahrus/nomodule

```html
<body>
    ...
    <templ-mount>
        <table id=chessboard>
        ...
        </table>
    </templ-mount>
    <template>
        <chess-board moves="1.Nf3 d5 2.d4 c6 3.c4 e6 4.Nbd2 Nf6 5.e3 Nbd7 6.Bd3 Bd6 7.e4 dxe4 8.Nxe4 Nxe4"></chess-board>
    </template>
    <script nomodule type="module ish" src="myHeavyLifting.js"></script>

    ...
</body>
```
myHeavyLifting.js gets a reference to the template via:

```JavaScript
const scriptTag = window['2071aa02-e277-47f7-882a-a5a7c6218d4d'];
const templMount = scriptTag.previousElementSibling;
if(templMount.loaded){
    define();
}else{
    templMount.addEventListener('load', e => define());
}
class Chessboard extends HTMLElement{
    ...
    this[shadowRoot].appendChild(templMount.template);
}
...
function define(){
    templMount.switchTo('chess-board');
    customElements.define('chess-board', Chessboard);
}

```

switchTo deletes the innerHTML inside templ-mount, and inserts

What we need is a way of "flipping" a DOM element into a custom element

```html
    <chess-board></chess-board>
    <delete-when-previous-sibling-is-defined></delete-when-previous-sibling-is-defined>
    <table id=chessboard>
    ...
    </table>
```

# Viewing This Element Locally

```
$ npm install
$ npm run serve
```

#  Testing 

```
$ npm run test
```
 

