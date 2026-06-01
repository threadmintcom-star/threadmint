import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Step 1: Log into business Gmail in fresh context
console.log(">> Logging into business Gmail...");
await page.goto("https://accounts.google.com/signin", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

const emailInput = page.locator("input[type='email']").first();
await emailInput.waitFor({ state: "visible", timeout: 10000 });
await emailInput.fill("threadmint.com@gmail.com");
await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(2000);

const pwInput = page.locator("input[type='password']").first();
await pwInput.waitFor({ state: "visible", timeout: 8000 });
await pwInput.fill("//OpenMail55");
await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(4000);

await page.screenshot({ path: "/home/jalal/Desktop/github-gmail-login.png" });
console.log(">> URL after Gmail login:", page.url());

// Step 2: Go to GitHub signup — use "Sign up with Google"
console.log(">> Navigating to GitHub signup...");
await page.goto("https://github.com/signup", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/github-signup-page.png" });

// Fill email and click Continue (native path)
const ghEmail = page.locator("input[name='email'], input[type='email'], #email").first();
await ghEmail.waitFor({ state: "visible", timeout: 10000 });
await ghEmail.fill("threadmint.com@gmail.com");
await page.waitForTimeout(300);

// Click the submit/continue - look for the form submit, not the Google OAuth button
const submitBtn = page.locator("button.btn-primary, button[type='submit']:not(:has-text('Google')), input[type='submit']").first();
await submitBtn.click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "/home/jalal/Desktop/github-after-email.png" });
console.log(">> URL after email:", page.url());

// Step 3: Password
const ghPw = page.locator("input[name='password'], input[type='password']").first();
if (await ghPw.isVisible({ timeout: 3000 }).catch(() => false)) {
  await ghPw.fill("ThreadMint2026!");
  await page.locator("button[type='submit'], button:has-text('Continue')").first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/home/jalal/Desktop/github-after-pw.png" });
  console.log(">> URL after pw:", page.url());
}

// Step 4: Username
const ghUsername = page.locator("input[name='login'], input[id='login']").first();
if (await ghUsername.isVisible({ timeout: 3000 }).catch(() => false)) {
  const candidates = ["threadmint", "threadmintofficial", "threadmint-co", "threadmint-store", "getthreadmint", "threadmint-eu", "threadmint2026"];
  let chosen = null;
  for (const name of candidates) {
    await ghUsername.click({ clickCount: 3 });
    await ghUsername.fill(name);
    await page.waitForTimeout(1800);
    const taken = await page.locator("[data-error]:visible, .error:visible").isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`>> @${name}: ${taken ? "TAKEN" : "AVAILABLE"}`);
    if (!taken) { chosen = name; break; }
  }
  if (chosen) {
    console.log(`>> Using @${chosen}`);
    await page.locator("button[type='submit'], button:has-text('Continue')").first().click();
    await page.waitForTimeout(2000);
  }
}

await page.screenshot({ path: "/home/jalal/Desktop/github-final.png" });
console.log(">> Final URL:", page.url());
