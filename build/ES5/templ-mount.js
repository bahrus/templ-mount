var _cachedTemplates={},fetchInProgress={};export function loadTemplate(template,params){var src=template.dataset.src;if(src){if(_cachedTemplates[src]){template.innerHTML=_cachedTemplates[src];if(params)customElements.define(params.tagName,params.cls)}else{if(fetchInProgress[src]){if(params){setTimeout(function(){loadTemplate(template,params)},100)}return}fetchInProgress[src]=!0;fetch(src,{credentials:"include"}).then(function(resp){resp.text().then(function(txt){fetchInProgress[src]=!1;_cachedTemplates[src]=txt;template.innerHTML=txt;template.setAttribute("loaded","");if(params)customElements.define(params.tagName,params.cls)})})}}else{if(params)customElements.define(params.tagName,params.cls)}}export function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}export var TemplMount=function(_HTMLElement){babelHelpers.inherits(TemplMount,_HTMLElement);function TemplMount(){var _this;babelHelpers.classCallCheck(this,TemplMount);_this=babelHelpers.possibleConstructorReturn(this,(TemplMount.__proto__||Object.getPrototypeOf(TemplMount)).call(this));if(!TemplMount._alreadyDidGlobalCheck){TemplMount._alreadyDidGlobalCheck=!0;_this.loadTemplatesOutsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",function(){_this.loadTemplatesOutsideShadowDOM();_this.monitorHeadForTemplates()})}else{_this.monitorHeadForTemplates()}}return _this}babelHelpers.createClass(TemplMount,[{key:"getHost",value:function getHost(){var parent=this.parentNode;return parent.host}},{key:"loadTemplates",value:function loadTemplates(from){qsa("template[data-src]",from).forEach(function(externalRefTemplate){loadTemplate(externalRefTemplate)})}},{key:"loadTemplatesOutsideShadowDOM",value:function loadTemplatesOutsideShadowDOM(){this.loadTemplates(document)}},{key:"loadTemplateInsideShadowDOM",value:function loadTemplateInsideShadowDOM(){var host=this.getHost();if(!host)return;this.loadTemplates(host)}},{key:"monitorHeadForTemplates",value:function monitorHeadForTemplates(){this._observer=new MutationObserver(function(mutationsList){mutationsList.forEach(function(mutationRecord){mutationRecord.addedNodes.forEach(function(node){if("TEMPLATE"===node.tagName)loadTemplate(node)})})})}},{key:"connectedCallback",value:function connectedCallback(){var _this2=this;this.loadTemplateInsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",function(){_this2.loadTemplateInsideShadowDOM()})}}}],[{key:"is",get:function get(){return"templ-mount"}}]);return TemplMount}(HTMLElement);TemplMount._alreadyDidGlobalCheck=!1;if(!customElements.get(TemplMount.is)){customElements.define(TemplMount.is,TemplMount)}