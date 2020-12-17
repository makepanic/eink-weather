const puppeteer = require('puppeteer');
const cp = require('child_process');

const IMAGE_FILE = 'dash.png';

const {
    LAT,
    LON,
    OPENWEATHER_KEY
} = process.env;

const assert = (test, text) => {
    if (!test) {
        throw `Assertion error: ${text}`;
    }
}

assert(LAT, 'environment variable `LAT` is set');
assert(LON, 'environment variable `LON` is set');
assert(OPENWEATHER_KEY, 'environment variable `OPENWEATHER_KEY` is set');

(async () => {
    // 1. Launch the browser
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 600,
            height: 800,
        }
    });

    // 2. Open a new page
    const page = await browser.newPage();

    // 3. Navigate to URL
    await page.goto(`http://localhost:9999/?lat=${LAT}&lon=${LON}&openweather_key=${OPENWEATHER_KEY}`,
        {waitUntil: 'networkidle2'});

    // 4. Take screenshot
    await page.screenshot({path: IMAGE_FILE});

    await browser.close();

    cp.execSync(`gm convert ${IMAGE_FILE} -colorspace GRAY ${IMAGE_FILE}`);
})();
