//@ts-check
const fs = require('fs')
function processFile(filePath, newLines){
    const contents = fs.readFileSync(filePath, 'utf8');
    const lines = contents.split('\n');
    lines.forEach(line =>{
        const tl = line.trimLeft();
        if(tl.startsWith('import ')) return;
        if(tl.startsWith('export ')){
            newLines.push(line.replace('export ', ''));
        }else{
            newLines.push(line);
        }
        
    })
}
const newLines = [];
processFile('templ-mount.js', newLines);
let newContent = `
//@ts-check
(function () {
${newLines.join('\n')}
})();  
    `;
fs.writeFileSync("first-templ.temple-mount.js", newContent, 'utf8');



