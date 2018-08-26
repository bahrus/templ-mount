import {IXtalTestRunner, IXtalTestRunnerOptions} from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
console.log(xt);
import { ConsoleMessage, Browser, LaunchOptions, Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    console.log('doing customTests, wait 4 seconds');
    await page.waitFor(4000);
    console.log('4 seconds passed');
    const textContent = await page.$eval('page-2c', (c: any) => c.shadowRoot.querySelector('page-3c'));
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing dev.html', t => {
        t.ok(textContent);
        t.end();
    });
}
(async () => {
    await  xt.runTests({
        path: 'test/page-1c.html'
    }, customTests);
})();

