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
    static _alreadyDidGlobalCheck = false;
    constructor() {
        super();
        if (!TemplMount._alreadyDidGlobalCheck) {
            TemplMount._alreadyDidGlobalCheck = true;
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.monitorHeadForTemplates();
                    this.loadTemplatesOutsideShadowDOM();
                });
            } else {
                this.monitorHeadForTemplates();
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
        let noMatch = navigator.userAgent.indexOf(ua) === -1;
        if(ua && ua[0]==='!') noMatch = !noMatch;
        if (ua && noMatch) return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = (<HTMLTemplateElement>template).content.cloneNode(true) as DocumentFragment;
            this.cloneTags(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cloneTags(clonedNode, 'template', ['data-src', 'href', 'data-activate'])
            ds.dumped = 'true';
        }
        loadTemplate(template as HTMLTemplateElement);
    }


    /**
     * 
     * @param from
     */
    loadTemplates(from: DocumentFragment) {
        qsa('template[data-src],template[data-activate]', from).forEach((externalRefTemplate: HTMLTemplateElement) => {
            this.initTemplate(externalRefTemplate);
        })

    }
    loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
    }
    loadTemplateInsideShadowDOM() {
        const host = this.getHost();
        if (!host) return;
        this.loadTemplates(host);
    }
    _observer: MutationObserver;
    monitorHeadForTemplates() {
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
        this.loadTemplateInsideShadowDOM();
        this.loadTemplatesOutsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplateInsideShadowDOM();
            });
        }
    }
    
}
customElements.define(TemplMount.is, TemplMount);
