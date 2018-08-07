var config = {
  childList: true
};
var script = 'SCRIPT';
var observer = new MutationObserver(function (mutationsList) {
  mutationsList.forEach(function (mutationRecord) {
    mutationRecord.addedNodes.forEach(function (node) {
      switch (node.tagName) {
        case script:
          if (node.hasAttribute('clone-me')) {
            var clone = document.createElement(script);
            clone.src = node.src;
            clone.type = node.type;
            clone.noModule = node.noModule;
            document.head.appendChild(clone);
          }

          break;
      }
    });
  });
});
observer.observe(document.head, config); //# sourceMappingURL=activateScript.js.map