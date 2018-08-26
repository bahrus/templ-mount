//import {runTests} from 'xtal-test/index.js';
const xt = require('xtal-test/index') as any;
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
    await  xt.runTests('demo/page-1c.html', customTests);
})();

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