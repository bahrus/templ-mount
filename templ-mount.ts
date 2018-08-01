import {ICEParams, loadTemplate} from './first-templ.js';

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
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.monitorHeadForTemplates();
                    this.loadTemplatesOutsideShadowDOM();
                });
            }else{
                this.monitorHeadForTemplates();
                this.loadTemplatesOutsideShadowDOM();
            }
            
        }
        

    }
    /**
     * Gets host from parent
     */
    getHost(){
        const parent = this.parentNode as HTMLElement;
        return parent['host'];
    }
    loadTemplates(from: DocumentFragment){
        qsa('template[data-src]', from).forEach((externalRefTemplate : HTMLTemplateElement) =>{
            const ds = (<HTMLElement>externalRefTemplate).dataset;
            const ua = ds.ua;
            if(ua && navigator.userAgent.indexOf(ua) === -1) return;
            if(!ds.dumped){
                document.head.appendChild((<HTMLTemplateElement>externalRefTemplate).content.cloneNode(true));
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
customElements.define(TemplMount.is, TemplMount);
