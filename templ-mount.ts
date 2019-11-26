const href = 'href';
export class TemplMount extends HTMLElement{
    static get observedAttributes(){
        return [href];
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
        if(this._href){
            const resp = await fetch(this._href);
            const txt = await resp.text();
            const templ = document.createElement('template');
            if(this.id !== ''){
                templ.id = this.id + '-mt';
            }
            templ.innerHTML = txt;
            this.insertAdjacentElement('afterend', templ);
        }

    }
}
customElements.define('templ-mount', TemplMount);