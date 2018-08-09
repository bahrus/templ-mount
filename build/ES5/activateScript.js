var config = {
  childList: true
};
var script = 'SCRIPT';

function copyAttrs(src, dest, attrs) {
  attrs.forEach(function (attr) {
    if (src.hasAttribute(attr)) dest.setAttribute(attr, src.getAttribute(attr));
  });
}

var observer = new MutationObserver(function (mutationsList) {
  mutationsList.forEach(function (mutationRecord) {
    mutationRecord.addedNodes.forEach(function (node) {
      switch (node.tagName) {
        case script:
          if (node.hasAttribute('clone-me')) {
            var clone = document.createElement(script);
            copyAttrs(node, clone, ['src', 'type', 'nomodule']);
            document.head.appendChild(clone);
          }

          break;
      }
    });
  });
});
observer.observe(document.head, config); //# sourceMappingURL=activateScript.js.map