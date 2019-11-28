import { loadTemplate } from './first-templ.js';
import { qsa } from 'xtal-latx/qsa.js';
/**
* `templ-mount`
* Dependency free web component that loads templates from data-src (optionally href) attribute
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class TemplMount extends HTMLElement {
    constructor() {
        super();
        if (!TemplMount._adgc) {
            TemplMount._adgc = true;
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.mhft();
                    this.ltosd();
                });
            }
            else {
                this.mhft();
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
    copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            let attrVal = src.getAttribute(attr);
            if (attr === 'type')
                attrVal = attrVal.replace(':', '');
            dest.setAttribute(attr, attrVal);
        });
    }
    get doc() {
        if (this.hasAttribute('target-top')) {
            return window.top.document;
        }
        return document;
    }
    cT(clonedNode, tagName, copyAttrs) {
        const doc = this.doc;
        qsa(tagName, clonedNode).forEach(node => {
            //node.setAttribute('clone-me', '');
            const clone = doc.createElement(tagName);
            this.copyAttrs(node, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            doc.head.appendChild(clone);
        });
    }
    iT(template) {
        const ds = template.dataset;
        const ua = ds.ua;
        let noMatch = false;
        if (ua) {
            noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }
        if (ua && template.hasAttribute('data-exclude'))
            noMatch = !noMatch;
        if (ua && noMatch)
            return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome (and other browsers) doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = template.content.cloneNode(true);
            this.cT(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cT(clonedNode, 'template', ['id', 'data-src', 'href', 'data-activate', 'data-ua', 'data-exclude', 'data-methods']);
            this.cT(clonedNode, 'c-c', ['from', 'noshadow', 'copy']);
            ds.dumped = 'true';
        }
        loadTemplate(template, {
            noSnip: template.hasAttribute('nosnip'),
        });
    }
    /**
     *
     * @param from
     */
    lt(from) {
        qsa('template[data-src],template[data-activate]', from).forEach((t) => {
            this.iT(t);
        });
    }
    ltosd() {
        this.lt(document);
    }
    ltisd() {
        const host = this.getHost();
        if (!host)
            return;
        this.lt(host);
    }
    mhft() {
        const config = { childList: true };
        this._observer = new MutationObserver((mL) => {
            mL.forEach(mR => {
                mR.addedNodes.forEach((node) => {
                    if (node.tagName === 'TEMPLATE')
                        this.iT(node);
                });
            });
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback() {
        this.style.display = 'none';
        this.ltisd();
        this.ltosd();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.ltisd();
            });
        }
    }
}
TemplMount._adgc = false; //already did global check
customElements.define(TemplMount.is, TemplMount);