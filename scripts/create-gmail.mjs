import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();

await page.goto("https://accounts.google.com/signup/v2/createaccount?flowName=GlifWebSignIn&flowEntry=SignUp", {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-start.png" });

// First name / Last name
const firstNameInput = page.locator("input[name='firstName']");
await firstNameInput.waitFor({ state: "visible", timeout: 10000 });
await firstNameInput.fill("Thread");

const lastNameInput = page.locator("input[name='lastName']");
await lastNameInput.fill("Mint");
await page.waitForTimeout(400);

await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-step2.png" });

// Birthday + gender
try {
  const monthSelect = page.locator("select#month, select[aria-label*='Month']").first();
  await monthSelect.waitFor({ state: "visible", timeout: 5000 });
  await monthSelect.selectOption({ index: 1 }); // January
  await page.locator("input#day, input[aria-label*='Day']").first().fill("15");
  await page.locator("input#year, input[aria-label*='Year']").first().fill("1995");
  const genderSelect = page.locator("select#gender, select[aria-label*='Gender']").first();
  await genderSelect.selectOption({ value: "1" }); // Male or first option
  await page.waitForTimeout(400);
  await page.locator("button:has-text('Next')").first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-step3.png" });
} catch (e) {
  console.log(">> Birthday step skipped or different layout:", e.message);
  await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-birthday-error.png" });
}

// Username selection — try candidates
const candidates = [
  "threadmint.official",
  "threadmintofficial",
  "hello.threadmint",
  "threadmint.store",
  "getthreadmint",
  "threadmint.eu",
  "threadmint2026",
];

let chosenEmail = null;

for (const name of candidates) {
  try {
    const usernameInput = page.locator("input[name='Username'], input[aria-label*='username' i]").first();
    await usernameInput.waitFor({ state: "visible", timeout: 5000 });
    await usernameInput.click({ clickCount: 3 });
    await usernameInput.fill(name);
    await page.waitForTimeout(2000);

    const taken = await page.locator(
      "div:has-text('already taken'), div:has-text('not available'), div:has-text('Someone already has')"
    ).isVisible({ timeout: 1500 }).catch(() => false);

    console.log(`>> ${name}@gmail.com: ${taken ? "TAKEN" : "AVAILABLE"}`);

    if (!taken) {
      chosenEmail = `${name}@gmail.com`;
      break;
    }
  } catch (e) {
    console.log(`>> Error checking ${name}:`, e.message);
  }
}

if (!chosenEmail) {
  await page.screenshot({ path: "/home/jalal/Desktop/gmail-no-username.png" });
  console.log(">> All usernames taken — check screenshot and try manually");
  process.exit(1);
}

console.log(`>> Using: ${chosenEmail}`);
await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(2000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-password.png" });

// Password
const password = "ThreadMint2026!";
const pwInputs = page.locator("input[type='password']");
await pwInputs.nth(0).fill(password);
await pwInputs.nth(1).fill(password);
await page.waitForTimeout(400);

await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-signup-after-pw.png" });
console.log(">> URL after password:", page.url());
console.log(">> Email:", chosenEmail);
console.log(">> Password:", password);
console.log(">> Check gmail-signup-after-pw.png — phone verification may be required");
