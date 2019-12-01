const import_key = 'import-key';
export class TemplMount extends HTMLElement {
    constructor() {
        super(...arguments);
        this._importKey = 'imp-t';
    }
    static get observedAttributes() {
        return [import_key];
    }
    static template(href, options) {
        return new Promise((resolve, reject) => {
            const temp = this._templates[href];
            if (temp === true) {
                this.waitForIt(href, resolve, reject, options);
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
            const template = options.template;
            template.innerHTML = temp.html; //TODO: add/override property "content" to get content from global cache?
            //Do we really need to create innerHTML other than for debugging purposes?
            template.setAttribute('loaded', '');
            template.dispatchEvent(new CustomEvent('load', {
                bubbles: true,
            }));
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
            case import_key:
                this._importKey = nv;
                break;
        }
    }
    get importKey() {
        return this._importKey;
    }
    set importKey(nv) {
        this.setAttribute(import_key, nv);
    }
    async connectedCallback() {
        this.style.display = 'none';
        this.loadFirstTempl();
        this.loadSecondTempl();
    }
    async loadFirstTempl() {
        const { FirstTempl } = await import('./first-templ.js');
        new FirstTempl(this);
    }
    async loadSecondTempl() {
        const { SecondTempl } = await import('./second-templ.js');
        new SecondTempl(this);
    }
}
TemplMount._templates = {};
customElements.define('templ-mount', TemplMount);
