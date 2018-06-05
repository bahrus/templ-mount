class FirstTemplExt {
    constructor(basePath) {
        this.basePath = basePath;
    }
    process(txt) {
        const parser = new DOMParser();
        let docFrag = parser.parseFromString(txt, 'text/html');
    }
}
//# sourceMappingURL=first-templ-ext.js.map