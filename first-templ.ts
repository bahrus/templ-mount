import {CssObserve} from 'css-observe/css-observe.js';
import {TemplMount} from './templ-mount.js'; 
import {getShadowContainer} from 'xtal-element/getShadowContainer.js'; 
const listening = Symbol();
export class FirstTempl{
    async callback(entries: any, observer: any){
        const first = entries[0];
        if(first.intersectionRatio > 0){
            const templURL = first.target.getAttribute('href');
            const template = await TemplMount.template(templURL, {tm: this.tm}) as HTMLTemplateElement;
            first.target.appendChild(template.content.cloneNode(true));
        }
    }
    subscribeToHref(href){
        const impTObserver = document.createElement(CssObserve.is) as CssObserve;
        impTObserver.observe = true;
        impTObserver.selector = `[href="${href}"][imp-t],[href="${href}"][imp-t-light]`;
        impTObserver.addEventListener('latest-match-changed', e =>{
            TemplMount.template(href, {
                tm: this.tm,
            }).then(val =>{
                const ioi : IntersectionObserverInit = {
                    threshold: 0.01
                };
                const observer = new IntersectionObserver(this.callback.bind(this), ioi);
                observer.observe((<any>e).detail.value);
                //(<any>e).detail.value.appendChild((<any>val).content.cloneNode(true));
            })
            
        });
        this.tm.appendChild(impTObserver);
    }
    constructor(public tm: TemplMount){
        const shadowContainer = getShadowContainer(tm);
        if(shadowContainer[listening] === true) return;
        shadowContainer[listening] = true;
        const templateObserver = document.createElement(CssObserve.is) as CssObserve;
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
        templateObserver.addEventListener('latest-match-changed', e =>{
            const t = (<any>e).detail.value as HTMLTemplateElement;
            const href = t.getAttribute('href');
            if(href !== null){
                TemplMount.template(href, {
                    tm: this.tm,
                    template: t   
                });
                this.subscribeToHref(href);
            }

        });
        this.tm.appendChild(templateObserver);

    }


}