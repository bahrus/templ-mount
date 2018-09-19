const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'qsa.js', 'first-templ.js', 'templ-mount.js'], 'templ-mount.iife.js');



