import { chromium } from "playwright";

const browser = await chromium.launch();
const sizes = [
  { w: 1440, h: 900 },
  { w: 1366, h: 768 },
  { w: 1920, h: 1080 },
];

for (const { w, h } of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  await page.goto("http://localhost:5183", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const overflow = await page.evaluate(() => ({
    docScrollH: document.documentElement.scrollHeight,
    docClientH: document.documentElement.clientHeight,
    docScrollW: document.documentElement.scrollWidth,
    docClientW: document.documentElement.clientWidth,
  }));
  console.log(w, h, JSON.stringify(overflow), "errors:", errors);

  await page.screenshot({ path: `/tmp/claude-1001/-home-admin-Documents-full-stack-projects-lumina-box/b6fb2299-f323-48bb-909e-88b23a877fe1/scratchpad/vp-${w}x${h}.png` });
  await page.close();
}
await browser.close();
