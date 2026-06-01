import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.goto("https://github.com/signup", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

// Accept cookies
const acceptBtn = page.locator("button:has-text('Accept')").first();
if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  await acceptBtn.click();
  await page.waitForTimeout(500);
}

// Fill email
await page.locator("input[placeholder='Email'], input[name='email'], input[type='email']").first().fill("threadmint.com@gmail.com");
await page.waitForTimeout(300);

// Fill password
await page.locator("input[placeholder='Password'], input[name='password'], input[type='password']").first().fill("ThreadMint2026!");
await page.waitForTimeout(300);

// Fill username — try candidates
const usernameInput = page.locator("input[placeholder='Username'], input[name='login'], input[name='username']").first();
const candidates = ["threadmint", "threadmintofficial", "threadmint-co", "threadmint-store", "getthreadmint", "threadmint-eu", "threadmint2026", "threadmintbrand"];
let chosen = null;

for (const name of candidates) {
  await usernameInput.click({ clickCount: 3 });
  await usernameInput.fill(name);
  await page.waitForTimeout(1800);
  // Check for error message near the username field
  const err = await page.locator("p:has-text('already taken'), p:has-text('unavailable'), [data-error]:visible").isVisible({ timeout: 1200 }).catch(() => false);
  console.log(`>> @${name}: ${err ? "TAKEN" : "AVAILABLE"}`);
  if (!err) { chosen = name; break; }
}

if (!chosen) {
  await page.screenshot({ path: "/home/jalal/Desktop/github-no-username.png" });
  console.log(">> All usernames taken");
  process.exit(1);
}

console.log(`>> Using: @${chosen}`);
await page.screenshot({ path: "/home/jalal/Desktop/github-filled.png" });

// Click Create account
await page.locator("button:has-text('Create account'), button[type='submit']:has-text('Create')").first().click();
await page.waitForTimeout(5000);
await page.screenshot({ path: "/home/jalal/Desktop/github-after-submit.png" });
console.log(">> URL:", page.url());

// Email verification may be required — check
const verifyMsg = await page.locator("text=verify your email, text=check your email, text=verification").isVisible({ timeout: 3000 }).catch(() => false);
if (verifyMsg) {
  console.log(">> Email verification required — check threadmint.com@gmail.com inbox");
} else {
  console.log(">> Account created or next step needed — check screenshot");
}
