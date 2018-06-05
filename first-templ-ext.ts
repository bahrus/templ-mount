import {IProcessor} from './first-templ.js';

class FirstTemplExt implements IProcessor{
    constructor(public basePath: string){
    }
    process(txt: string){
        const parser = new DOMParser();
        let docFrag = parser.parseFromString(txt, 'text/html');
        
    }
}

