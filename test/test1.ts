import { ConsoleMessage, Browser, LaunchOptions  } from "puppeteer"; //typescript
import {Test} from "tape";

const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');
const TapeTestRunner = {
    test: test
} as Test;

(async () => {
    const launchOptions = {
        headless: true,
        args:['--allow-file-access-from-files']
    } as LaunchOptions;
    const browser = await puppeteer.launch(launchOptions) as Browser;
    const page = await browser.newPage();
    page.on('console', (msg: ConsoleMessage) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/page-1c.html');
    await page.goto(devFile);
    //await delay(4000);
    await page.waitFor(4000);
    const textContent = await page.$eval('page-2c', (c: any) => c.shadowRoot.querySelector('page-3c'));
    await page.screenshot({path: 'example.png'});
    await browser.close();
    TapeTestRunner.test('testing dev.html', t => {
        t.ok(textContent);
        t.end();
    });
    
  })();