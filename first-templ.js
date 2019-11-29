import { CssObserve } from 'css-observe/css-observe.js';
export class FirstTempl {
    constructor(firstTempl) {
        this.firstTempl = firstTempl;
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
            console.log('i am here');
        }, {
            once: true,
        });
        firstTempl.appendChild(observer);
    }
}
