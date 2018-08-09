const config = { childList: true };
const script = 'SCRIPT';
function copyAttrs(src: HTMLScriptElement, dest: HTMLScriptElement, attrs: string[]){
    attrs.forEach(attr =>{
        if(src.hasAttribute(attr)) dest.setAttribute(attr, src.getAttribute(attr));
    })
}
const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
    mutationsList.forEach(mutationRecord => {
        mutationRecord.addedNodes.forEach((node: HTMLScriptElement) => {
            switch(node.tagName) {
                case script:
                    if(node.hasAttribute('clone-me')){
                        const clone = document.createElement(script) as HTMLScriptElement;
                        copyAttrs(node, clone, ['src', 'type', 'nomodule']);
                        document.head.appendChild(clone);
                    }
                    break;

            }
        })
    })
});
observer.observe(document.head, config);