import { loadTemplate } from './first-templ.js';
export function qsa(css, from) {
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

export var TemplMount =
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
      var noMatch = false;

      if (ua) {
        noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
      }

      if (ua && template.hasAttribute('data-exclude')) noMatch = !noMatch;
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
    key: "lt",
    value: function lt(from) {
      var _this3 = this;

      qsa('template[data-src],template[data-activate]', from).forEach(function (t) {
        _this3.initTemplate(t);
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
      this.ltosd();

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

customElements.define(TemplMount.is, TemplMount); //# sourceMappingURL=templ-mount.js.map