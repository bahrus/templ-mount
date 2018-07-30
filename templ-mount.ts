import {ICEParams, loadTemplate} from './first-templ.js';

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
        for(const externalRefTemplate  of from.querySelectorAll('template[data-src]')){
            const ds = (<HTMLElement>externalRefTemplate).dataset;
            const ua = ds.ua;
            if(ua && navigator.userAgent.indexOf(ua) === -1) return;
            if(!ds.dumped){
                document.head.appendChild((<HTMLTemplateElement>externalRefTemplate).content.cloneNode(true));
                ds.dumped = 'true';
            }
            loadTemplate(externalRefTemplate as HTMLTemplateElement);
        }

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
