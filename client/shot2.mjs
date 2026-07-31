import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto("http://localhost:5183", { waitUntil: "networkidle" });
await page.fill('input[placeholder="Ask Angela..."]', "Where is my presentation file?");
await page.click('button[type="submit"]');
await page.waitForTimeout(200);
const overflow = await page.evaluate(() => ({
  docScrollH: document.documentElement.scrollHeight,
  docClientH: document.documentElement.clientHeight,
}));
console.log(JSON.stringify(overflow));
await page.screenshot({ path: "/tmp/claude-1001/-home-admin-Documents-full-stack-projects-lumina-box/b6fb2299-f323-48bb-909e-88b23a877fe1/scratchpad/sent.png" });
await browser.close();
