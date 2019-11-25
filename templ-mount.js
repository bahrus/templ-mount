//import {CssObserve} from 'css-observe/css-observe.js';
const href = 'href';
export class TemplMount extends HTMLElement {
    static get observedAttributes() {
        return [href];
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case href:
                this._href = nv;
                break;
        }
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        this._href = nv;
    }
    async connectedCallback() {
        if (this._href) {
            const resp = await fetch(this._href);
            const txt = await resp.text();
            const templ = document.createElement('template');
            if (this.id !== '') {
                templ.id = this.id + '-mt';
            }
            templ.innerHTML = txt;
            this.appendChild(templ);
        }
    }
}
customElements.define('templ-mount', TemplMount);
