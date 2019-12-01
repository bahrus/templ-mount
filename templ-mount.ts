const import_key = 'import-key';
interface templateSecondArg{
    tm?: TemplMount | undefined;
    template: HTMLTemplateElement | undefined;
}
export class TemplMount extends HTMLElement{

    static get observedAttributes(){
        return [import_key];
    }

    static _templateStrings : {[href: string]: string | true} = {};
    static template(href: string, options: templateSecondArg){
        return new Promise((resolve, reject) =>{
            const temp = this._templateStrings[href];
            if(temp === true){
                this.waitForIt(href, resolve, reject, options);
            }else if(temp !== undefined){
                this.loadLocalTemplate(temp, options);
                resolve(temp);
            }else{
                this._templateStrings[href] = true;
                this.waitForIt(href, resolve, reject, options);
                this.load(href, options);
            }
        });
    }
    static waitForIt(href: string, resolve: any, reject: any, options: templateSecondArg){
        window.addEventListener(href + '-ready-tm', e =>{
            const a = e as CustomEventInit;
            if(a.detail && a.detail.template){
                this.loadLocalTemplate(a.detail.template, options);
                resolve(a.detail.template);
            }
            else{
                reject();
            }
        }, {
            once: true
        })
    }
    static loadLocalTemplate(templateString: string, options: templateSecondArg){
        const template = options.template;
        if(!template.hasAttribute('loaded')){
            template.innerHTML = templateString;
            template.setAttribute('loaded', '');
            template.dispatchEvent(new CustomEvent('load', {
                bubbles: true,
            }));
        }
    }

    static async load(href: string, options: templateSecondArg){
        try{
            const init: RequestInit = options.template.hasAttribute('request-init') ? JSON.parse(options.template.getAttribute('request-init')) : {};
            const resp = await fetch(href, init);
            const txt = await resp.text();
            this._templateStrings[href] = txt;
            this.loadLocalTemplate(txt, options);
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
                detail: {
                    template: options.template
                }
            }))
        }catch(e){
            console.error(e);
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
            }))
        }

        
    }

    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case import_key:
                this._importKey = nv;
                break;
        }
    }

    _importKey = 'imp-key';
    get importKey(){
        return this._importKey;
    }
    set importKey(nv: string){
        this.setAttribute(import_key, nv);
    }


    async connectedCallback(){
        this.style.display = 'none';
        this.loadFirstTempl();
        this.loadSecondTempl();
    }

    async loadFirstTempl(){
        const {FirstTempl} = await import('./first-templ.js');
        new FirstTempl(this);
    }

    async loadSecondTempl(){
        const {SecondTempl} = await import('./second-templ.js');
        new SecondTempl(this);
    }


}
customElements.define('templ-mount', TemplMount);