const root = Symbol();
/**
 * templ-mount helps load templates from url's, which point to HTML files or streams.
 * @element templ-mount
 */
export class TemplMount extends HTMLElement {
    constructor() {
        // static get observedAttributes(){
        //     return [import_key];
        // }
        super(...arguments);
        // attributeChangedCallback(n: string, ov: string, nv: string){
        //     switch(n){
        //         case import_key:
        //             this._importKey = nv;
        //             break;
        //     }
        // }
        this._importKey = 'imp-key';
    }
    static template(href, options) {
        return new Promise((resolve, reject) => {
            if (href === null || options.template.hasAttribute('when-needed')) {
                resolve(null);
                return;
            }
            const temp = this._templateStrings[href];
            if (temp === true) {
                this.waitForIt(href, resolve, reject, options);
            }
            else if (temp !== undefined) {
                this.loadLocalTemplate(temp, options);
                resolve(temp);
            }
            else {
                this._templateStrings[href] = true;
                this.waitForIt(href, resolve, reject, options);
                this.load(href, options);
            }
        });
    }
    static waitForIt(href, resolve, reject, options) {
        window.addEventListener(href + '-ready-tm', e => {
            const a = e;
            if (a.detail && a.detail.template) {
                if (!a.detail.template.hasAttribute('loaded')) {
                    this.loadLocalTemplate(a.detail.template, options);
                }
                resolve(a.detail.template);
            }
            else {
                reject();
            }
        }, {
            once: true
        });
    }
    static loadLocalTemplate(templateString, options) {
        const template = options.template;
        //        if(!template.hasAttribute('loaded')){
        template.innerHTML = templateString;
        template.setAttribute('loaded', '');
        template.dispatchEvent(new CustomEvent('load', {
            bubbles: true,
        }));
        //        }
    }
    static async load(href, options) {
        try {
            const t = options.template;
            const customEvent = new CustomEvent(href + '-ready-tm', {
                bubbles: false,
                detail: {
                    template: t
                }
            });
            const init = t.hasAttribute('request-init') ? JSON.parse(t.getAttribute('request-init')) : {};
            options.template.removeAttribute('href');
            options.template.setAttribute('last-href', href);
            const resp = await fetch(href, init);
            let txt = await resp.text();
            if (t.hasAttribute('snip')) {
                const split = txt.split('<!---->');
                if (split.length > 1) {
                    txt = split[1];
                }
            }
            this._templateStrings[href] = txt;
            this.loadLocalTemplate(txt, options);
            window.dispatchEvent(customEvent);
        }
        catch (e) {
            console.error(e);
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
            }));
        }
    }
    // get importKey(){
    //     return this._importKey;
    // }
    // /**
    //  * Set the key to use to import templates.
    //  * @attr import-key
    //  */
    // set importKey(nv: string){
    //     this.setAttribute(import_key, nv);
    // }
    async connectedCallback() {
        this.style.display = 'none';
        this.loadFirstTempl();
        this.loadSecondTempl();
        if (self[root] === undefined) {
            self[root] = true;
            Array.from(document.querySelectorAll('import[import][href]')).forEach(el => {
                const templ = el;
                const options = {
                    template: templ,
                    tm: this
                };
                TemplMount.template(templ.getAttribute('href'), options);
            });
        }
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
TemplMount._templateStrings = {}; //store in session storage?
customElements.define('templ-mount', TemplMount);
const tm = document.createElement('templ-mount');
document.head.appendChild(tm);
