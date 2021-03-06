export interface TemplateSecondArg{
    tm?: ITemplMount | undefined;
    template: HTMLTemplateElement | undefined;
    target?: HTMLElement | undefined;
}

export interface TemplateClonedDetail{
    clone: Node,
    template: HTMLTemplateElement
}

export interface StreamCompleteDetail{
    template: HTMLTemplateElement
}

export interface TemplMountEventNameMap {
    'load': {},
    'template-cloned': TemplateClonedDetail,
    'stream-complete': StreamCompleteDetail,
}

export interface ITemplMount{
    emit<K extends keyof TemplMountEventNameMap>(src: HTMLElement, type: K,  detail: TemplMountEventNameMap[K]);
}