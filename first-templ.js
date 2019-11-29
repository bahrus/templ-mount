import { CssObserve } from 'css-observe/css-observe.js';
import { TemplMount } from './templ-mount.js';
export class FirstTempl {
    constructor(tm) {
        this.tm = tm;
        const observer = document.createElement(CssObserve.is);
        observer.observe = true;
        observer.selector = "template";
        observer.customStyles = `
            template[href],template[as]{
                display:block;
            }
            template[href][loaded],template[as][loaded]{
                display:none;
            }
        `;
        observer.addEventListener('latest-match-changed', e => {
            const t = e.detail.value;
            const href = t.getAttribute('href');
            if (href !== null) {
                TemplMount.template(href, {
                    tm: this.tm,
                    template: t
                });
            }
        });
        this.tm.appendChild(observer);
    }
}
