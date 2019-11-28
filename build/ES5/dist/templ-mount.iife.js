//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  function qsa(css, from) {
    return [].slice.call(from.querySelectorAll(css));
  }

  var _cT = {}; //cachedTemplates

  var fip = {}; //fetch in progress

  function def(p) {
    if (p && p.tagName && p.cls) {
      if (customElements.get(p.tagName)) {
        console.warn(p.tagName + '!!');
      } else {
        customElements.define(p.tagName, p.cls);
      }
    }
  }

  function loadTemplate(t, p) {
    var src = t.dataset.src || t.getAttribute('href');

    if (src) {
      if (_cT[src]) {
        t.innerHTML = _cT[src];
        def(p);
      } else {
        if (fip[src]) {
          if (p) {
            setTimeout(function () {
              loadTemplate(t, p);
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
            if (p && p.preProcessor) txt = p.preProcessor.process(txt);

            if (!p || !p.noSnip) {
              var split = txt.split('<!---->');

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
    } else {
      def(p);
    }
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
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(TemplMount).call(this));

      if (!TemplMount._adgc) {
        TemplMount._adgc = true;

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this.mhft();

            _this.ltosd();
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
          if (!src.hasAttribute(attr)) return;
          var attrVal = src.getAttribute(attr);
          if (attr === 'type') attrVal = attrVal.replace(':', '');
          dest.setAttribute(attr, attrVal);
        });
      }
    }, {
      key: "cT",
      value: function cT(clonedNode, tagName, copyAttrs) {
        var _this2 = this;

        var doc = this.doc;
        qsa(tagName, clonedNode).forEach(function (node) {
          //node.setAttribute('clone-me', '');
          var clone = doc.createElement(tagName);

          _this2.copyAttrs(node, clone, copyAttrs);

          clone.innerHTML = node.innerHTML;
          doc.head.appendChild(clone);
        });
      }
    }, {
      key: "iT",
      value: function iT(template) {
        var ds = template.dataset;
        var ua = ds.ua;
        var noMatch = false;

        if (ua) {
          noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }

        if (ua && template.hasAttribute('data-exclude')) noMatch = !noMatch;
        if (ua && noMatch) return;

        if (!ds.dumped) {
          //This shouldn't be so hard, but Chrome (and other browsers) doesn't seem to consistently like just appending the cloned children of the template
          var clonedNode = template.content.cloneNode(true);
          this.cT(clonedNode, 'script', ['src', 'type', 'nomodule']);
          this.cT(clonedNode, 'template', ['id', 'data-src', 'href', 'data-activate', 'data-ua', 'data-exclude', 'data-methods']);
          this.cT(clonedNode, 'c-c', ['from', 'noshadow', 'copy']);
          ds.dumped = 'true';
        }

        loadTemplate(template, {
          noSnip: template.hasAttribute('nosnip')
        });
      }
      /**
       *
       * @param from
       */

    }, {
      key: "lt",
      value: function lt(from) {
        var _this3 = this;

        qsa('template[data-src],template[data-activate]', from).forEach(function (t) {
          _this3.iT(t);
        });
      }
    }, {
      key: "ltosd",
      value: function ltosd() {
        this.lt(document);
      }
    }, {
      key: "ltisd",
      value: function ltisd() {
        var host = this.getHost();
        if (!host) return;
        this.lt(host);
      }
    }, {
      key: "mhft",
      value: function mhft() {
        var _this4 = this;

        var config = {
          childList: true
        };
        this._observer = new MutationObserver(function (mL) {
          mL.forEach(function (mR) {
            mR.addedNodes.forEach(function (node) {
              if (node.tagName === 'TEMPLATE') _this4.iT(node);
            });
          });
        });

        this._observer.observe(document.head, config);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this5 = this;

        this.style.display = 'none';
        this.ltisd();
        this.ltosd();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this5.ltisd();
          });
        }
      }
    }, {
      key: "doc",
      get: function get() {
        if (this.hasAttribute('target-top')) {
          return window.top.document;
        }

        return document;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'templ-mount';
      }
    }]);
    return TemplMount;
  }(babelHelpers.wrapNativeSuper(HTMLElement));

  TemplMount._adgc = false; //already did global check

  customElements.define(TemplMount.is, TemplMount);
})();