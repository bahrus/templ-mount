import { CssObserve } from 'css-observe/css-observe.js';
import { TemplMount } from './templ-mount.js';
import { getShadowContainer } from 'xtal-element/getShadowContainer.js';
const listening = Symbol();
const imp_t = 'imp-t';
const limp_t = 'limp-t';
export class FirstTempl {
    constructor(tm) {
        this.tm = tm;
        const shadowContainer = getShadowContainer(tm);
        if (shadowContainer[listening] === true)
            return;
        shadowContainer[listening] = true;
        const templateObserver = document.createElement(CssObserve.is);
        templateObserver.observe = true;
        templateObserver.selector = "template[href],template[as]";
        templateObserver.customStyles = `
            template[href],template[as]{
                display:block;
            }
            template[href][loaded],template[as][loaded]{
                display:none;
            }
        `;
        templateObserver.addEventListener('latest-match-changed', e => {
            const t = e.detail.value;
            const href = t.getAttribute('href');
            if (href !== null) {
                TemplMount.template(href, {
                    tm: this.tm,
                    template: t
                });
                this.subscribeToHref(href);
            }
        });
        this.tm.appendChild(templateObserver);
    }
    async callback(entries, observer) {
        const first = entries[0];
        if (first.intersectionRatio > 0) {
            const newlyVisibleElement = first.target;
            const templURL = newlyVisibleElement.getAttribute('href');
            const template = await TemplMount.template(templURL, { tm: this.tm });
            const clone = template.content.cloneNode(true);
            if (newlyVisibleElement.hasAttribute(limp_t)) {
                newlyVisibleElement.appendChild(clone);
            }
            else {
                if (newlyVisibleElement.shadowRoot === null) {
                    newlyVisibleElement.attachShadow({ mode: 'open' });
                }
                newlyVisibleElement.shadowRoot.appendChild(clone);
            }
        }
    }
    subscribeToHref(href) {
        const impTObserver = document.createElement(CssObserve.is);
        impTObserver.observe = true;
        impTObserver.selector = `[href="${href}"][${imp_t}],[href="${href}"][${limp_t}]`;
        impTObserver.addEventListener('latest-match-changed', e => {
            TemplMount.template(href, {
                tm: this.tm,
            }).then(val => {
                const ioi = {
                    threshold: 0.01
                };
                const observer = new IntersectionObserver(this.callback.bind(this), ioi);
                observer.observe(e.detail.value);
                //(<any>e).detail.value.appendChild((<any>val).content.cloneNode(true));
            });
        });
        this.tm.appendChild(impTObserver);
    }
}
