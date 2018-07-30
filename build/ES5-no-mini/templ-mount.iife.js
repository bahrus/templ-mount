//@ts-check
(function () {
  var _cachedTemplates = {};
  var fetchInProgress = {};

  function loadTemplate(template, params) {
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


  var TemplMount =
  /*#__PURE__*/
  function (_HTMLElement) {
    babelHelpers.inherits(TemplMount, _HTMLElement);

    function TemplMount() {
      var _this;

      babelHelpers.classCallCheck(this, TemplMount);
      _this = babelHelpers.possibleConstructorReturn(this, (TemplMount.__proto__ || Object.getPrototypeOf(TemplMount)).call(this));

      if (!TemplMount._alreadyDidGlobalCheck) {
        TemplMount._alreadyDidGlobalCheck = true;

        _this.loadTemplatesOutsideShadowDOM();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this.loadTemplatesOutsideShadowDOM();

            _this.monitorHeadForTemplates();
          });
        } else {
          _this.monitorHeadForTemplates();
        }
      }

      return _this;
    }

    babelHelpers.createClass(TemplMount, [{
      key: "getHost",
      value: function getHost() {
        var parent = this.parentNode;
        return parent['host'];
      }
    }, {
      key: "loadTemplates",
      value: function loadTemplates(from) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = from.querySelectorAll('template[data-src]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var externalRefTemplate = _step.value;
            var ds = externalRefTemplate.dataset;
            var ua = ds.ua;
            if (ua && navigator.userAgent.indexOf(ua) === -1) return;

            if (!ds.dumped) {
              document.head.appendChild(externalRefTemplate.content.cloneNode(true));
              ds.dumped = 'true';
            }

            loadTemplate(externalRefTemplate);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "loadTemplatesOutsideShadowDOM",
      value: function loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
      }
    }, {
      key: "loadTemplateInsideShadowDOM",
      value: function loadTemplateInsideShadowDOM() {
        var host = this.getHost();
        if (!host) return;
        this.loadTemplates(host);
      }
    }, {
      key: "monitorHeadForTemplates",
      value: function monitorHeadForTemplates() {
        var config = {
          childList: true
        };
        this._observer = new MutationObserver(function (mutationsList) {
          mutationsList.forEach(function (mutationRecord) {
            mutationRecord.addedNodes.forEach(function (node) {
              if (node.tagName === 'TEMPLATE') loadTemplate(node);
            });
          });
        });

        this._observer.observe(document.head, config);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.loadTemplateInsideShadowDOM();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this2.loadTemplateInsideShadowDOM();
          });
        }
      }
    }], [{
      key: "is",
      get: function get() {
        return 'templ-mount';
      }
    }]);
    return TemplMount;
  }(HTMLElement);

  TemplMount._alreadyDidGlobalCheck = false;
  customElements.define(TemplMount.is, TemplMount); //# sourceMappingURL=templ-mount.js.map
})();