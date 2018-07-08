const _cachedTemplates = {};
const fetchInProgress = {};
export function loadTemplate(template, params) {
    const src = template.dataset.src || template.getAttribute('href');
    if (src) {
        if (_cachedTemplates[src]) {
            template.innerHTML = _cachedTemplates[src];
            if (params)
                customElements.define(params.tagName, params.cls);
        }
        else {
            if (fetchInProgress[src]) {
                if (params) {
                    setTimeout(() => {
                        loadTemplate(template, params);
                    }, 100);
                }
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'same-origin'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
                    if (params && params.preProcessor)
                        txt = params.preProcessor.process(txt);
                    _cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    template.setAttribute('loaded', '');
                    if (params)
                        customElements.define(params.tagName, params.cls);
                });
            });
        }
    }
    else {
        if (params && params.tagName)
            customElements.define(params.tagName, params.cls);
    }
}
//# sourceMappingURL=first-templ.js.map