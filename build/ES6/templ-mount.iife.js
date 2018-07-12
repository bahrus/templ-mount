(function(){const _cachedTemplates={},fetchInProgress={};function delayedLoad(template,delay,params){setTimeout(()=>{loadTemplate(template,params)},delay)}function loadTemplate(template,params){const src=template.dataset.src||template.getAttribute("href");if(src){if(_cachedTemplates[src]){template.innerHTML=_cachedTemplates[src];if(params)customElements.define(params.tagName,params.cls)}else{if(fetchInProgress[src]){if(params){setTimeout(()=>{loadTemplate(template,params)},100)}return}fetchInProgress[src]=!0;fetch(src,{credentials:"same-origin"}).then(resp=>{resp.text().then(txt=>{fetchInProgress[src]=!1;if(params&&params.preProcessor)txt=params.preProcessor.process(txt);_cachedTemplates[src]=txt;template.innerHTML=txt;template.setAttribute("loaded","");if(params)customElements.define(params.tagName,params.cls)})})}}else{if(params&&params.tagName)customElements.define(params.tagName,params.cls)}}function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}class TemplMount extends HTMLElement{constructor(){super();if(!TemplMount._alreadyDidGlobalCheck){TemplMount._alreadyDidGlobalCheck=!0;this.loadTemplatesOutsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.loadTemplatesOutsideShadowDOM();this.monitorHeadForTemplates()})}else{this.monitorHeadForTemplates()}}}static get is(){return"templ-mount"}getHost(){const parent=this.parentNode;return parent.host}loadTemplates(from){qsa("template[data-src]",from).forEach(externalRefTemplate=>{const ds=externalRefTemplate.dataset,ua=ds.ua;if(ua&&-1===navigator.userAgent.indexOf(ua))return;if(!ds.dumped){document.head.appendChild(externalRefTemplate.content.cloneNode(!0));ds.dumped="true"}const delay=ds.delay;if(delay){delayedLoad(externalRefTemplate,parseInt(delay))}else{loadTemplate(externalRefTemplate)}})}loadTemplatesOutsideShadowDOM(){this.loadTemplates(document)}loadTemplateInsideShadowDOM(){const host=this.getHost();if(!host)return;this.loadTemplates(host)}monitorHeadForTemplates(){this._observer=new MutationObserver(mutationsList=>{mutationsList.forEach(mutationRecord=>{mutationRecord.addedNodes.forEach(node=>{if("TEMPLATE"===node.tagName)loadTemplate(node)})})});this._observer.observe(document.head,{childList:!0})}connectedCallback(){this.loadTemplateInsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.loadTemplateInsideShadowDOM()})}}}TemplMount._alreadyDidGlobalCheck=!1;if(!customElements.get(TemplMount.is)){customElements.define(TemplMount.is,TemplMount)}})();