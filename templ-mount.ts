import { ICEParams, loadTemplate } from './first-templ.js';
import {qsa} from 'xtal-latx/qsa.js';

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
            if(!src.hasAttribute(attr)) return;
            let attrVal = src.getAttribute(attr);
            if(attr==='type') attrVal = attrVal.replace(':','');
            dest.setAttribute(attr, attrVal);
        })
    }
    get doc(){
        if(this.hasAttribute('target-top')){
            return window.top.document;
        }
        return document;
    }
    cT(clonedNode: DocumentFragment, tagName: string, copyAttrs: string[]){ //clone Tags
        const doc = this.doc;
        qsa(tagName, clonedNode).forEach(node =>{
            //node.setAttribute('clone-me', '');
            const clone = doc.createElement(tagName) as HTMLScriptElement;
            this.copyAttrs(node as HTMLScriptElement, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            doc.head.appendChild(clone);
        })    
    }
    iT(template: HTMLTemplateElement) { //init Template
        const ds = (<HTMLElement>template).dataset;
        const ua = ds.ua;
        let noMatch = false;
        if(ua){
            noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }
        if(ua && template.hasAttribute('data-exclude')) noMatch = !noMatch;
        if (ua && noMatch) return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome (and other browsers) doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = (<HTMLTemplateElement>template).content.cloneNode(true) as DocumentFragment;
            this.cT(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cT(clonedNode, 'template', ['id', 'data-src', 'href', 'data-activate', 'data-ua', 'data-exclude', 'data-methods'])
            this.cT(clonedNode, 'c-c', ['from', 'noshadow', 'copy'])
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
    lt(from: DocumentFragment) { //load templates
        qsa('template[data-src],template[data-activate]', from).forEach((t: HTMLTemplateElement) => {
            this.iT(t);
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
        this._observer = new MutationObserver((mL: MutationRecord[]) => {
            mL.forEach(mR => {
                mR.addedNodes.forEach((node: HTMLElement) => {
                    if (node.tagName === 'TEMPLATE') this.iT(node as HTMLTemplateElement);
                })
            })
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
customElements.define(TemplMount.is, TemplMount);
