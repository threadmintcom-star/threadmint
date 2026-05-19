import { chromium } from "playwright";

const browser = await chromium.launch({ headless: false, slowMo: 500 });
const page = await browser.newPage();
await page.goto("https://example.com");
const title = await page.title();
console.log("Browser works. Page title:", title);
await browser.close();
