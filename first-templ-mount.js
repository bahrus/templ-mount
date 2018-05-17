
//@ts-check
(function () {
const _cachedTemplates = {};
const fetchInProgress = {};
function loadTemplate(template, params) {
    const src = template.dataset.src;
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
                credentials: 'include'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
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
        if (params)
            customElements.define(params.tagName, params.cls);
    }
}
function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
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
        // if(parent.nodeType !== 11){
        //     return;
        // }
    }
    loadTemplates(from) {
        qsa('template[data-src]', from).forEach(externalRefTemplate => {
            loadTemplate(externalRefTemplate);
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
                        loadTemplate(node);
                });
            });
        });
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
if (!customElements.get(TemplMount.is)) {
    customElements.define(TemplMount.is, TemplMount);
}
//# sourceMappingURL=templ-mount.js.map
})();  
    