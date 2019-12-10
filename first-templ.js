import { CssObserve } from 'css-observe/css-observe.js';
import { TemplMount } from './templ-mount.js';
import { getShadowContainer } from 'xtal-element/getShadowContainer.js';
const listening = Symbol();
const hrefSym = Symbol();
const hrefSym2 = Symbol();
export class FirstTempl {
    constructor(tm) {
        this.tm = tm;
        this._templateLookup = {};
        const shadowContainer = getShadowContainer(tm);
        if (shadowContainer[listening] === true)
            return;
        shadowContainer[listening] = true;
        const remoteTemplateObserver = document.createElement(CssObserve.is);
        remoteTemplateObserver.observe = true;
        remoteTemplateObserver.selector = "template[import][href][as]";
        remoteTemplateObserver.customStyles = /* css */ `
            template[import][as]{
                display:block;
            }
            template[import][as][loaded]:not({
                display:none;
            }
        `;
        remoteTemplateObserver.addEventListener('latest-match-changed', e => {
            const t = e.detail.value;
            const href = t.getAttribute('href');
            TemplMount.template(href, {
                tm: this.tm,
                template: t
            });
            const as = t.getAttribute('as');
            this.watchElVisibility(as, href, t);
        });
        this.tm.appendChild(remoteTemplateObserver);
        const localTemplateObserver = document.createElement(CssObserve.is);
        localTemplateObserver.observe = true;
        localTemplateObserver.selector = "template[import][as]:not([href]):not([last-href])";
        localTemplateObserver.addEventListener('latest-match-changed', e => {
            const t = e.detail.value;
            if (t.hasAttribute('href') || t.hasAttribute('last-href') || t.hasAttribute('loaded')) {
                return; //why is this necessary?
            }
            t.setAttribute('loaded', '');
            const as = t.getAttribute('as');
            this.watchElVisibility(as, null, t);
        });
        this.tm.appendChild(localTemplateObserver);
    }
    async callback(entries, observer) {
        const first = entries[0];
        if (first.intersectionRatio > 0) {
            const newlyVisibleElement = first.target;
            const alias = newlyVisibleElement.getAttribute(this.tm._importKey);
            const template = this._templateLookup[alias];
            let href = template.getAttribute('href') || template.getAttribute('last-href');
            if (href !== null) {
                template.removeAttribute('when-needed');
                await TemplMount.template(href, {
                    tm: this.tm,
                    template: template,
                });
            }
            else {
                href = 'none';
            }
            if (newlyVisibleElement[hrefSym2] === href)
                return; //why?
            newlyVisibleElement[hrefSym2] = href;
            const clone = template.content.cloneNode(true);
            if (template.hasAttribute('enable-filter')) {
                newlyVisibleElement.dispatchEvent(new CustomEvent('template-cloned', {
                    bubbles: true,
                    detail: {
                        clone: clone,
                        template: template
                    }
                }));
            }
            if (template.hasAttribute('without-shadow')) {
                newlyVisibleElement.innerHTML = '';
                newlyVisibleElement.appendChild(clone);
            }
            else {
                if (newlyVisibleElement.shadowRoot === null) {
                    newlyVisibleElement.attachShadow({ mode: 'open' });
                }
                newlyVisibleElement.shadowRoot.innerHTML = '';
                newlyVisibleElement.shadowRoot.appendChild(clone);
            }
            observer.disconnect();
        }
    }
    watchElVisibility(as, href, t) {
        this._templateLookup[as] = t;
        const selector = `[${this.tm._importKey}="${as}"]`;
        const alreadyExistingImpTObserver = this.tm.querySelector(`[as-q="${as}"]`);
        if (alreadyExistingImpTObserver !== null) {
            //alreadyExistingImpTObserver[hrefSym] = href;
            alreadyExistingImpTObserver.remove();
        }
        const impTObserver = document.createElement(CssObserve.is);
        impTObserver[hrefSym] = href;
        impTObserver.setAttribute('as-q', as);
        impTObserver.observe = true;
        impTObserver.selector = selector;
        impTObserver.addEventListener('latest-match-changed', e => {
            const elementToWatchForTurningVisible = e.detail.value;
            if (href === null) {
                const ioi = {
                    threshold: 0.01
                };
                const observer = new IntersectionObserver(this.callback.bind(this), ioi);
                observer.observe(elementToWatchForTurningVisible);
            }
            else {
                if (elementToWatchForTurningVisible[hrefSym] === e.target[hrefSym])
                    return;
                elementToWatchForTurningVisible[hrefSym] = href;
                TemplMount.template(href, {
                    tm: this.tm,
                    template: t,
                }).then(val => {
                    const ioi = {
                        threshold: 0.01
                    };
                    const observer = new IntersectionObserver(this.callback.bind(this), ioi);
                    observer.observe(elementToWatchForTurningVisible);
                });
            }
        });
        this.tm.appendChild(impTObserver);
    }
}
