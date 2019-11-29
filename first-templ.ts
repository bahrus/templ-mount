import {CssObserve} from 'css-observe/css-observe.js';
import {TemplMount} from './templ-mount.js';  

export class FirstTempl{
    constructor(public firstTempl: TemplMount){
        const observer = document.createElement(CssObserve.is) as CssObserve;
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
        observer.addEventListener('latest-match-changed', e =>{
            console.log('i am here');
        }, {
            once: true,
        });
        firstTempl.appendChild(observer);
    }


}