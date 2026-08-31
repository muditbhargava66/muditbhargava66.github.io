import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "../../books-app");

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (pathname.startsWith("/books-app/")) {
    pathname = pathname.slice("/books-app".length);
  }
  if (pathname === "/" || pathname === "") pathname = "/index.html";
  const file = path.join(appRoot, pathname);
  if (!file.startsWith(appRoot + path.sep) && file !== appRoot) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}/books-app/index.html`;

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function openPage(viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  await page.goto(base);
  await page.waitForFunction(() => window.__PRESS_LIBRARY__ !== undefined, null, { timeout: 20000 });
  await page.waitForTimeout(2500);
  return { page, consoleErrors };
}

const diag = (page) => page.evaluate(() => window.__PRESS_LIBRARY__.diagnostics());

{
  const { page, consoleErrors } = await openPage({ width: 1440, height: 900 });
  let d = await diag(page);
  check("desktop: 19 books loaded", d.books === 19, `books=${d.books}`);
  check("desktop: starts in browse mode", d.mode === "browse", d.mode);
  check("desktop: no shelf collision at load", d.currentCollision === null && d.collisionRejects === 0, JSON.stringify(d.currentCollision));
  check("desktop: overview framing at load (vPan≈0.5)", Math.abs(d.vPan - 0.5) < 0.05, `vPan=${d.vPan.toFixed(2)}`);

  await page.mouse.move(720, 450);
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(1200);
  d = await diag(page);
  check("desktop: wheel down pans to general shelf", d.vPan > 0.9, `vPan=${d.vPan.toFixed(2)}`);

  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(1200);
  d = await diag(page);
  check("desktop: wheel up pans to tech shelf", d.vPan < 0.1, `vPan=${d.vPan.toFixed(2)}`);

  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel(120, 0);
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(1200);
  d = await diag(page);
  check("desktop: horizontal wheel browses shelf", d.activeIndex > 0, `activeIndex=${d.activeIndex}`);

  await page.evaluate(() => window.__PRESS_LIBRARY__.focus(1));
  await page.waitForTimeout(1800);
  d = await diag(page);
  check("desktop: focus enters inspect mode", d.mode === "inspect", d.mode);

  await page.evaluate(() => window.__PRESS_LIBRARY__.returnToShelf());
  await page.waitForTimeout(1800);
  d = await diag(page);
  check(
    "desktop: return to browse without collisions",
    d.mode === "browse" && d.collisionRejects === 0,
    `mode=${d.mode} rejects=${d.collisionRejects}`
  );

  check("desktop: zero console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
  await page.close();
}

{
  const { page, consoleErrors } = await openPage({ width: 390, height: 844 });
  const d = await diag(page);
  check("mobile: canvas at phone width", d.canvas.clientWidth <= 400, `w=${d.canvas.clientWidth}`);
  check("mobile: portrait starts on tech shelf (vPan≈0)", d.vPan < 0.05, `vPan=${d.vPan.toFixed(2)}`);
  check("mobile: zero console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
  await page.close();
}

await browser.close();
server.close();

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
