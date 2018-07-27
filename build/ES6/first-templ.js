const _cachedTemplates={},fetchInProgress={};export function delayedLoad(template,delay,params){setTimeout(()=>{loadTemplate(template,params)},delay)}export function loadTemplate(template,params){const src=template.dataset.src||template.getAttribute("href");if(src){if(_cachedTemplates[src]){template.innerHTML=_cachedTemplates[src];if(params)customElements.define(params.tagName,params.cls)}else{if(fetchInProgress[src]){if(params){setTimeout(()=>{loadTemplate(template,params)},100)}return}fetchInProgress[src]=!0;fetch(src,{credentials:"same-origin"}).then(resp=>{resp.text().then(txt=>{fetchInProgress[src]=!1;if(params&&params.preProcessor)txt=params.preProcessor.process(txt);const split=txt.split("<!---->");if(1<split.length){txt=split[1]}_cachedTemplates[src]=txt;template.innerHTML=txt;template.setAttribute("loaded","");if(params)customElements.define(params.tagName,params.cls)})})}}else{if(params&&params.tagName)customElements.define(params.tagName,params.cls)}}