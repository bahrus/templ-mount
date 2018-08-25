export interface IProcessor{
    process: (txt: string) => string;
}

export interface ICEParams{
    tagName?: string,
    cls?: any,
    sharedTemplateTagName?: string,
    preProcessor?: IProcessor;
    noSnip?: boolean;
}
const _cT : {[key:string] : string} = {}; //cachedTemplates
const fip : {[key:string] : boolean} = {}; //fetch in progress

function def(p: ICEParams){
    if(p && p.tagName && p.cls){
        if(customElements.get(p.tagName)){
            console.warn(p.tagName + '!!')
        }else{
            customElements.define(p.tagName, p.cls);
        }
    }
}
export function loadTemplate(t: HTMLTemplateElement, p?: ICEParams){
    const src = t.dataset.src || t.getAttribute('href');
    if(src){
        if(_cT[src]){
            t.innerHTML = _cT[src];
            def(p);
        }else{
            if(fip[src]){
                if(p){
                    setTimeout(() =>{
                        loadTemplate(t, p);
                    }, 100);
                }
                return;
            }
            fip[src] = true;
            fetch(src, {
                credentials: 'same-origin'
            }).then(resp =>{
                resp.text().then(txt =>{
                    fip[src] = false;
                    if(p && p.preProcessor) txt = p.preProcessor.process(txt);
                    if(!p || !p.noSnip){
                        const split = txt.split('<!---->');
                        if(split.length > 1){
                            txt = split[1];
                        }
                    }
                    _cT[src] = txt;
                    t.innerHTML = txt;
                    t.setAttribute('loaded', '');
                    def(p);
                })
            })
        }

    }else{
        def(p)
    }
}



