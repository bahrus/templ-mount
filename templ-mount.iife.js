
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
class TemplMount extends HTMLElement {
    constructor() {
        super();
        if (!TemplMount._alreadyDidGlobalCheck) {
            TemplMount._alreadyDidGlobalCheck = true;
            this.loadTemplatesOutsideShadowDOM();
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.loadTemplatesOutsideShadowDOM();
                    this.monitorHeadForTemplates();
                });
            }
            else {
                this.monitorHeadForTemplates();
            }
        }
    }
    static get is() { return 'templ-mount'; }
    getHost() {
        const parent = this.parentNode;
        return parent['host'];
    }
    loadTemplates(from) {
        for (const externalRefTemplate of from.querySelectorAll('template[data-src]')) {
            const ds = externalRefTemplate.dataset;
            const ua = ds.ua;
            if (ua && navigator.userAgent.indexOf(ua) === -1)
                return;
            if (!ds.dumped) {
                document.head.appendChild(externalRefTemplate.content.cloneNode(true));
                ds.dumped = 'true';
            }
            loadTemplate(externalRefTemplate);
        }
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
                        loadTemplate(node);
                });
            });
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback() {
        this.loadTemplateInsideShadowDOM();
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
        