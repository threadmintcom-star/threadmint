import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();

await page.goto("https://account.proton.me/signup", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3000);
await page.screenshot({ path: "/home/jalal/Desktop/proton-start.png" });
console.log(">> URL:", page.url());

// Pick the free plan if prompted
const freePlan = page.locator("button:has-text('Get Proton for free'), [data-testid='plan-free'], button:has-text('Select Free')").first();
if (await freePlan.isVisible({ timeout: 3000 }).catch(() => false)) {
  await freePlan.click();
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/proton-plan.png" });
console.log(">> URL after plan:", page.url());

// Username field
const usernameInput = page.locator("input[id='username'], input[name='username'], input[placeholder*='username' i]").first();
await usernameInput.waitFor({ state: "visible", timeout: 15000 });

const candidates = [
  "threadmint",
  "threadmintofficial",
  "threadmint.official",
  "hello.threadmint",
  "threadmintstore",
  "getthreadmint",
  "threadmint.eu",
  "threadmint2026",
  "threadmintbrand",
  "threadminthq",
];

let chosen = null;
for (const name of candidates) {
  await usernameInput.click({ clickCount: 3 });
  await usernameInput.fill(name);
  await page.waitForTimeout(2500);

  const taken = await page.locator(
    "[data-testid='error-username'], .field-two-error:visible, span:has-text('already used'), span:has-text('not available'), span:has-text('already taken')"
  ).isVisible({ timeout: 1500 }).catch(() => false);

  console.log(`>> ${name}@proton.me: ${taken ? "TAKEN" : "AVAILABLE"}`);
  if (!taken) { chosen = name; break; }
}

if (!chosen) {
  await page.screenshot({ path: "/home/jalal/Desktop/proton-no-username.png" });
  console.log(">> All candidates taken — check screenshot");
  process.exit(1);
}

console.log(`>> Using: ${chosen}@proton.me`);

// Password
const password = "ThreadMint2026!";
const pwInput = page.locator("input[id='password'], input[name='password'], input[type='password']").first();
await pwInput.waitFor({ state: "visible", timeout: 5000 });
await pwInput.fill(password);

const confirmPw = page.locator("input[id='repeat-password'], input[name='confirmPassword'], input[type='password']").nth(1);
if (await confirmPw.isVisible({ timeout: 2000 }).catch(() => false)) {
  await confirmPw.fill(password);
}

await page.waitForTimeout(400);
await page.screenshot({ path: "/home/jalal/Desktop/proton-filled.png" });

// Click Continue / Next
await page.locator("button[type='submit'], button:has-text('Continue'), button:has-text('Create account')").first().click();
await page.waitForTimeout(4000);
await page.screenshot({ path: "/home/jalal/Desktop/proton-after-submit.png" });
console.log(">> URL after submit:", page.url());
console.log(">> EMAIL:", `${chosen}@proton.me`);
console.log(">> PASSWORD:", password);
