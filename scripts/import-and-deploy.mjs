import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = ctx.pages()[0] || await ctx.newPage();

console.log(">> Connected. URL:", page.url());

// Click "Import a different Git Repository" link on the current page
const importLink = page.locator("text=Import a different Git Repository").first();
if (await importLink.isVisible({ timeout: 3000 }).catch(() => false)) {
  console.log(">> Clicking 'Import a different Git Repository'...");
  await importLink.click();
  await page.waitForTimeout(2000);
} else {
  // Navigate fresh to new project
  await page.goto("https://vercel.com/new", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-import-page.png" });
console.log(">> Import page URL:", page.url());

// Handle GitHub connect if needed
const ghConnectBtn = page.locator("button:has-text('Continue with GitHub')").first();
if (await ghConnectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  console.log(">> Connecting GitHub...");

  // Listen for new page (popup) opened by Vercel for GitHub auth
  const [popup] = await Promise.all([
    ctx.waitForEvent("page").catch(() => null),
    ghConnectBtn.click(),
  ]);

  if (popup) {
    console.log(">> GitHub popup opened:", popup.url());
    // Wait for popup to close (OAuth complete)
    await popup.waitForEvent("close", { timeout: 120000 }).catch(() => {});
    console.log(">> Popup closed");
  } else {
    // Inline redirect
    await page.waitForTimeout(3000);
    if (/github\.com/.test(page.url())) {
      console.log(">> Redirected to GitHub — PLEASE AUTHORIZE if prompted...");
      while (/github\.com/.test(page.url())) await page.waitForTimeout(1000);
    }
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/home/jalal/Desktop/vercel-after-gh.png" });
}

// Install GitHub App if prompted
const installBtn = page.locator("button:has-text('Install')").first();
if (await installBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  console.log(">> Installing GitHub App...");
  const [popup] = await Promise.all([
    ctx.waitForEvent("page").catch(() => null),
    installBtn.click(),
  ]);
  if (popup) {
    console.log(">> Install popup:", popup.url());
    // Auto-click install on GitHub
    const ghInstall = popup.locator("button:has-text('Install'), input[value='Install']").first();
    if (await ghInstall.isVisible({ timeout: 8000 }).catch(() => false)) {
      await ghInstall.click();
      console.log(">> Clicked install on GitHub");
    } else {
      console.log(">> MANUAL ACTION NEEDED in popup — install Vercel app on GitHub");
    }
    await popup.waitForEvent("close", { timeout: 60000 }).catch(() => {});
  }
  await page.waitForTimeout(2000);
  await page.goto("https://vercel.com/new", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-repos.png" });

// Search and import threadmint
const searchInput = page.locator("input[placeholder*='Search'], input[type='search']").first();
if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
  await searchInput.fill("threadmint");
  await page.waitForTimeout(1500);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-search.png" });

const importBtn = page.locator("button:has-text('Import')").first();
await importBtn.waitFor({ state: "visible", timeout: 15000 });
console.log(">> Clicking Import...");
await importBtn.click();
await page.waitForTimeout(3000);

await page.screenshot({ path: "/home/jalal/Desktop/vercel-configure.png" });

const deployBtn = page.locator("button:has-text('Deploy')").first();
await deployBtn.waitFor({ state: "visible", timeout: 15000 });
console.log(">> Clicking Deploy...");
await deployBtn.click();
await page.waitForTimeout(5000);
console.log(">> Deployment running...");

while (true) {
  const done = await page.locator("text=Congratulations").isVisible({ timeout: 1000 }).catch(() => false);
  if (done || /\/[^/]+\/threadmint/.test(page.url())) break;
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: "/home/jalal/Desktop/vercel-done.png" });
const liveLink = page.locator("a[href*='.vercel.app']").first();
if (await liveLink.isVisible({ timeout: 5000 }).catch(() => false)) {
  console.log(">> LIVE URL:", await liveLink.getAttribute("href"));
}
console.log(">> DEPLOYMENT COMPLETE!");
