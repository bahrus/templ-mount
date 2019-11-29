import {CssObserve} from 'css-observe/css-observe.js';
import {TemplMount} from './templ-mount.js';  

export class FirstTempl{
    constructor(public tm: TemplMount){
        const templateObserver = document.createElement(CssObserve.is) as CssObserve;
        templateObserver.observe = true;
        templateObserver.selector = "template";
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
  
                const impTObserver = document.createElement(CssObserve.is) as CssObserve;
                impTObserver.observe = true;
                impTObserver.selector = `[imp-t="${href}"],[imp-t-light="${href}"]`;
                impTObserver.addEventListener('latest-match-changed', e =>{
                    TemplMount.template(href, {
                        tm: this.tm,
                        template: t   
                    }).then(val =>{
                        (<any>e).detail.value.appendChild((<any>val).content.cloneNode(true));
                    })
                    
                });
                this.tm.appendChild(impTObserver);
            }

        });
        this.tm.appendChild(templateObserver);

    }


}