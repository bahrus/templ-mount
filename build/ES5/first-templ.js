var _cT = {}; //cachedTemplates

var fip = {}; //fetch in progress

function def(params) {
  if (params && params.tagName && params.cls) {
    if (customElements.get(params.tagName)) {
      console.warn(params.tagName + ' already defined.');
    } else {
      customElements.define(params.tagName, params.cls);
    }
  }
}

export function loadTemplate(template, params) {
  var src = template.dataset.src || template.getAttribute('href');

  if (src) {
    if (_cT[src]) {
      template.innerHTML = _cT[src];
      def(params);
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
          def(params);
        });
      });
    }
  } else {
    def(params);
  }
} //# sourceMappingURL=first-templ.js.map