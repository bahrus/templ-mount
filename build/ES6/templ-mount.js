import{loadTemplate}from"./first-templ.js";export function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}export class TemplMount extends HTMLElement{constructor(){super();this.style.display="none";if(!TemplMount._adgc){TemplMount._adgc=!0;if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.mhft();this.ltosd()})}else{this.mhft()}}}static get is(){return"templ-mount"}getHost(){return this.parentNode}copyAttrs(src,dest,attrs){attrs.forEach(attr=>{if(!src.hasAttribute(attr))return;let attrVal=src.getAttribute(attr);if("type"===attr)attrVal=attrVal.replace(":","");dest.setAttribute(attr,attrVal)})}cT(clonedNode,tagName,copyAttrs){qsa(tagName,clonedNode).forEach(node=>{const clone=document.createElement(tagName);this.copyAttrs(node,clone,copyAttrs);clone.innerHTML=node.innerHTML;document.head.appendChild(clone)})}iT(template){const ds=template.dataset,ua=ds.ua;let noMatch=!1;if(ua){noMatch=-1===navigator.userAgent.search(new RegExp(ua))}if(ua&&template.hasAttribute("data-exclude"))noMatch=!noMatch;if(ua&&noMatch)return;if(!ds.dumped){const clonedNode=template.content.cloneNode(!0);this.cT(clonedNode,"script",["src","type","nomodule"]);this.cT(clonedNode,"template",["id","data-src","href","data-activate","data-ua","data-exclude","data-methods"]);this.cT(clonedNode,"c-c",["from","noshadow","copy"]);ds.dumped="true"}loadTemplate(template,{noSnip:template.hasAttribute("nosnip")})}lt(from){qsa("template[data-src],template[data-activate]",from).forEach(t=>{this.iT(t)})}ltosd(){this.lt(document)}ltisd(){const host=this.getHost();if(!host)return;this.lt(host)}mhft(){this._observer=new MutationObserver(mL=>{mL.forEach(mR=>{mR.addedNodes.forEach(node=>{if("TEMPLATE"===node.tagName)this.iT(node)})})});this._observer.observe(document.head,{childList:!0})}connectedCallback(){this.ltisd();this.ltosd();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.ltisd()})}}}TemplMount._adgc=!1;customElements.define(TemplMount.is,TemplMount);