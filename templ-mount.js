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
    static template(href, options) {
        return new Promise((resolve, reject) => {
            const temp = this._templates[href];
            if (temp === true) {
                this.waitForIt(resolve, reject, options);
            }
            else if (temp !== undefined) {
                this.loadLocalTemplate(temp, options);
                resolve(temp);
            }
            else {
                this._templates[href] = true;
                this.waitForIt(href, resolve, reject, options);
                this.load(href, options);
            }
        });
    }
    static waitForIt(href, resolve, reject, options) {
        window.addEventListener(href + '-ready-tm', e => {
            const a = e;
            if (a.detail && a.detail.template) {
                this.loadLocalTemplate(a.detail.template, options);
                resolve(a.detail.template);
            }
            else {
                reject();
            }
        }, {
            once: true
        });
    }
    static loadLocalTemplate(temp, options) {
        if (options !== undefined && options.template && !options.template.hasAttribute('loaded')) {
            options.template.innerHTML = temp.html; //TODO: add/override property "content" to get content from global cache?
            //Do we really need to create innerHTML other than for debugging purposes?
        }
    }
    static async load(href, options) {
        try {
            const resp = await fetch(href);
            const txt = await resp.text();
            const templ = document.createElement('template');
            templ.innerHTML = txt;
            templ.html = txt;
            this._templates[href] = templ;
            this.loadLocalTemplate(templ, options);
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
        const { FirstTempl } = await import('./first-templ.js');
        const sec = new FirstTempl(this);
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
