import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];
const page = ctx.pages()[0];

console.log(">> Current URL:", page.url());
await page.screenshot({ path: "/home/jalal/Desktop/gmail-bday-start.png" });

// Birthday: day and year are text inputs, month is likely a select
const monthSelect = page.locator("select").first();
const monthCount = await monthSelect.count();
if (monthCount > 0) {
  await monthSelect.selectOption({ index: 3 }); // March
}

await page.locator("input[name='day']").fill("15");
await page.locator("input[name='year']").fill("1995");
await page.waitForTimeout(400);

// Gender — text input with autocomplete or click option
const genderInput = page.locator("input[aria-label=\"What's your gender?\"]");
const genderCount = await genderInput.count();
if (genderCount > 0) {
  await genderInput.click();
  await page.waitForTimeout(800);
  // Try clicking a dropdown option
  const maleOption = page.locator("li:has-text('Male'), [data-value='1'], span:has-text('Male')").first();
  const maleVisible = await maleOption.isVisible({ timeout: 1500 }).catch(() => false);
  if (maleVisible) {
    await maleOption.click();
  } else {
    await genderInput.fill("Male");
  }
}

await page.waitForTimeout(400);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-bday-filled.png" });

await page.locator("button:has-text('Next')").first().click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "/home/jalal/Desktop/gmail-after-bday.png" });
console.log(">> URL after bday:", page.url());

// Check if we're on the username/email step
const usernameInput = page.locator("input[name='Username']");
const usernameCount = await usernameInput.count();
if (usernameCount > 0) {
  console.log(">> On username step");

  const candidates = [
    "threadmint.official",
    "threadmintofficial",
    "hello.threadmint",
    "threadmint.store",
    "getthreadmint",
    "threadmint.eu",
    "threadmint2026",
    "threadmintbrand",
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

    // Password step
    const pwInput = page.locator("input[type='password']").first();
    const pwCount = await pwInput.count();
    if (pwCount > 0) {
      const password = "ThreadMint2026!";
      await page.locator("input[type='password']").nth(0).fill(password);
      await page.locator("input[type='password']").nth(1).fill(password);
      await page.waitForTimeout(400);
      await page.locator("button:has-text('Next')").first().click();
      await page.waitForTimeout(4000);
      await page.screenshot({ path: "/home/jalal/Desktop/gmail-final.png" });
      console.log(">> Final URL:", page.url());
      console.log(">> EMAIL:", `${chosenEmail}@gmail.com`);
      console.log(">> PASSWORD: ThreadMint2026!");
    }
  } else {
    console.log(">> All usernames taken");
    await page.screenshot({ path: "/home/jalal/Desktop/gmail-no-username.png" });
  }
} else {
  console.log(">> Not on username step — check gmail-after-bday.png");
}
