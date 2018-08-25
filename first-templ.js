const _cT = {}; //cachedTemplates
const fip = {}; //fetch in progress
function def(p) {
    if (p && p.tagName && p.cls) {
        if (customElements.get(p.tagName)) {
            console.warn(p.tagName + '!!');
        }
        else {
            customElements.define(p.tagName, p.cls);
        }
    }
}
export function loadTemplate(t, p) {
    const src = t.dataset.src || t.getAttribute('href');
    if (src) {
        if (_cT[src]) {
            t.innerHTML = _cT[src];
            def(p);
        }
        else {
            if (fip[src]) {
                if (p) {
                    setTimeout(() => {
                        loadTemplate(t, p);
                    }, 100);
                }
                return;
            }
            fip[src] = true;
            fetch(src, {
                credentials: 'same-origin'
            }).then(resp => {
                resp.text().then(txt => {
                    fip[src] = false;
                    if (p && p.preProcessor)
                        txt = p.preProcessor.process(txt);
                    if (!p || !p.noSnip) {
                        const split = txt.split('<!---->');
                        if (split.length > 1) {
                            txt = split[1];
                        }
                    }
                    _cT[src] = txt;
                    t.innerHTML = txt;
                    t.setAttribute('loaded', '');
                    def(p);
                });
            });
        }
    }
    else {
        def(p);
    }
}
//# sourceMappingURL=first-templ.js.map