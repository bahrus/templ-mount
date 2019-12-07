const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-mount.html',
            expectedNoOfSuccessMarkers: 5,
        },
    ]);
    if (passed) {
        console.log("Tests Passed.  Have a nice day.");
    }
})();
