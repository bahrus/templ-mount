var _cachedTemplates = {};
var fetchInProgress = {};
export function delayedLoad(template, delay, params) {
  setTimeout(function () {
    loadTemplate(template, params);
  }, delay);
}
export function loadTemplate(template, params) {
  var src = template.dataset.src || template.getAttribute('href');

  if (src) {
    if (_cachedTemplates[src]) {
      template.innerHTML = _cachedTemplates[src];
      if (params) customElements.define(params.tagName, params.cls);
    } else {
      if (fetchInProgress[src]) {
        if (params) {
          setTimeout(function () {
            loadTemplate(template, params);
          }, 100);
        }

        return;
      }

      fetchInProgress[src] = true;
      fetch(src, {
        credentials: 'same-origin'
      }).then(function (resp) {
        resp.text().then(function (txt) {
          fetchInProgress[src] = false;
          if (params && params.preProcessor) txt = params.preProcessor.process(txt);
          var split = txt.split('<!---->');

          if (split.length > 1) {
            txt = split[1];
          }

          _cachedTemplates[src] = txt;
          template.innerHTML = txt;
          template.setAttribute('loaded', '');
          if (params) customElements.define(params.tagName, params.cls);
        });
      });
    }
  } else {
    if (params && params.tagName) customElements.define(params.tagName, params.cls);
  }
} //# sourceMappingURL=first-templ.js.map