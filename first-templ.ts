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

function def(params: ICEParams){
    if(params && params.tagName && params.cls){
        if(customElements.get(params.tagName)){
            console.warn(params.tagName + ' already defined.')
        }else{
            customElements.define(params.tagName, params.cls);
        }
    }
}
export function loadTemplate(template: HTMLTemplateElement, params?: ICEParams){
    const src = template.dataset.src || template.getAttribute('href');
    if(src){
        if(_cT[src]){
            template.innerHTML = _cT[src];
            def(params);
        }else{
            if(fip[src]){
                if(params){
                    setTimeout(() =>{
                        loadTemplate(template, params);
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
                    if(params && params.preProcessor) txt = params.preProcessor.process(txt);
                    if(!params || !params.noSnip){
                        const split = txt.split('<!---->');
                        if(split.length > 1){
                            txt = split[1];
                        }
                    }
                    _cT[src] = txt;
                    template.innerHTML = txt;
                    template.setAttribute('loaded', '');
                    def(params);
                })
            })
        }

    }else{
        def(params)
    }
}



