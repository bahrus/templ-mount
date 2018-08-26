var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import {runTests} from 'xtal-test/index.js';
const xt = require('xtal-test/index');
const test = require('tape');
console.log(xt);
function customTests(page) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('doing customTests, wait 4 seconds');
        yield page.waitFor(4000);
        console.log('4 seconds passed');
        const textContent = yield page.$eval('page-2c', (c) => c.shadowRoot.querySelector('page-3c'));
        const TapeTestRunner = {
            test: test
        };
        TapeTestRunner.test('testing dev.html', t => {
            t.ok(textContent);
            t.end();
        });
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield xt.runTests('demo/page-1c.html', customTests);
}))();
// const test = require('tape');
// const puppeteer = require('puppeteer');
// const path = require('path');
// (async () => {
//     const launchOptions = {
//         headless: true,
//         args:['--allow-file-access-from-files']
//     } as LaunchOptions;
//     const browser = await puppeteer.launch(launchOptions) as Browser;
//     const page = await browser.newPage();
//     page.on('console', (msg: ConsoleMessage) => console.log('PAGE LOG:', msg.text()));
//     const devFile = path.resolve(__dirname, '../demo/page-1c.html');
//     await page.goto(devFile);
//     //await delay(4000);
//     await page.waitFor(4000);
//     const textContent = await page.$eval('page-2c', (c: any) => c.shadowRoot.querySelector('page-3c'));
//     await page.screenshot({path: 'example.png'});
//     await browser.close();
//     TapeTestRunner.test('testing dev.html', t => {
//         t.ok(textContent);
//         t.end();
//     });
//   })();
//# sourceMappingURL=test1.js.map