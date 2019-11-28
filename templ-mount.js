const href = 'href';
export const imp_t = 'imp-t';
export class TemplMount extends HTMLElement {
    constructor() {
        super(...arguments);
        this._imp_t = false;
        this._tot = -1;
    }
    static get observedAttributes() {
        return [href, imp_t];
    }
    static template(href, tm) {
        return new Promise((resolve, reject) => {
            const temp = this._templates[href];
            if (temp === true) {
                window.addEventListener(href + '-ready-tm', e => {
                    const a = e;
                    if (a.detail && a.detail.template) {
                        resolve(a.detail.template);
                    }
                    else {
                        reject();
                    }
                }, {
                    once: true
                });
            }
            else if (temp !== undefined) {
                resolve(temp);
            }
            else {
                this._templates[href] = true;
                this.load(href, tm);
            }
        });
    }
    static async load(href, tm) {
        try {
            const resp = await fetch(href);
            // if(resp.type.indexOf('text/html') === -1){
            //     console.error("wrong mime type");
            //     window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
            //         bubbles: false,
            //     }))
            //     return;
            // }
            const txt = await resp.text();
            const templ = document.createElement('template');
            templ.innerHTML = txt;
            this._templates[href] = templ;
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
                detail: {
                    template: templ
                }
            }));
        }
        catch (e) {
            console.error(e);
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
            }));
        }
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case href:
                if (nv[0] === '[') {
                    this._href = JSON.parse(nv);
                }
                else {
                    this._href = nv;
                }
                break;
            case imp_t:
                this._imp_t = nv !== null;
                break;
        }
    }
    get impT() {
        return this._imp_t;
    }
    set impT(nv) {
        if (nv) {
            this.setAttribute(imp_t, '');
        }
        else {
            this.removeAttribute(imp_t);
        }
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        if (Array.isArray(nv)) {
            this.setAttribute(href, JSON.stringify(nv));
        }
        else {
            this.setAttribute(href, nv);
        }
    }
    async connectedCallback() {
        if (!this._imp_t)
            this.style.display = 'none';
        this.load();
        const { SecondTempl } = await import('./first-templ.js');
        const sec = new SecondTempl(this);
    }
    async load() {
        if (this._href === undefined)
            return;
        const hrefs = Array.isArray(this._href) ? this._href : [this._href];
        this._tot = hrefs.length;
        for (const href of hrefs) {
            //TemplMount.load(href, this);
            this.loadh(href);
        }
    }
    async loadh(href) {
        await TemplMount.load(href, this);
        this._tot--;
        if (this._tot === 0) {
            if (this._imp_t) {
                if (this.shadowRoot === null) {
                    this.attachShadow({
                        mode: 'open'
                    });
                }
                const hrefs = Array.isArray(this._href) ? this._href : [this._href];
                hrefs.forEach(href => {
                    const clone = TemplMount._templates[href].content.cloneNode(true);
                    this.shadowRoot.appendChild(clone);
                });
            }
        }
    }
}
TemplMount._templates = {};
customElements.define('templ-mount', TemplMount);
