var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');
const TapeTestRunner = {
    test: test
};
(() => __awaiter(this, void 0, void 0, function* () {
    const launchOptions = {
        headless: true,
        args: ['--allow-file-access-from-files']
    };
    const browser = yield puppeteer.launch(launchOptions);
    const page = yield browser.newPage();
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/page-1c.html');
    yield page.goto(devFile);
    //await delay(4000);
    yield page.waitFor(4000);
    const textContent = yield page.$eval('page-2c', (c) => c.shadowRoot.querySelector('page-3c'));
    yield page.screenshot({ path: 'example.png' });
    yield browser.close();
    TapeTestRunner.test('testing dev.html', t => {
        t.ok(textContent);
        t.end();
    });
}))();
//# sourceMappingURL=test1.js.map