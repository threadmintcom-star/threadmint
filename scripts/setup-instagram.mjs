import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const pages = ctx.pages();
const page = pages.find(p => p.url().includes("instagram")) || pages[0];

const inputs = page.locator("input");

// [0] email, [1] password, [2] full name, [3] username (search)
// Fill email
await inputs.nth(0).fill("jalaleddine98@gmail.com");
await page.waitForTimeout(400);

// Fill password
await inputs.nth(1).fill("ThreadMint2026!");
await page.waitForTimeout(400);

// Birthday dropdowns - select Jan 1 1990
const selects = page.locator("select");
const selCount = await selects.count();
if (selCount >= 3) {
  await selects.nth(0).selectOption({ label: "January" });
  await selects.nth(1).selectOption({ value: "1" });
  await selects.nth(2).selectOption({ value: "1990" });
  await page.waitForTimeout(400);
}

// Full name
await inputs.nth(2).fill("ThreadMint");
await page.waitForTimeout(400);

// Username — try candidates
const usernameInput = inputs.nth(2); // might be index 2 or the last visible text input
// Find the username field specifically - it's the last text input before submit
const textInputs = page.locator("input[type='text']");
const textCount = await textInputs.count();
const usernameField = textInputs.nth(textCount - 1);

const candidates = ["threadmint", "threadmintofficial", "threadmint_co", "threadmint.shop", "getthreadmint", "threadmintstore", "threadmint_eu"];
let chosen = "threadmint_eu";

for (const name of candidates) {
  await usernameField.click({ clickCount: 3 });
  await usernameField.fill(name);
  await page.waitForTimeout(1800);
  const taken = await page.locator("span:has-text('not available'), :has-text('already taken')").isVisible({ timeout: 1500 }).catch(() => false);
  console.log(`>> @${name}: ${taken ? "TAKEN" : "AVAILABLE"}`);
  if (!taken) { chosen = name; break; }
}

console.log(`>> Using @${chosen}`);
await page.screenshot({ path: "/home/jalal/Desktop/ig-ready.png" });

// Submit
const submitBtn = page.locator("button[type='submit']").first();
await submitBtn.click();
await page.waitForTimeout(5000);
await page.screenshot({ path: "/home/jalal/Desktop/ig-submitted.png" });
console.log(">> URL:", page.url());
