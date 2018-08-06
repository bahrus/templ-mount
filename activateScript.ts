const config = { childList: true };
const script = 'SCRIPT';
const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
    mutationsList.forEach(mutationRecord => {
        mutationRecord.addedNodes.forEach((node: HTMLScriptElement) => {
            switch(node.tagName) {
                case script:
                    if(node.hasAttribute('clone-me')){
                        const clone = document.createElement(script) as HTMLScriptElement;
                        clone.src = node.src;
                        clone.type = node.type;
                        clone.noModule = node.noModule;
                        document.head.appendChild(clone);
                    }
                    break;

            }
        })
    })
});
observer.observe(document.head, config);