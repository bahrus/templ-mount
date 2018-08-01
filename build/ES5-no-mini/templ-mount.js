import { loadTemplate } from './first-templ.js';
export function qsa(css, from) {
  return [].slice.call((from ? from : this).querySelectorAll(css));
}
export var TemplMount =
/*#__PURE__*/
function (_HTMLElement) {
  babelHelpers.inherits(TemplMount, _HTMLElement);

  function TemplMount() {
    var _this;

    babelHelpers.classCallCheck(this, TemplMount);
    _this = babelHelpers.possibleConstructorReturn(this, (TemplMount.__proto__ || Object.getPrototypeOf(TemplMount)).call(this));

    if (!TemplMount._alreadyDidGlobalCheck) {
      TemplMount._alreadyDidGlobalCheck = true;

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function (e) {
          _this.monitorHeadForTemplates();

          _this.loadTemplatesOutsideShadowDOM();
        });
      } else {
        _this.monitorHeadForTemplates();

        _this.loadTemplatesOutsideShadowDOM();
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
      qsa('template[data-src]', from).forEach(function (externalRefTemplate) {
        var ds = externalRefTemplate.dataset;
        var ua = ds.ua;
        if (ua && navigator.userAgent.indexOf(ua) === -1) return;

        if (!ds.dumped) {
          document.head.appendChild(externalRefTemplate.content.cloneNode(true));
          ds.dumped = 'true';
        }

        loadTemplate(externalRefTemplate);
      });
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