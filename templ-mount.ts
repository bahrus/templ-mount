import {CssObserve} from 'css-observe/css-observe.js';
export class TemplMount extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.addEventListener('latest-match-changed', e =>{

        });
        const cssObserver = document.createElement('css-observe') as CssObserve;
        cssObserver.se
        this.appendChild(cssObserver);
    }
}