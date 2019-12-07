import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;


(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-mount.html',
            expectedNoOfSuccessMarkers: 3,

        },
    ]);
    if(passed){
        console.log("Tests Passed.  Have a nice day.");
    }
})();