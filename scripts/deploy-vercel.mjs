import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const contexts = browser.contexts();
const ctx = contexts[0] || await browser.newContext();
const pages = ctx.pages();
const page = pages[0] || await ctx.newPage();

console.log(">> Connected to Chrome.");

// Step 1: Go to Vercel and check login state
await page.goto("https://vercel.com/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

const loginBtn = page.locator("text=Continue with GitHub").first();
const isLoginPage = await loginBtn.isVisible({ timeout: 3000 }).catch(() => false);

if (isLoginPage) {
  console.log(">> Not logged in — clicking Continue with GitHub...");
  await loginBtn.click();

  // Wait to land on github.com
  console.log(">> Waiting for GitHub OAuth page...");
  while (!/github\.com/.test(page.url())) {
    await page.waitForTimeout(800);
  }
  console.log(">> On GitHub:", page.url());
  console.log(">> PLEASE LOG IN TO GITHUB NOW...");

  // Wait until we're back on vercel.com with no login button
  while (true) {
    const url = page.url();
    if (/vercel\.com/.test(url) && !/login/.test(url)) {
      // Double check: is the repo list visible (not login buttons)?
      const stillLoggedOut = await page.locator("text=Continue with GitHub").isVisible({ timeout: 1000 }).catch(() => false);
      if (!stillLoggedOut) {
        console.log(">> Logged in to Vercel! URL:", url);
        break;
      }
    }
    await page.waitForTimeout(1000);
  }
} else {
  console.log(">> Already logged in to Vercel.");
}

// Step 2: Import threadmint repo
await page.waitForTimeout(1500);
await page.goto("https://vercel.com/new", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

// Dismiss cookie banner if present
const dismissBtn = page.locator("text=Accept all, text=Deny").first();
if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  await dismissBtn.click();
  await page.waitForTimeout(500);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-new-project.png" });
console.log(">> Screenshot: vercel-new-project.png");
console.log(">> Page URL:", page.url());

// Search for threadmint
const searchInput = page.locator("input[placeholder*='Search'], input[type='search']").first();
if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
  await searchInput.fill("threadmint");
  await page.waitForTimeout(1500);
  console.log(">> Searched for threadmint");
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-search-result.png" });

// Find Import button
const importBtn = page.locator("button:has-text('Import')").first();
const importVisible = await importBtn.isVisible({ timeout: 10000 }).catch(() => false);

if (!importVisible) {
  console.log(">> Import button not found — checking page structure...");
  const html = await page.content();
  const hasGH = html.includes("Continue with GitHub");
  console.log(">> Still showing login?", hasGH);
  await page.screenshot({ path: "/home/jalal/Desktop/vercel-debug.png" });
  console.log(">> Screenshot saved: vercel-debug.png. Exiting.");
  process.exit(1);
}

console.log(">> Clicking Import...");
await importBtn.click();
await page.waitForTimeout(3000);

await page.screenshot({ path: "/home/jalal/Desktop/vercel-configure.png" });
console.log(">> On configure page:", page.url());

// Click Deploy
const deployBtn = page.locator("button:has-text('Deploy')").first();
await deployBtn.waitFor({ state: "visible", timeout: 15000 });
console.log(">> Clicking Deploy...");
await deployBtn.click();

await page.waitForTimeout(5000);
await page.screenshot({ path: "/home/jalal/Desktop/vercel-deploying.png" });
console.log(">> Deployment running...");

// Wait for success
while (true) {
  const url = page.url();
  if (/deployments|congratulations/i.test(url)) break;
  const hasSuccess = await page.locator("text=Congratulations").isVisible({ timeout: 1000 }).catch(() => false);
  if (hasSuccess) break;
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-done.png" });
const liveLink = page.locator("a[href*='.vercel.app']").first();
if (await liveLink.isVisible({ timeout: 3000 }).catch(() => false)) {
  const url = await liveLink.getAttribute("href");
  console.log(">> LIVE URL:", url);
}
console.log(">> DEPLOYMENT COMPLETE!");
