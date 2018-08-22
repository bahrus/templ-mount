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
  }

  function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
  }
  /**
  * `templ-mount`
  * Dependency free web component that loads templates from data-src (optionally href) attribute
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  */


  var TemplMount =
  /*#__PURE__*/
  function (_HTMLElement) {
    babelHelpers.inherits(TemplMount, _HTMLElement);

    function TemplMount() {
      var _this;

      babelHelpers.classCallCheck(this, TemplMount);
      _this = babelHelpers.possibleConstructorReturn(this, (TemplMount.__proto__ || Object.getPrototypeOf(TemplMount)).call(this));

      if (!TemplMount._adgc) {
        TemplMount._adgc = true;

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this.mhft();

            _this.loadTemplatesOutsideShadowDOM();
          });
        } else {
          _this.mhft();
        }
      }

      return _this;
    }

    babelHelpers.createClass(TemplMount, [{
      key: "getHost",

      /**
       * Gets host from parent
       */
      value: function getHost() {
        return this.parentNode;
      }
    }, {
      key: "copyAttrs",
      value: function copyAttrs(src, dest, attrs) {
        attrs.forEach(function (attr) {
          if (src.hasAttribute(attr)) dest.setAttribute(attr, src.getAttribute(attr));
        });
      }
    }, {
      key: "cloneTags",
      value: function cloneTags(clonedNode, tagName, copyAttrs) {
        var _this2 = this;

        qsa(tagName, clonedNode).forEach(function (node) {
          //node.setAttribute('clone-me', '');
          var clone = document.createElement(tagName);

          _this2.copyAttrs(node, clone, copyAttrs);

          clone.innerHTML = node.innerHTML;
          document.head.appendChild(clone);
        });
      }
    }, {
      key: "initTemplate",
      value: function initTemplate(template) {
        var ds = template.dataset;
        var ua = ds.ua;
        var noMatch = navigator.userAgent.indexOf(ua) === -1;
        if (ua && ua[0] === '!') noMatch = !noMatch;
        if (ua && noMatch) return;

        if (!ds.dumped) {
          //This shouldn't be so hard, but Chrome doesn't seem to consistently like just appending the cloned children of the template
          var clonedNode = template.content.cloneNode(true);
          this.cloneTags(clonedNode, 'script', ['src', 'type', 'nomodule']);
          this.cloneTags(clonedNode, 'template', ['data-src', 'href', 'data-activate']);
          ds.dumped = 'true';
        }

        loadTemplate(template);
      }
      /**
       *
       * @param from
       */

    }, {
      key: "loadTemplates",
      value: function loadTemplates(from) {
        var _this3 = this;

        qsa('template[data-src],template[data-activate]', from).forEach(function (externalRefTemplate) {
          _this3.initTemplate(externalRefTemplate);
        });
      }
    }, {
      key: "loadTemplatesOutsideShadowDOM",
      value: function loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
      }
    }, {
      key: "ltisd",
      value: function ltisd() {
        var host = this.getHost();
        if (!host) return;
        this.loadTemplates(host);
      }
    }, {
      key: "mhft",
      value: function mhft() {
        var _this4 = this;

        var config = {
          childList: true
        };
        this._observer = new MutationObserver(function (mutationsList) {
          mutationsList.forEach(function (mutationRecord) {
            mutationRecord.addedNodes.forEach(function (node) {
              if (node.tagName === 'TEMPLATE') _this4.initTemplate(node);
            });
          });
        });

        this._observer.observe(document.head, config);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this5 = this;

        this.ltisd();
        this.loadTemplatesOutsideShadowDOM();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this5.ltisd();
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

  TemplMount._adgc = false; //already did global check

  customElements.define(TemplMount.is, TemplMount);
})();