import { ICEParams, loadTemplate } from './first-templ.js';

export function qsa(css, from?: HTMLElement | Document | DocumentFragment): HTMLElement[] {
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
export class TemplMount extends HTMLElement {
    static get is() { return 'templ-mount'; }
    static _adgc = false; //already did global check
    constructor() {
        super();
        if (!TemplMount._adgc) {
            TemplMount._adgc = true;
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.mhft();
                    this.ltosd();
                });
            } else {
                this.mhft();
            }

        }


    }
    /**
     * Gets host from parent
     */
    getHost() {
        return this.parentNode as DocumentFragment;
    }
    copyAttrs(src: HTMLScriptElement, dest: HTMLScriptElement, attrs: string[]){
        attrs.forEach(attr =>{
            if(src.hasAttribute(attr)) dest.setAttribute(attr, src.getAttribute(attr));
        })
    }
    cloneTags(clonedNode: DocumentFragment, tagName: string, copyAttrs: string[]){
        qsa(tagName, clonedNode).forEach(node =>{
            //node.setAttribute('clone-me', '');
            const clone = document.createElement(tagName) as HTMLScriptElement;
            this.copyAttrs(node as HTMLScriptElement, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        })    
    }
    initTemplate(template: HTMLTemplateElement) {
        const ds = (<HTMLElement>template).dataset;
        const ua = ds.ua;
        let noMatch = false;
        if(ua){
            noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }
        if(ua && template.hasAttribute('data-exclude')) noMatch = !noMatch;
        if (ua && noMatch) return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = (<HTMLTemplateElement>template).content.cloneNode(true) as DocumentFragment;
            this.cloneTags(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cloneTags(clonedNode, 'template', ['data-src', 'href', 'data-activate'])
            ds.dumped = 'true';
        }
        loadTemplate(template as HTMLTemplateElement, {
            noSnip: template.hasAttribute('nosnip'),
        });
    }


    /**
     * 
     * @param from
     */
    lt(from: DocumentFragment) { //load template
        qsa('template[data-src],template[data-activate]', from).forEach((t: HTMLTemplateElement) => {
            this.initTemplate(t);
        })

    }
    ltosd() { //load template outside shadow dom
        this.lt(document);
    }
    ltisd() { //load template inside shadow dom
        const host = this.getHost();
        if (!host) return;
        this.lt(host);
    }
    _observer: MutationObserver;
    mhft() { //monitof head for templates
        const config = { childList: true };
        this._observer = new MutationObserver((mutationsList: MutationRecord[]) => {
            mutationsList.forEach(mutationRecord => {
                mutationRecord.addedNodes.forEach((node: HTMLElement) => {
                    if (node.tagName === 'TEMPLATE') this.initTemplate(node as HTMLTemplateElement);
                })
            })
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback() {
        this.ltisd();
        this.ltosd();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.ltisd();
            });
        }
    }
    
}
customElements.define(TemplMount.is, TemplMount);
