/**
 * Validación de responsive design del prototipo en múltiples viewports.
 *
 * Recorre 6 viewports (320 → 1920 px) × 3 vistas (Dashboard, Lección, Perfil),
 * mide overflow horizontal y captura screenshots full-page.
 *
 * Pre-requisitos:
 *   1. Servidor HTTP en http://localhost:8080  (cd src && python3 -m http.server 8080)
 *   2. npm install
 *   3. npx playwright install chromium
 *
 * Ejecutar:  node responsive.mjs
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.resolve(__dirname, 'screenshots-responsive');
const REPORT_PATH = path.resolve(__dirname, 'screenshots-responsive/_report.md');
const BASE_URL = 'http://localhost:8080';

const VIEWPORTS = [
  { name: 'mobile-xs', width: 320, height: 568 },
  { name: 'mobile-sm', width: 360, height: 640 },
  { name: 'mobile-md', width: 412, height: 870 },
  { name: 'tablet',    width: 768, height: 1024 },
  { name: 'laptop',    width: 1280, height: 800 },
  { name: 'desktop',   width: 1920, height: 1080 }
];

// Cada entrada describe un screenshot a capturar. `name` se usa para el archivo;
// `enter` es una función async que lleva la página al estado deseado.
const VIEWS = [
  {
    name: 'dashboard',
    enter: async () => {} // estado inicial
  },
  {
    name: 'learn',
    enter: async (page) => {
      await page.click('.nav-btn[data-view="learn"]');
      await page.waitForSelector('.topic-card', { timeout: 5000 });
    }
  },
  {
    name: 'topic-verb-to-be',
    enter: async (page) => {
      await page.click('.nav-btn[data-view="learn"]');
      await page.waitForSelector('.topic-card[data-topic-id="verb-to-be"]', { timeout: 5000 });
      await page.click('.topic-card[data-topic-id="verb-to-be"]');
      await page.waitForSelector('.subject-grid', { timeout: 5000 });
    }
  },
  {
    name: 'lesson',
    enter: async (page) => {
      await page.click('.nav-btn[data-view="lesson"]');
    }
  },
  {
    name: 'profile',
    enter: async (page) => {
      await page.click('.nav-btn[data-view="profile"]');
    }
  }
];

const checks = [];
function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  const tag = ok ? '✓' : '✗';
  console.log(`  ${tag} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function ensureDir(dir) { await mkdir(dir, { recursive: true }); }

async function waitForSW(page) {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg && reg.active);
  }, null, { timeout: 10000 });
}

async function waitForAppReady(page) {
  await page.waitForFunction(() => {
    return document.querySelector('#stat-points') !== null
      && document.querySelector('#btn-next-step') !== null;
  }, null, { timeout: 5000 });
}

async function measureOverflow(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const bodyRect = body.getBoundingClientRect();
    return {
      htmlScrollWidth: html.scrollWidth,
      htmlClientWidth: html.clientWidth,
      bodyWidth: Math.round(bodyRect.width),
      hasHorizontalOverflow: html.scrollWidth - html.clientWidth > 1
    };
  });
}

async function runViewport(browser, vp) {
  console.log(`\n→ ${vp.name} (${vp.width}×${vp.height})`);
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    serviceWorkers: 'allow',
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  if (response.status() !== 200) {
    record(`[${vp.name}] HTTP 200`, false, `got ${response.status()}`);
    await context.close();
    return;
  }

  await waitForSW(page);
  await waitForAppReady(page);

  for (const view of VIEWS) {
    // Volver al dashboard antes de cada vista para resetear estado.
    if (view.name !== 'dashboard') {
      await page.click('.nav-btn[data-view="dashboard"]');
      await page.waitForTimeout(200);
    }
    await view.enter(page);
    // Asegurar render
    await page.waitForTimeout(300);

    const m = await measureOverflow(page);
    const detail = `body=${m.bodyWidth}px scroll=${m.htmlScrollWidth}/${m.htmlClientWidth}`;
    record(`[${vp.name}] ${view.name} sin scroll horizontal`, !m.hasHorizontalOverflow, detail);

    const file = path.join(SCREENSHOTS_DIR, `${vp.name}-${view.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  📸 ${vp.name}-${view.name}.png`);
  }

  await context.close();
}

async function main() {
  console.log(`\n→ Validando responsive en ${BASE_URL}`);
  console.log(`  Viewports: ${VIEWPORTS.length}  ·  Vistas: ${VIEWS.length}  ·  Total checks: ${VIEWPORTS.length * VIEWS.length}\n`);
  await ensureDir(SCREENSHOTS_DIR);

  const browser = await chromium.launch({ headless: true });
  for (const vp of VIEWPORTS) {
    await runViewport(browser, vp);
  }
  await browser.close();

  const passed = checks.filter((c) => c.ok).length;
  const failed = checks.filter((c) => !c.ok).length;
  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`Resumen: ${passed}/${checks.length} OK${failed ? `, ${failed} fallaron` : ''}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`══════════════════════════════════════════════════\n`);

  const report = [
    '# Reporte de validación responsive (Playwright)',
    '',
    `Generado: ${new Date().toISOString()}`,
    `URL: \`${BASE_URL}\``,
    `Resultado: **${passed}/${checks.length}**${failed ? ` · ${failed} fallaron` : ''}`,
    '',
    '## Matriz',
    '',
    '| # | Check | Resultado | Detalle |',
    '|---|-------|-----------|---------|',
    ...checks.map((c, i) => `| ${i + 1} | ${c.name} | ${c.ok ? '✅' : '❌'} | ${c.detail || ''} |`),
    ''
  ].join('\n');
  await writeFile(REPORT_PATH, report, 'utf-8');
  console.log(`Reporte: ${REPORT_PATH}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\nError fatal:', err);
  process.exit(1);
});
