const href = 'href';
export const imp_h = 'imp-h';

export class TemplMount extends HTMLElement{

    static get observedAttributes(){
        return [href];
    }

    static _templates : {[href: string]: HTMLTemplateElement | boolean} = {};
    static template(href: string, tm?: TemplMount){
        return new Promise((resolve, reject) =>{
            const temp = this._templates[href];
            if(temp === true){
                window.addEventListener(href + '-ready-tm', e =>{
                    const a = e as CustomEventInit;
                    if(a.detail && a.detail.template){
                        resolve(a.detail.template);
                    }
                    else{
                        reject();
                    }
                }, {
                    once: true
                })
            }else if(temp !== undefined){
                resolve(temp);
            }else{
                this._templates[href] = true;
                this.load(href, tm);
            }
        });
    }

    static async load(href: string, tm?: TemplMount){
        try{
            const resp = await fetch(href);
            if(resp.type.indexOf('text/html') === -1){
                console.error("wrong mime type");
                window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                    bubbles: false,
                }))
                return;
            }
            const txt = await resp.text();
            const templ = document.createElement('template');
            templ.innerHTML = txt;
            this._templates[href] = templ;
            window.dispatchEvent(new CustomEvent(href + '-ready-tm', {
                bubbles: false,
                detail: {
                    template: templ
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
            case href:
                this._href = nv;
                break;
        }
    }

    _href: string;
    get href(){
        return this._href;
    }
    set href(nv: string){
        this._href = nv;
    }

    async connectedCallback(){
        this.style.display = 'none';
        this.load();
        const {SecondTempl} = await import('./second-templ.js');
        const sec = new SecondTempl(this);
    }

    async load(){
        if(this._href){
            await TemplMount.load(this._href, this);
            
        }
    }


}
customElements.define('templ-mount', TemplMount);