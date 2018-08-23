var _cT = {}; //cachedTemplates

var fip = {}; //fetch in progress

export function loadTemplate(template, params) {
  var src = template.dataset.src || template.getAttribute('href');

  if (src) {
    if (_cT[src]) {
      template.innerHTML = _cT[src];
      if (params) customElements.define(params.tagName, params.cls);
    } else {
      if (fip[src]) {
        if (params) {
          setTimeout(function () {
            loadTemplate(template, params);
          }, 100);
        }

        return;
      }

      fip[src] = true;
      fetch(src, {
        credentials: 'same-origin'
      }).then(function (resp) {
        resp.text().then(function (txt) {
          fip[src] = false;
          if (params && params.preProcessor) txt = params.preProcessor.process(txt);

          if (!params || !params.noSnip) {
            var split = txt.split('<!---->');

            if (split.length > 1) {
              txt = split[1];
            }
          }

          _cT[src] = txt;
          template.innerHTML = txt;
          template.setAttribute('loaded', '');
          if (params && params.tagName) customElements.define(params.tagName, params.cls);
        });
      });
    }
  } else {
    if (params && params.tagName) customElements.define(params.tagName, params.cls);
  }
} //# sourceMappingURL=first-templ.js.map