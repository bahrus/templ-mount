
    //@ts-check
    (function () {
    const _cachedTemplates = {};
const fetchInProgress = {};
function loadTemplate(template, params) {
    const src = template.dataset.src || template.getAttribute('href');
    if (src) {
        if (_cachedTemplates[src]) {
            template.innerHTML = _cachedTemplates[src];
            if (params)
                customElements.define(params.tagName, params.cls);
        }
        else {
            if (fetchInProgress[src]) {
                if (params) {
                    setTimeout(() => {
                        loadTemplate(template, params);
                    }, 100);
                }
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'same-origin'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
                    if (params && params.preProcessor)
                        txt = params.preProcessor.process(txt);
                    const split = txt.split('<!---->');
                    if (split.length > 1) {
                        txt = split[1];
                    }
                    _cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    template.setAttribute('loaded', '');
                    if (params)
                        customElements.define(params.tagName, params.cls);
                });
            });
        }
    }
    else {
        if (params && params.tagName)
            customElements.define(params.tagName, params.cls);
    }
}
//# sourceMappingURL=first-templ.js.map
function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
/**
* `templ-mount`
* Dependency free web component that loads templates from data-src (optionally href) attribute
*
* @customElement
* @polymer
* @demo demo/index.html
*/
class TemplMount extends HTMLElement {
    constructor() {
        super();
        if (!TemplMount._alreadyDidGlobalCheck) {
            TemplMount._alreadyDidGlobalCheck = true;
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.monitorHeadForTemplates();
                    this.loadTemplatesOutsideShadowDOM();
                });
            }
            else {
                this.monitorHeadForTemplates();
            }
        }
    }
    static get is() { return 'templ-mount'; }
    /**
     * Gets host from parent
     */
    getHost() {
        return this.parentNode;
    }
    initTemplate(template) {
        const ds = template.dataset;
        const ua = ds.ua;
        let noMatch = navigator.userAgent.indexOf(ua) === -1;
        if (ua && ua[0] === '!')
            noMatch = !noMatch;
        if (ua && noMatch)
            return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = template.content.cloneNode(true);
            document.head.appendChild(clonedNode);
            ds.dumped = 'true';
        }
        loadTemplate(template);
    }
    /**
     *
     * @param from
     */
    loadTemplates(from) {
        qsa('template[data-src]', from).forEach((externalRefTemplate) => {
            this.initTemplate(externalRefTemplate);
        });
    }
    loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
    }
    loadTemplateInsideShadowDOM() {
        const host = this.getHost();
        if (!host)
            return;
        this.loadTemplates(host);
    }
    monitorHeadForTemplates() {
        const config = { childList: true };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutationRecord => {
                mutationRecord.addedNodes.forEach((node) => {
                    if (node.tagName === 'TEMPLATE')
                        this.initTemplate(node);
                });
            });
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback() {
        this.loadTemplateInsideShadowDOM();
        this.loadTemplatesOutsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplateInsideShadowDOM();
            });
        }
    }
}
TemplMount._alreadyDidGlobalCheck = false;
customElements.define(TemplMount.is, TemplMount);
//# sourceMappingURL=templ-mount.js.map
    })();  
        