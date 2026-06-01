import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = ctx.pages()[0];

console.log(">> URL:", page.url());

// Month combobox — first [role=combobox]
const monthCombo = page.locator("[role='combobox']").nth(0);
await monthCombo.click();
await page.waitForTimeout(800);
// Click "March" from the visible listbox
await page.locator("ul[aria-label='Month'] li:has-text('March')").click();
await page.waitForTimeout(400);

// Day
await page.locator("input[name='day']").fill("15");
await page.waitForTimeout(200);

// Year
await page.locator("input[name='year']").fill("1995");
await page.waitForTimeout(200);

// Gender combobox — find the one with text "Gender"
const genderCombo = page.locator("[role='combobox']:has-text('Gender')").first();
await genderCombo.click();
await page.waitForTimeout(800);
await page.locator("ul[aria-label='Gender'] li[data-value='1']").click();
await page.waitForTimeout(400);

await page.screenshot({ path: "/home/jalal/Desktop/gmail-bday-filled.png" });
console.log(">> Birthday filled, clicking Next...");

await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-after-bday.png" });
console.log(">> URL after bday:", page.url());

// Username step
const usernameInput = page.locator("input[name='Username']");
const hasUsername = await usernameInput.count();
if (hasUsername > 0) {
  const candidates = [
    "threadmintofficial",
    "hello.threadmint",
    "threadmint.store",
    "getthreadmint",
    "threadmint.eu",
    "threadmint2026",
    "threadmintbrand",
    "threadmint.hq",
  ];

  let chosenEmail = null;
  for (const name of candidates) {
    await usernameInput.click({ clickCount: 3 });
    await usernameInput.fill(name);
    await page.waitForTimeout(2500);
    const taken = await page.locator(
      "div:has-text('already taken'), div:has-text('not available'), div:has-text('Someone already')"
    ).isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`>> ${name}@gmail.com: ${taken ? "TAKEN" : "AVAILABLE"}`);
    if (!taken) { chosenEmail = name; break; }
  }

  if (chosenEmail) {
    console.log(`>> Chosen: ${chosenEmail}@gmail.com`);
    await page.locator("button:has-text('Next')").first().click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "/home/jalal/Desktop/gmail-after-username.png" });
    console.log(">> URL after username:", page.url());

    // Password
    const pwInputs = page.locator("input[type='password']");
    if (await pwInputs.count() > 0) {
      const password = "ThreadMint2026!";
      await pwInputs.nth(0).fill(password);
      await pwInputs.nth(1).fill(password);
      await page.waitForTimeout(400);
      await page.locator("button:has-text('Next')").first().click();
      await page.waitForTimeout(5000);
      await page.screenshot({ path: "/home/jalal/Desktop/gmail-final.png" });
      console.log(">> Final URL:", page.url());
      console.log(">> ===========================");
      console.log(">> EMAIL:", `${chosenEmail}@gmail.com`);
      console.log(">> PASSWORD: ThreadMint2026!");
      console.log(">> ===========================");
    }
  } else {
    console.log(">> All candidates taken");
  }
} else {
  console.log(">> Not on username step — check gmail-after-bday.png");
}
