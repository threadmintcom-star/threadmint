import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = ctx.pages()[0] || await ctx.newPage();

await page.goto("https://resend.com/api-keys", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);

// Open dialog
const createBtn = page.locator("button:has-text('Create API Key'), button:has-text('Add API Key')").first();
await createBtn.waitFor({ state: "visible", timeout: 10000 });
await createBtn.click();
await page.waitForTimeout(1500);

// Fill name inside dialog
const nameInput = page.locator("dialog input, [role='dialog'] input, input[placeholder*='API Key name']").first();
await nameInput.waitFor({ state: "visible", timeout: 5000 });
await nameInput.fill("ThreadMint Production");
await page.waitForTimeout(500);

// Click Add button inside dialog using keyboard shortcut shown in UI (Ctrl+Enter)
await page.keyboard.press("Control+Enter");
await page.waitForTimeout(2000);

await page.screenshot({ path: "/home/jalal/Desktop/resend-key-created.png" });
console.log(">> Key creation attempted. URL:", page.url());

// Extract the revealed API key
const keyValue = await page.locator("code, [data-testid='api-key-value'], input[readonly][value^='re_']").first().textContent().catch(() => null)
  || await page.locator("input[readonly]").first().inputValue().catch(() => null);

if (keyValue) {
  console.log(">> RESEND API KEY:", keyValue);
} else {
  // Try getting all text that looks like a key
  const allText = await page.locator("code").allTextContents().catch(() => []);
  console.log(">> Code elements:", allText.join(" | "));
  await page.screenshot({ path: "/home/jalal/Desktop/resend-key-visible.png" });
  console.log(">> Check resend-key-visible.png for the key");
}
