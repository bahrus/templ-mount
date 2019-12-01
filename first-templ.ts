import {CssObserve} from 'css-observe/css-observe.js';
import {TemplMount} from './templ-mount.js'; 
import {getShadowContainer} from 'xtal-element/getShadowContainer.js'; 
const listening = Symbol();
const hrefSym = Symbol();

export class FirstTempl{
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
                const as = t.getAttribute('as');
                if(as !== null){
                    this.subscribeToAs(as, href, t);
                }
                
            }

        });
        this.tm.appendChild(templateObserver);

    }

    async callback(entries: any, observer: any){
        const first = entries[0];
        if(first.intersectionRatio > 0){
            const newlyVisibleElement = first.target as HTMLElement;
            // const templURL = newlyVisibleElement[hrefSym];
            // const template = await TemplMount.template(templURL, {tm: this.tm}) as HTMLTemplateElement;
            const alias = newlyVisibleElement.getAttribute(this.tm._importKey);
            const template = this._templateLookup[alias];
            const clone = template.content.cloneNode(true);
            // if(template.hasAttribute()){
            //     newlyVisibleElement.appendChild(clone);
            // }else{
                if(newlyVisibleElement.shadowRoot === null){
                    newlyVisibleElement.attachShadow({mode: 'open'});
                }
                newlyVisibleElement.shadowRoot.appendChild(clone);
            //}
            observer.disconnect();
        }
    }

    _templateLookup : {[as: string]: HTMLTemplateElement} = {};
    subscribeToAs(as: string, href: string, t: HTMLTemplateElement){
        this._templateLookup[as] = t;
        const impTObserver = document.createElement(CssObserve.is) as CssObserve;
        impTObserver.observe = true;
        impTObserver.selector = `[${this.tm._importKey}="${as}"]`;
        impTObserver.addEventListener('latest-match-changed', e =>{
            const elementToWatchForTurningVisible = (<any>e).detail.value;
            if(elementToWatchForTurningVisible[hrefSym]) return;
            elementToWatchForTurningVisible[hrefSym] = href;
            TemplMount.template(href, {
                tm: this.tm,
                template: t,
            }).then(val =>{
                const ioi : IntersectionObserverInit = {
                    threshold: 0.01
                };
                const observer = new IntersectionObserver(this.callback.bind(this), ioi);
                observer.observe(elementToWatchForTurningVisible);
            })
            
        });
        this.tm.appendChild(impTObserver);        
    }


}