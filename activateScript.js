const config = { childList: true };
const script = 'SCRIPT';
function copyAttrs(src, dest, attrs) {
    attrs.forEach(attr => {
        if (src.hasAttribute(attr))
            dest.setAttribute(attr, src.getAttribute(attr));
    });
}
const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach(mutationRecord => {
        mutationRecord.addedNodes.forEach((node) => {
            switch (node.tagName) {
                case script:
                    if (node.hasAttribute('clone-me')) {
                        const clone = document.createElement(script);
                        copyAttrs(node, clone, ['src', 'type', 'nomodule']);
                        document.head.appendChild(clone);
                    }
                    break;
            }
        });
    });
});
observer.observe(document.head, config);
//# sourceMappingURL=activateScript.js.map