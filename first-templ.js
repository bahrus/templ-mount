import { CssObserve } from 'css-observe/css-observe.js';
import { TemplMount } from './templ-mount.js';
export class FirstTempl {
    constructor(tm) {
        this.tm = tm;
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
                const impTObserver = document.createElement(CssObserve.is);
                impTObserver.observe = true;
                impTObserver.selector = `[imp-t="${href}"],[imp-t-light="${href}"]`;
                impTObserver.addEventListener('latest-match-changed', e => {
                    TemplMount.template(href, {
                        tm: this.tm,
                        template: t
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
        });
        this.tm.appendChild(templateObserver);
    }
    async callback(entries, observer) {
        const first = entries[0];
        if (first.intersectionRatio > 0) {
            const templURL = first.target.getAttribute('imp-t');
            const template = await TemplMount.template(templURL, { tm: this.tm });
            first.target.appendChild(template.content.cloneNode(true));
        }
    }
}
