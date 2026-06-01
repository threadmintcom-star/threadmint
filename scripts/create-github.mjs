import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = await browser.newContext(); // fresh incognito — no existing sessions
const page = await ctx.newPage();

await page.goto("https://github.com/signup", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/github-signup-start.png" });
console.log(">> URL:", page.url());

// Step 1: Email
const emailInput = page.locator("input[name='email'], input[type='email'], #email").first();
await emailInput.waitFor({ state: "visible", timeout: 10000 });
await emailInput.fill("threadmint.com@gmail.com");
await page.waitForTimeout(400);

const continueBtn = page.locator("button:has-text('Continue'), button[type='submit']").first();
await continueBtn.click();
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/github-after-email.png" });
console.log(">> URL after email:", page.url());

// Step 2: Password
const pwInput = page.locator("input[name='password'], input[type='password']").first();
if (await pwInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  await pwInput.fill("ThreadMint2026!");
  await page.locator("button:has-text('Continue'), button[type='submit']").first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/home/jalal/Desktop/github-after-pw.png" });
}

// Step 3: Username
const usernameInput = page.locator("input[name='login'], input[id='login']").first();
if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  const candidates = ["threadmint", "threadmintofficial", "threadmint-co", "threadmint-store", "getthreadmint", "threadmint-eu", "threadmint2026"];
  let chosen = null;
  for (const name of candidates) {
    await usernameInput.click({ clickCount: 3 });
    await usernameInput.fill(name);
    await page.waitForTimeout(1800);
    const taken = await page.locator(".error:visible, [aria-live]:has-text('unavailable'), [aria-live]:has-text('already taken')").isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`>> @${name}: ${taken ? "TAKEN" : "AVAILABLE"}`);
    if (!taken) { chosen = name; break; }
  }
  if (chosen) {
    console.log(`>> Using: @${chosen}`);
    await page.locator("button:has-text('Continue'), button[type='submit']").first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "/home/jalal/Desktop/github-after-username.png" });
  }
}

// Step 4: Email preferences / announcements
const announceCheckbox = page.locator("input[name='opt_in_extra']");
if (await announceCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
  // Leave unchecked
  await page.locator("button:has-text('Continue'), button[type='submit']").first().click();
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/github-final.png" });
console.log(">> Final URL:", page.url());
