import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const ctx = browser.contexts()[0];

const cookies = await ctx.cookies(["https://vercel.com"]);
const authCookie = cookies.find(c => c.name === "authorization");
if (authCookie) {
  const token = decodeURIComponent(authCookie.value).replace("Bearer ", "").trim();
  console.log("TOKEN:", token);
} else {
  console.log("No authorization cookie found");
  console.log("All cookie names:", cookies.map(c => c.name).join(", "));
}
