import {CssObserve} from 'css-observe/css-observe.js';
import {TemplMount} from './templ-mount.js'; 
import {getShadowContainer} from 'xtal-element/getShadowContainer.js'; 
const listening = Symbol();
export class SecondTempl{
    constructor(public tm: TemplMount){
        const shadowContainer = getShadowContainer(tm);
        if(shadowContainer[listening] === true) return;
        shadowContainer[listening] = true;
        const templateObserver = document.createElement(CssObserve.is) as CssObserve;
        templateObserver.observe = true;
        templateObserver.selector = "template[append-to-head]";
        templateObserver.customStyles = `
            template[append-to-head]{
                display:block;
            }
        `;
        templateObserver.addEventListener('latest-match-changed', e =>{
            const t = (<any>e).detail.value as HTMLTemplateElement;
            const clonedNode = t.content.cloneNode(true) as DocumentFragment;
            this.cloneTemplate(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cloneTemplate(clonedNode, 'style', []);
        });
        tm.appendChild(templateObserver);
    }

    copyAttrs(src: HTMLScriptElement, dest: HTMLScriptElement, attrs: string[]){
        attrs.forEach(attr =>{
            if(!src.hasAttribute(attr)) return;
            let attrVal = src.getAttribute(attr);
            dest.setAttribute(attr, attrVal);
        })
    }

    cloneTemplate(clonedNode: DocumentFragment, tagName: string, copyAttrs: string[]){ 
        Array.from(clonedNode.querySelectorAll(tagName)).forEach(node =>{
            const clone = document.createElement(tagName) as HTMLScriptElement;
            this.copyAttrs(node as HTMLScriptElement, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        })
    
    }
}