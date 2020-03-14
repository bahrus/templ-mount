import { CssObserve } from 'css-observe/css-observe.js';
// import {getShadowContainer} from 'xtal-element/getShadowContainer.js'; 
const listening = Symbol();
const activatedIds = new Set();
export class SecondTempl {
    constructor(tm) {
        this.tm = tm;
        const shadowContainer = tm.getRootNode();
        if (shadowContainer[listening] === true)
            return;
        shadowContainer[listening] = true;
        const templateObserver = document.createElement(CssObserve.is);
        templateObserver.observe = true;
        templateObserver.selector = "template[append-to-head]";
        templateObserver.customStyles = `
            template[append-to-head]{
                display:block;
            }
        `;
        templateObserver.addEventListener('latest-match-changed', e => {
            const t = e.detail.value;
            if (t.id) {
                if (activatedIds.has(t.id))
                    return;
                activatedIds.add(t.id);
            }
            const clonedNode = t.content.cloneNode(true);
            this.cloneTemplate(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cloneTemplate(clonedNode, 'style', []);
        });
        tm.appendChild(templateObserver);
    }
    copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            let attrVal = src.getAttribute(attr);
            dest.setAttribute(attr, attrVal);
        });
    }
    cloneTemplate(clonedNode, tagName, copyAttrs) {
        Array.from(clonedNode.querySelectorAll(tagName)).forEach(node => {
            const clone = document.createElement(tagName);
            this.copyAttrs(node, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        });
    }
}
