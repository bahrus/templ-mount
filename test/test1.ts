import { ConsoleMessage } from "puppeteer";

const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args:['--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    page.on('console', (msg: ConsoleMessage) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/page-1c.html');
    await page.goto(devFile);
    const textContent = await page.$eval('#secondEditor', (c: any) => c.input);
    await page.screenshot({path: 'example.png'});
    await browser.close();
    test('testing dev.html', (t: any) => {
        t.equal(textContent.data[0].name, 'Harry Potter');
        t.end();
    });
    
  })();