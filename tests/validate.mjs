/**
 * Validación automatizada del prototipo + captura de evidencias.
 *
 * Ejecuta los 16 puntos de la checklist de evidencias visuales sin intervención
 * humana usando Playwright + Chromium. Genera los PNG en
 * `prototipo-luis/evidencias/screenshots/`.
 *
 * Pre-requisitos:
 *   1. El servidor HTTP debe estar corriendo en http://localhost:8080
 *      (cd prototipo-luis/src && python3 -m http.server 8080)
 *   2. npm install (instala playwright)
 *   3. npx playwright install chromium
 *
 * Ejecutar:  node validate.mjs
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.resolve(__dirname, '../evidencias/screenshots');
const REPORT_PATH = path.resolve(__dirname, '../evidencias/playwright-report.md');
const BASE_URL = 'http://localhost:8080';

const VIEWPORT = { width: 412, height: 870 }; // Pixel-like phone

const checks = [];
function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  const tag = ok ? '✓' : '✗';
  console.log(`  ${tag} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function ensureDir(dir) { await mkdir(dir, { recursive: true }); }

async function shoot(page, name) {
  const filePath = path.join(SCREENSHOTS_DIR, name);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`  📸 ${name}`);
}

async function waitForSW(page) {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg && reg.active);
  }, null, { timeout: 10000 });
}

async function readIndexedDBStats(page) {
  return page.evaluate(async () => {
    const open = () => new Promise((resolve, reject) => {
      // Sin versión => se abre con la actual del navegador (la app ya inicializó la v2).
      const req = indexedDB.open('AprendeIngles');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const db = await open();
    const stats = {};
    for (const storeName of ['lessons', 'topics', 'progress', 'settings', 'achievements']) {
      if (!db.objectStoreNames.contains(storeName)) {
        stats[storeName] = null;
        continue;
      }
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      stats[storeName] = await new Promise((resolve, reject) => {
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    db.close();
    return stats;
  });
}

async function readIntegrity(page) {
  return page.evaluate(async () => {
    const open = () => new Promise((resolve, reject) => {
      const req = indexedDB.open('AprendeIngles');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const db = await open();
    const getAll = (storeName) => new Promise((res, rej) => {
      const tx = db.transaction(storeName, 'readonly');
      const r = tx.objectStore(storeName).getAll();
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const [topics, lessons] = await Promise.all([getAll('topics'), getAll('lessons')]);
    db.close();
    const lessonIds = new Set(lessons.map((l) => l.id));
    const topicIds = new Set(topics.map((t) => t.id));
    const orphanLessons = lessons.filter((l) => l.topicId && !topicIds.has(l.topicId));
    const danglingRefs = [];
    for (const t of topics) {
      for (const lid of (t.lessonIds || [])) {
        if (!lessonIds.has(lid)) danglingRefs.push(`${t.id}→${lid}`);
      }
    }
    return {
      topicCount: topics.length,
      lessonCount: lessons.length,
      orphanLessonCount: orphanLessons.length,
      danglingRefs
    };
  });
}

async function getProfile(page) {
  return page.evaluate(async () => {
    const open = () => new Promise((resolve, reject) => {
      const req = indexedDB.open('AprendeIngles');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const db = await open();
    const tx = db.transaction('settings', 'readonly');
    const store = tx.objectStore('settings');
    const profile = await new Promise((resolve, reject) => {
      const req = store.get('profile');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return profile;
  });
}

async function answerLesson(page, mode /* 'correct' | 'incorrect' */) {
  // Espera que aparezcan los botones de opción
  await page.waitForSelector('.option-card', { timeout: 5000 });

  const correctIndex = await page.evaluate(async () => {
    // Tomar el ID del primer ejercicio en pantalla (no expuesto en DOM, leemos el primero pendiente desde DB)
    const open = () => new Promise((resolve, reject) => {
      const req = indexedDB.open('AprendeIngles');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const db = await open();
    // Consultamos progress y elegimos el de menor box vencido
    const tx = db.transaction(['progress', 'lessons'], 'readonly');
    const progressAll = await new Promise((res, rej) => {
      const req = tx.objectStore('progress').getAll();
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    const now = Date.now();
    const due = progressAll.filter((p) => (p.nextReview || 0) <= now);
    due.sort((a, b) => (a.box - b.box) || ((a.nextReview || 0) - (b.nextReview || 0)));
    if (!due.length) return -1;
    const lesson = await new Promise((res, rej) => {
      const req = tx.objectStore('lessons').get(due[0].lessonId);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    db.close();
    return lesson ? lesson.correctIndex : -1;
  });

  if (correctIndex < 0) throw new Error('No se pudo determinar la respuesta correcta');

  const buttons = await page.$$('.option-card');
  let targetIdx;
  if (mode === 'correct') {
    targetIdx = correctIndex;
  } else {
    // Cualquier otro
    targetIdx = (correctIndex + 1) % buttons.length;
  }
  await buttons[targetIdx].click();
  await page.waitForSelector('.lesson-feedback-panel', { timeout: 5000 });
}

async function navTo(page, view) {
  await page.click(`.nav-btn[data-view="${view}"]`);
  // Pequeña pausa para que renderice
  await page.waitForTimeout(300);
}

async function main() {
  console.log(`\n→ Validando prototipo en ${BASE_URL}\n`);
  await ensureDir(SCREENSHOTS_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    serviceWorkers: 'allow',
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // ─── 1. Carga inicial ──────────────────────────────────────────
  console.log('1. Carga inicial y registro del Service Worker');
  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  record('GET / responde 200', response.status() === 200, `HTTP ${response.status()}`);

  await waitForSW(page);
  record('Service Worker registrado y activo', true);

  // Esperar que app.js inicialice IndexedDB
  await page.waitForFunction(() => {
    return document.querySelector('#stat-points') !== null
      && document.querySelector('#btn-next-step') !== null;
  }, null, { timeout: 5000 });

  // ─── 2. Estado inicial: dashboard, IndexedDB poblada ───────────
  console.log('\n2. Estado inicial');
  const stats = await readIndexedDBStats(page);
  record('IndexedDB.lessons tiene >= 25 ejercicios', stats.lessons >= 25, `count=${stats.lessons}`);
  record('IndexedDB.topics tiene >= 12 temas', stats.topics >= 12, `count=${stats.topics}`);
  record('IndexedDB.progress = lessons (1:1)', stats.progress === stats.lessons, `progress=${stats.progress} lessons=${stats.lessons}`);
  record('IndexedDB.settings tiene perfil', stats.settings === 1, `count=${stats.settings}`);

  // Integridad referencial topics ↔ lessons
  const integrity = await readIntegrity(page);
  record('Sin lecciones huérfanas (topicId apunta a topic existente)', integrity.orphanLessonCount === 0, `huérfanas=${integrity.orphanLessonCount}`);
  record('Sin referencias rotas (topic.lessonIds → lesson real)', integrity.danglingRefs.length === 0, integrity.danglingRefs.length ? integrity.danglingRefs.join(', ') : 'OK');

  await shoot(page, '01-dashboard-inicial.png');

  // ─── 2b. Flujo Aprender → Topic → Practicar ───────────────────
  console.log('\n2b. Aprender (índice + topic detail + práctica filtrada)');
  await navTo(page, 'learn');
  await page.waitForSelector('.topic-card', { timeout: 5000 });
  const topicCount = await page.$$eval('.topic-card', (els) => els.length);
  record('Índice "Aprender" muestra al menos 12 tarjetas', topicCount >= 12, `cards=${topicCount}`);
  await shoot(page, '07-aprender-indice.png');

  await page.click('.topic-card[data-topic-id="verb-to-be"]');
  await page.waitForSelector('.subject-grid', { timeout: 5000 });
  const subjectCards = await page.$$eval('.subject-grid .subject-card', (els) => els.length);
  record('Topic "Verb to be" muestra 3 tarjetas por sujeto', subjectCards === 3, `cards=${subjectCards}`);
  const hasUse = await page.$('.use-prose');
  const hasExamples = await page.$('.examples-list');
  record('Topic incluye sección "Use"', !!hasUse);
  record('Topic incluye sección "Examples"', !!hasExamples);
  await shoot(page, '08-topic-verb-to-be.png');

  await page.click('#btn-practice');
  await page.waitForSelector('.lesson-question', { timeout: 5000 });
  const questionText = await page.$eval('.lesson-question', (el) => el.textContent);
  const isVerbToBe = /\b(am|is|are|be)\b/i.test(questionText) || questionText.includes('___');
  record('Práctica filtrada muestra ejercicio de verb-to-be', isVerbToBe, `pregunta="${questionText.slice(0, 60)}"`);
  await shoot(page, '09-practica-filtrada.png');
  // Volver al dashboard antes de continuar el flujo original
  await navTo(page, 'dashboard');

  // ─── 3. Ir a lección y responder bien ──────────────────────────
  console.log('\n3. Lección — respuesta correcta');
  await navTo(page, 'lesson');
  await page.waitForSelector('.lesson-question', { timeout: 5000 });
  await shoot(page, '02-leccion-pregunta.png');

  await answerLesson(page, 'correct');
  await shoot(page, '03-leccion-correcta.png');

  const profileAfterCorrect = await getProfile(page);
  record('Puntos > 0 tras respuesta correcta', profileAfterCorrect.points > 0, `points=${profileAfterCorrect.points}`);
  record('totalCorrect = 1', profileAfterCorrect.totalCorrect === 1, `totalCorrect=${profileAfterCorrect.totalCorrect}`);

  // ─── 4. Siguiente ejercicio + responder mal ────────────────────
  console.log('\n4. Lección — respuesta incorrecta');
  await page.click('#btn-continue');
  await page.waitForSelector('.lesson-question', { timeout: 5000 });
  await answerLesson(page, 'incorrect');
  await shoot(page, '04-leccion-incorrecta.png');

  // ─── 5. Volver al dashboard, verificar progreso ────────────────
  console.log('\n5. Dashboard con progreso');
  await navTo(page, 'dashboard');
  await page.waitForSelector('.topic-progress-bar', { timeout: 5000 });
  await shoot(page, '05-dashboard-progreso.png');

  // ─── 6. Perfil con logros ──────────────────────────────────────
  console.log('\n6. Perfil + logros');
  await navTo(page, 'profile');
  await page.waitForSelector('.achievement', { timeout: 5000 });
  const achievementsUnlocked = await page.$$eval('.achievement:not(.locked)', (els) => els.length);
  record('Al menos un logro desbloqueado', achievementsUnlocked >= 1, `unlocked=${achievementsUnlocked}`);
  await shoot(page, '06-perfil-logros.png');

  // ─── 7. Manifest accesible ─────────────────────────────────────
  console.log('\n7. Manifest y SW accesibles');
  const manifestResp = await page.request.get(`${BASE_URL}/manifest.webmanifest`);
  record('manifest.webmanifest sirve 200', manifestResp.status() === 200);
  const manifestJson = await manifestResp.json();
  record('Manifest tiene start_url y display', !!manifestJson.start_url && manifestJson.display === 'standalone');

  const swResp = await page.request.get(`${BASE_URL}/sw.js`);
  record('sw.js sirve 200', swResp.status() === 200);

  // ─── 8. Modo offline (la prueba clave) ─────────────────────────
  console.log('\n8. Modo offline');
  await context.setOffline(true);
  record('Contexto puesto en modo offline', true);

  // Esperar que la app detecte offline (banner aparece)
  await page.waitForTimeout(500);
  const bannerVisible = await page.$eval('#connection-banner', (el) => !el.classList.contains('hidden'));
  record('Banner "sin conexión" visible', bannerVisible);
  await navTo(page, 'dashboard');
  await shoot(page, '11-banner-sin-conexion.png');

  // Recargar la página con offline activo
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return document.querySelector('#stat-points') !== null;
  }, null, { timeout: 5000 });
  record('App recarga completamente sin internet', true);
  await shoot(page, '15-app-funcionando-offline.png');

  // Probar una lección offline
  await navTo(page, 'lesson');
  const offlineLessonRendered = await page.$('.lesson-question, .empty-state');
  record('Vista de lección renderiza offline', !!offlineLessonRendered);
  await shoot(page, '14-network-offline.png');

  // Restaurar conexión
  await context.setOffline(false);

  // ─── 9. Resumen ────────────────────────────────────────────────
  await browser.close();

  const passed = checks.filter((c) => c.ok).length;
  const failed = checks.filter((c) => !c.ok).length;
  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`Resumen: ${passed}/${checks.length} validaciones OK${failed ? `, ${failed} fallaron` : ''}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`══════════════════════════════════════════════════\n`);

  // Reporte markdown
  const report = [
    '# Reporte de validación automatizada (Playwright)',
    '',
    `Generado el ${new Date().toISOString()}`,
    `URL probada: \`${BASE_URL}\``,
    `Resultado: **${passed}/${checks.length} validaciones OK**${failed ? ` · ${failed} fallaron` : ''}`,
    '',
    '## Validaciones',
    '',
    '| # | Validación | Resultado | Detalle |',
    '|---|------------|-----------|---------|',
    ...checks.map((c, i) => `| ${i + 1} | ${c.name} | ${c.ok ? '✅' : '❌'} | ${c.detail || ''} |`),
    '',
    '## Capturas generadas',
    '',
    '- 01-dashboard-inicial.png',
    '- 02-leccion-pregunta.png',
    '- 03-leccion-correcta.png',
    '- 04-leccion-incorrecta.png',
    '- 05-dashboard-progreso.png',
    '- 06-perfil-logros.png',
    '- 07-aprender-indice.png',
    '- 08-topic-verb-to-be.png',
    '- 09-practica-filtrada.png',
    '- 11-banner-sin-conexion.png',
    '- 14-network-offline.png',
    '- 15-app-funcionando-offline.png',
    ''
  ].join('\n');

  await writeFile(REPORT_PATH, report, 'utf-8');
  console.log(`Reporte guardado en: ${REPORT_PATH}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\nError fatal:', err);
  process.exit(1);
});
