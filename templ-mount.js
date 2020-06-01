//const import_key = 'import-key';
const root = Symbol();
/**
 * templ-mount helps load templates from url's, which point to HTML files or streams.
 * @element templ-mount
 */
let TemplMount = /** @class */ (() => {
    class TemplMount extends HTMLElement {
        constructor() {
            super(...arguments);
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
                    this.swapAttr(options.template, href);
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
            template.innerHTML = templateString;
            template.loaded = true;
            template.setAttribute('loaded', '');
            options.tm.emit(template, 'load', {});
        }
        //https://gist.github.com/GuillaumeJasmin/9119436
        static extract(s, prefix, suffix) {
            let i = s.indexOf(prefix);
            let returnStr;
            if (i >= 0) {
                returnStr = s.substring(i + prefix.length);
            }
            else {
                return '';
            }
            if (suffix) {
                i = returnStr.indexOf(suffix);
                if (i >= 0) {
                    return s.substring(0, i);
                }
                else {
                    return returnStr;
                }
            }
            return s;
        }
        ;
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
                this.swapAttr(t, href);
                if (options.target !== undefined && t.hasAttribute('stream')) {
                    const { streamOrator, TemplateProcessor } = await import('stream-orator/stream-orator.js');
                    await streamOrator(href, init, options.target, new TemplateProcessor(t));
                    options.tm.emit(options.target, 'stream-complete', { template: options.template });
                    this.loadLocalTemplate(options.target.innerHTML, options);
                }
                else {
                    const resp = await fetch(href, init);
                    let txt = await resp.text();
                    const snip = t.getAttribute('snip');
                    if (snip !== null) {
                        if (snip.startsWith('{')) {
                            const snipInstructions = JSON.parse(snip);
                            txt = this.extract(txt, snipInstructions.lhs, snipInstructions.rhs);
                        }
                        else {
                            const split = txt.split('<!---->');
                            if (split.length > 1) {
                                txt = split[1];
                            }
                        }
                    }
                    this._templateStrings[href] = txt;
                    this.loadLocalTemplate(txt, options);
                }
                window.dispatchEvent(customEvent);
            }
            catch (e) {
                console.error(e);
                window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                    bubbles: false,
                }));
            }
        }
        static swapAttr(templ, href) {
            templ.removeAttribute('href');
            templ.setAttribute('last-href', href);
        }
        async connectedCallback() {
            this.style.display = 'none';
            const ft = await this.loadFirstTempl();
            this.loadSecondTempl();
            if (self[root] === undefined) {
                self[root] = true;
                Array.from(document.querySelectorAll('template[import][href]')).forEach(el => {
                    const templ = el;
                    const options = {
                        template: templ,
                        tm: this
                    };
                    TemplMount.template(templ.getAttribute('href'), options);
                    // const {FirstTempl} = await import('./first-templ.js');
                    ft.watchElVisibility(templ.getAttribute('as'), templ.getAttribute('href'), templ);
                });
            }
        }
        async loadFirstTempl() {
            const { FirstTempl } = await import('./first-templ.js');
            const ft = new FirstTempl(this);
            return ft;
        }
        async loadSecondTempl() {
            const { SecondTempl } = await import('./second-templ.js');
            new SecondTempl(this);
        }
        emit(src, type, detail) {
            src.dispatchEvent(new CustomEvent(type, {
                bubbles: true,
                detail: detail
            }));
        }
    }
    TemplMount._templateStrings = {}; //store in session storage?
    return TemplMount;
})();
export { TemplMount };
customElements.define('templ-mount', TemplMount);
const tm = document.createElement('templ-mount');
document.head.appendChild(tm);
