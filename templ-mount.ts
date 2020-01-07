import {TemplMountEventNameMap, TemplateSecondArg, ITemplMount} from './types.d.js';
//const import_key = 'import-key';

const root = Symbol();
/**
 * templ-mount helps load templates from url's, which point to HTML files or streams.
 * @element templ-mount
 */
export class TemplMount extends HTMLElement implements ITemplMount{

    static _templateStrings : {[href: string]: string | true} = {}; //store in session storage?
    static template(href: string, options: TemplateSecondArg){
        return new Promise((resolve, reject) =>{
            if(href === null || options.template.hasAttribute('when-needed')){
               resolve(null);
               return;
            }
            const temp = this._templateStrings[href];
            if(temp === true){
                this.waitForIt(href, resolve, reject, options);
            }else if(temp !== undefined){
                this.loadLocalTemplate(temp, options);
                this.swapAttr(options.template, href);
                resolve(temp);
            }else{
                this._templateStrings[href] = true;
                this.waitForIt(href, resolve, reject, options);
                
                this.load(href, options);
            }
        });
    }
    static waitForIt(href: string, resolve: any, reject: any, options: TemplateSecondArg){
        window.addEventListener(href + '-ready-tm', e =>{
            const a = e as CustomEventInit;
            if(a.detail && a.detail.template){
                if(!a.detail.template.hasAttribute('loaded')){
                    this.loadLocalTemplate(a.detail.template, options);
                }
                
                resolve(a.detail.template);
            }
            else{
                reject();
            }
        }, {
            once: true
        })
    }
    static loadLocalTemplate(templateString: string, options: TemplateSecondArg){
        const template = options.template;
//        if(!template.hasAttribute('loaded')){
            template.innerHTML = templateString;
            template.setAttribute('loaded', '');
            options.tm.emit<'load'>(template, 'load', {});
            // template.dispatchEvent(new CustomEvent('load', {
            //     bubbles: true,
            // }));
//        }
    }

    //https://gist.github.com/GuillaumeJasmin/9119436
    static extract(s: string, prefix: string, suffix: string) {
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
    };

    static async load(href: string, options: TemplateSecondArg){
        try{
            const t = options.template;
            const customEvent = new CustomEvent(href + '-ready-tm', {
                bubbles: false,
                detail: {
                    template: t
                }
            });

            const init: RequestInit = t.hasAttribute('request-init') ? JSON.parse(t.getAttribute('request-init')) : {};
            this.swapAttr(t, href);
            console.log(options.target);
            if(options.target !== undefined && t.hasAttribute('stream')){
                const {streamOrator, TemplateProcessor} = await import('stream-orator/stream-orator.js');
                await streamOrator(href, init, options.target, new TemplateProcessor(t));
                this.loadLocalTemplate(options.target.innerHTML, options);
            }else{
                const resp = await fetch(href, init);
                let txt = await resp.text();
                const snip = t.getAttribute('snip');
                if(snip !== null){
                    if(snip.startsWith('{')){
                        const snipInstructions = JSON.parse(snip);
                        txt = this.extract(txt, snipInstructions.lhs, snipInstructions.rhs);
                    }else{
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
        }catch(e){
            console.error(e);
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
            }))
        }

        
    }

    // attributeChangedCallback(n: string, ov: string, nv: string){
    //     switch(n){
    //         case import_key:
    //             this._importKey = nv;
    //             break;
    //     }
    // }

    _importKey = 'imp-key';
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

    static swapAttr(templ: HTMLTemplateElement, href: string){
        templ.removeAttribute('href');
        templ.setAttribute('last-href', href);
    }

    async connectedCallback(){
        this.style.display = 'none';
        this.loadFirstTempl();
        this.loadSecondTempl();
        if(self[root] === undefined){
            self[root] = true;
            Array.from(document.querySelectorAll('import[import][href]')).forEach(el =>{
                const templ = el as HTMLTemplateElement;
                const options : TemplateSecondArg = {
                    template: templ,
                    tm: this
                };
                TemplMount.template(templ.getAttribute('href'), options);
            })
        }
    }

    async loadFirstTempl(){
        const {FirstTempl} = await import('./first-templ.js');
        new FirstTempl(this);
    }

    async loadSecondTempl(){
        const {SecondTempl} = await import('./second-templ.js');
        new SecondTempl(this);
    }

    emit<K extends keyof TemplMountEventNameMap>(src: HTMLElement, type: K,  detail: TemplMountEventNameMap[K]){
        src.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            detail: detail
        }));
    }

}
customElements.define('templ-mount', TemplMount);
const tm = document.createElement('templ-mount');
document.head.appendChild(tm);