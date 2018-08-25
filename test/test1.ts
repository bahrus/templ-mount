import { ConsoleMessage } from "puppeteer";

const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');
// function delay(time) {
//     return new Promise(function(resolve) { 
//         setTimeout(resolve, time)
//     });
//  }
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args:['--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    page.on('console', (msg: ConsoleMessage) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/page-1c.html');
    await page.goto(devFile);
    //await delay(4000);
    await page.waitFor(4000);
    const textContent = await page.$eval('page-2c', (c: any) => c.shadowRoot.querySelector('page-3c'));
    await page.screenshot({path: 'example.png'});
    await browser.close();
    test('testing dev.html', (t: any) => {
        t.ok(textContent);
        t.end();
    });
    
  })();