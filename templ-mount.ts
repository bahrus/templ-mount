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
        const parent = this.parentNode as HTMLElement;
        return parent['host'];
    }

    initTemplate(template: HTMLTemplateElement) {
        const ds = (<HTMLElement>template).dataset;
        const ua = ds.ua;
        let noMatch = navigator.userAgent.indexOf(ua) === -1;
        if(ua[0]==='!') noMatch = !noMatch;
        if (ua && noMatch) return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = (<HTMLTemplateElement>template).content.cloneNode(true);
            const inner = (<any>clonedNode).children;
            for (let i = 0, ii = inner.length; i < ii; i++) {
                const child = inner[i];
                if (!child) continue;
                switch (child.tagName) {
                    case 'SCRIPT':
                        const clone = document.createElement(child.tagName);
                        clone.src = child.src;
                        clone.type = child.type;
                        document.head.appendChild(clone);
                    default:
                    //document.head.appendChild(child);
                }

            }
            document.head.appendChild(clonedNode);
            ds.dumped = 'true';
        }
        loadTemplate(template as HTMLTemplateElement);
    }

    dumpChildren(templClone: any) {

    }

    /**
     * 
     * @param from
     */
    loadTemplates(from: DocumentFragment) {
        qsa('template[data-src]', from).forEach((externalRefTemplate: HTMLTemplateElement) => {
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
