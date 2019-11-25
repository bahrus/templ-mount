const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    console.log('doing customTests, wait 4 seconds');
    await page.waitFor(4000);
    const textContent = await page.$eval('page-2c', (c) => c.shadowRoot.querySelector('page-3c'));
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing dev.html', t => {
        t.ok(textContent);
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'test/page-1c.html'
    }, customTests);
})();
