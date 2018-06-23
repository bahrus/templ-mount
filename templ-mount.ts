import {ICEParams, loadTemplate} from './first-templ.js';

// const _cachedTemplates : {[key:string] : string} = {};
// const fetchInProgress : {[key:string] : boolean} = {};

export function qsa(css, from?: HTMLElement | Document | DocumentFragment) : HTMLElement[]{
    return  [].slice.call((from ? from : this).querySelectorAll(css));
}
export class TemplMount extends HTMLElement{
    static get is(){return 'templ-mount';}
    static _alreadyDidGlobalCheck = false;
    constructor() {
        super();
        if(!TemplMount._alreadyDidGlobalCheck){
            TemplMount._alreadyDidGlobalCheck = true;
            this.loadTemplatesOutsideShadowDOM();
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.loadTemplatesOutsideShadowDOM();
                    this.monitorHeadForTemplates();
                });
            }else{
                this.monitorHeadForTemplates();
            }
        }
        

    }

    getHost(){
        const parent = this.parentNode as HTMLElement;
        return parent['host'];
        
        
    }
    loadTemplates(from: DocumentFragment){
        qsa('template[data-src]', from).forEach((externalRefTemplate : HTMLTemplateElement) =>{
            const ds = externalRefTemplate.dataset;
            const ua = ds.ua;
            if(ua && navigator.userAgent.indexOf(ua) === -1) return;
            if(!ds.dumped){
                document.head.appendChild(externalRefTemplate.content.cloneNode(true));
                ds.dumped = 'true';
            }
            loadTemplate(externalRefTemplate as HTMLTemplateElement);
        })
    }
    loadTemplatesOutsideShadowDOM(){
        this.loadTemplates(document);
    }
    loadTemplateInsideShadowDOM(){
        const host = this.getHost();
        if(!host) return;
        this.loadTemplates(host);
    }
    _observer: MutationObserver;
    monitorHeadForTemplates(){
        const config = { childList: true};
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            mutationsList.forEach(mutationRecord =>{
                mutationRecord.addedNodes.forEach((node: HTMLElement) =>{
                    if(node.tagName === 'TEMPLATE') loadTemplate(node as HTMLTemplateElement);
                })
            })
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback(){
        this.loadTemplateInsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplateInsideShadowDOM();
            });
        }
    }
}
if(!customElements.get(TemplMount.is)){
    customElements.define(TemplMount.is, TemplMount);
}
