/**
 * Bootstrap, router y vistas del prototipo.
 *
 * Orquesta los módulos DB, Leitner y Gamification para producir la
 * experiencia del estudiante. Implementa un router minimalista de 4 vistas
 * (Dashboard, Aprender, Lección, Perfil) y reacciona a eventos de conectividad.
 */
let currentLesson = null;
let currentTopicId = null;
let currentLessonTopicId = null;

// Estado de la sesión de práctica (visible en el header de la lección).
// Se reinicia al entrar "fresco" a la vista; se preserva al pasar al siguiente
// ejercicio dentro de la misma sesión.
const SESSION_TARGET = 10;
let sessionState = { count: 0, correctStreak: 0, target: SESSION_TARGET, topicId: null };
function resetSessionState(topicId) {
  sessionState = { count: 0, correctStreak: 0, target: SESSION_TARGET, topicId: topicId || null };
}

// Atajos de teclado en la vista de lección.
// Se reemplaza el handler en cada render (selección de opción ↔ avanzar feedback)
// y se elimina al salir de la vista.
let lessonKbController = null;
function setLessonKeyboard(handler) {
  if (lessonKbController) lessonKbController.abort();
  lessonKbController = null;
  if (!handler) return;
  lessonKbController = new AbortController();
  document.addEventListener('keydown', handler, { signal: lessonKbController.signal });
}

function closeFeedbackPanel() {
  document.body.classList.remove('feedback-open');
  const panel = document.getElementById('feedback-panel');
  if (panel) panel.remove();
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function el(id) { return document.getElementById(id); }
function appMain() { return el('app'); }

/* Conectividad ----------------------------------------------------------- */
function updateConnectionBanner() {
  const banner = el('connection-banner');
  if (!banner) return;
  if (navigator.onLine) {
    banner.classList.add('hidden');
    banner.classList.remove('online');
  } else {
    banner.textContent = '⚡ Estás sin conexión. La aplicación sigue funcionando.';
    banner.classList.remove('hidden', 'online');
  }
}

function flashOnline() {
  const banner = el('connection-banner');
  if (!banner) return;
  banner.textContent = '✓ Conexión restablecida.';
  banner.classList.add('online');
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 3000);
}

/* Header stats ----------------------------------------------------------- */
async function renderStats() {
  const profile = await DB.getProfile();
  el('stat-points').textContent = profile.points || 0;
  el('stat-streak').textContent = profile.streak || 0;
  el('stat-level').textContent = profile.level || 1;
}

/* Router ----------------------------------------------------------------- */
async function navigate(view, params) {
  // El tab "Lección" desde la nav inferior reinicia el filtro de topic.
  // Cuando navega('lesson', { topicId }) viene desde un topic, se preserva.
  if (view !== 'lesson') {
    setLessonKeyboard(null);
    closeFeedbackPanel();
  }
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  await renderStats();
  if (view === 'lesson')  return renderLesson(params);
  if (view === 'topic')   return renderTopic((params && params.topicId) || currentTopicId);
  if (view === 'learn')   return renderLearn();
  if (view === 'profile') return renderProfile();
  return renderDashboard();
}

/* Dashboard -------------------------------------------------------------- */

/**
 * Stamp YYYY-MM-DD en UTC. Duplicado de gamification.js para no acoplar los
 * módulos vía nuevos globales (los scripts no son módulos ES).
 */
function dashDayStamp(timestamp) {
  const d = new Date(timestamp);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

const WEEK_DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MS_PER_DAY_DASH = 24 * 60 * 60 * 1000;

/**
 * Devuelve los últimos 7 días (de hace-6 a hoy) marcando cuáles tuvieron actividad.
 */
function summarizeWeeklyStreak(activeDays) {
  const set = new Set(Array.isArray(activeDays) ? activeDays : []);
  const todayMs = Date.now();
  const todayStamp = dashDayStamp(todayMs);
  const out = [];
  for (let i = 6; i >= 0; i -= 1) {
    const ts = todayMs - i * MS_PER_DAY_DASH;
    const d = new Date(ts);
    const stamp = dashDayStamp(ts);
    out.push({
      label: WEEK_DAY_LABELS[d.getUTCDay()],
      stamp,
      isToday: stamp === todayStamp,
      isActive: set.has(stamp)
    });
  }
  return out;
}

/**
 * De los topics empezados, prioriza los que tienen más ejercicios pendientes
 * y luego los más cercanos a dominarse. Corta a `max`.
 */
function pickStartedTopics(topicSummary, max) {
  const limit = max || 3;
  return topicSummary.perTopic
    .filter((t) => t.isStarted && t.total > 0)
    .sort((a, b) => {
      if ((b.dueInTopic || 0) !== (a.dueInTopic || 0)) return (b.dueInTopic || 0) - (a.dueInTopic || 0);
      const ar = a.mastered / a.total;
      const br = b.mastered / b.total;
      return br - ar;
    })
    .slice(0, limit);
}

/**
 * Decide qué logro destacar: el último desbloqueado y el siguiente a alcanzar
 * con su porcentaje aproximado de progreso.
 */
function pickAchievementSpotlight(profile, unlocked, boxDist) {
  const defs = (typeof Gamification !== 'undefined' && Gamification.achievementDefs) || [];
  const unlockedById = new Map(unlocked.map((a) => [a.id, a]));

  let recent = null;
  for (const a of unlocked) {
    if (!recent || (a.unlockedAt || 0) > (recent.unlockedAt || 0)) recent = a;
  }

  const highestBox = (() => {
    const boxes = (boxDist && boxDist.boxes) || [];
    let mx = 0;
    for (let i = 0; i < boxes.length; i += 1) if ((boxes[i] || 0) > 0) mx = i + 1;
    return mx;
  })();

  function progressFor(id) {
    switch (id) {
      case 'first-correct': return { current: Math.min(profile.totalCorrect || 0, 1), target: 1 };
      case 'streak-7':      return { current: Math.min(profile.streak || 0, 7), target: 7 };
      case 'box-5':         return { current: Math.min(highestBox, 5), target: 5 };
      case 'level-2':       return { current: Math.min(profile.level || 1, 2), target: 2 };
      case 'level-5':       return { current: Math.min(profile.level || 1, 5), target: 5 };
      default:              return null;
    }
  }

  let next = null;
  for (const def of defs) {
    if (unlockedById.has(def.id)) continue;
    next = { def, progress: progressFor(def.id) };
    break;
  }

  return { recent, next };
}

/**
 * Resume el estado del estudiante por topic:
 *   - dominated: todos los ejercicios del topic están en caja ≥4
 *   - started: al menos un ejercicio respondido (attempts ≥1) pero no dominated
 *   - untouched: ningún ejercicio respondido aún
 */
function summarizeTopics(topics, lessons, progressById) {
  const lessonsByTopic = new Map();
  for (const l of lessons) {
    if (!l.topicId) continue;
    if (!lessonsByTopic.has(l.topicId)) lessonsByTopic.set(l.topicId, []);
    lessonsByTopic.get(l.topicId).push(l);
  }

  let dominated = 0, started = 0, untouched = 0;
  const perTopic = [];
  for (const topic of topics) {
    const list = lessonsByTopic.get(topic.id) || [];
    if (list.length === 0) { untouched += 1; continue; }
    let attempted = 0, mastered = 0, dueInTopic = 0;
    const now = Date.now();
    for (const l of list) {
      const p = progressById.get(l.id);
      if (!p) continue;
      if ((p.attempts || 0) > 0) attempted += 1;
      if ((p.box || 1) >= 4) mastered += 1;
      if ((p.nextReview || 0) <= now) dueInTopic += 1;
    }
    const isDominated = list.length > 0 && mastered === list.length;
    const isStarted = attempted > 0 && !isDominated;
    if (isDominated) dominated += 1;
    else if (isStarted) started += 1;
    else untouched += 1;
    perTopic.push({ topic, total: list.length, mastered, attempted, dueInTopic, isDominated, isStarted });
  }
  return { totalTopics: topics.length, dominated, started, untouched, perTopic };
}

/**
 * Resume el estado Leitner en 3 buckets más comprensibles para el estudiante
 * que las 5 cajas crudas: por aprender (caja 1), aprendiendo (cajas 2–3),
 * dominados (cajas 4–5).
 */
function summarizeLeitner(boxes) {
  return {
    porAprender: boxes[0] || 0,
    aprendiendo: (boxes[1] || 0) + (boxes[2] || 0),
    dominados: (boxes[3] || 0) + (boxes[4] || 0)
  };
}

/**
 * Decide la acción más útil en el "Próximo paso" según el estado del usuario.
 */
function pickNextStep(profile, topicSummary, dueCount) {
  // Usuario nuevo: nunca ha respondido nada.
  if ((profile.totalAnswered || 0) === 0) {
    const sorted = topicSummary.perTopic.slice()
      .filter((t) => t.total > 0)
      .sort((a, b) => (a.topic.order || 0) - (b.topic.order || 0));
    const first = sorted[0];
    if (first) {
      return {
        kind: 'first',
        title: 'Empieza tu primer tema',
        body: `Te recomendamos comenzar con <strong>${escapeHtml(first.topic.title)}</strong>. Lee la teoría y luego practica.`,
        ctaLabel: `Empezar con ${first.topic.title} →`,
        action: () => navigate('topic', { topicId: first.topic.id })
      };
    }
  }

  // Topic en curso con ejercicios pendientes: priorizar el de más due.
  const continueTopic = topicSummary.perTopic
    .filter((t) => t.isStarted && t.dueInTopic > 0)
    .sort((a, b) => b.dueInTopic - a.dueInTopic)[0];
  if (continueTopic) {
    return {
      kind: 'continue',
      title: 'Continúa donde lo dejaste',
      body: `Tienes <strong>${continueTopic.dueInTopic}</strong> ejercicio${continueTopic.dueInTopic === 1 ? '' : 's'} pendiente${continueTopic.dueInTopic === 1 ? '' : 's'} en <strong>${escapeHtml(continueTopic.topic.title)}</strong>.`,
      ctaLabel: `Practicar ${continueTopic.topic.title} →`,
      action: () => navigate('lesson', { topicId: continueTopic.topic.id })
    };
  }

  // Hay ejercicios pendientes en general (de topics aún no empezados).
  if (dueCount > 0) {
    return {
      kind: 'practice',
      title: 'Listo para practicar',
      body: `Tienes <strong>${dueCount}</strong> ejercicio${dueCount === 1 ? '' : 's'} listo${dueCount === 1 ? '' : 's'} para revisar.`,
      ctaLabel: 'Comenzar lección →',
      action: () => navigate('lesson')
    };
  }

  // Todo al día: invitar a explorar.
  return {
    kind: 'explore',
    title: '¡Todo al día!',
    body: 'No hay ejercicios pendientes. Explora un nuevo tema para seguir aprendiendo.',
    ctaLabel: 'Explorar temas →',
    action: () => navigate('learn')
  };
}

async function renderDashboard() {
  const [topics, lessons, allProgress, profile, dueCount, boxDist, achievements] = await Promise.all([
    DB.getAllTopics(),
    DB.getAllLessons(),
    DB.getAllProgress(),
    DB.getProfile(),
    Leitner.dueCount(),
    DB.getBoxDistribution(),
    DB.getAllAchievements()
  ]);
  const progressById = new Map(allProgress.map((p) => [p.lessonId, p]));

  const topicSummary = summarizeTopics(topics || [], lessons || [], progressById);
  const leitner = summarizeLeitner(boxDist.boxes || []);
  const totalLessons = boxDist.total || 0;
  const accuracy = profile.totalAnswered
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
    : 0;

  const nextStep = pickNextStep(profile, topicSummary, dueCount);
  const namePart = profile.name ? `, ${escapeHtml(profile.name)}` : '';
  const greeting = (profile.totalAnswered || 0) === 0
    ? `Hola 👋${namePart}`
    : `Hola de nuevo 👋${namePart}`;

  // Hero: chip de racha (solo si hay días).
  const streak = profile.streak || 0;
  const heroStreakChip = streak > 0
    ? `<span class="lesson-streak-chip" title="Racha actual"><span aria-hidden="true">🔥</span>${streak} días</span>`
    : '';

  // Racha semanal visual (últimos 7 días).
  const weekDays = summarizeWeeklyStreak(profile.activeDays || []);
  const weekDaysHtml = weekDays.map((day) => {
    const cls = ['streak-day'];
    if (day.isActive) cls.push('is-active');
    if (day.isToday) cls.push('is-today');
    const mark = day.isActive ? '🔥' : '·';
    const aria = `${day.label} ${day.stamp}${day.isActive ? ' (activo)' : ''}${day.isToday ? ' (hoy)' : ''}`;
    return `
      <div class="${cls.join(' ')}" aria-label="${escapeHtml(aria)}">
        <span class="streak-day-label">${day.label}</span>
        <span class="streak-day-mark" aria-hidden="true">${mark}</span>
      </div>
    `;
  }).join('');
  const activeThisWeek = weekDays.filter((d) => d.isActive).length;

  // Acceso rápido a temas en curso.
  const continueTopics = pickStartedTopics(topicSummary, 3);
  const continueTopicsHtml = continueTopics.length === 0 ? '' : `
    <section class="card card-continue-topics">
      <h3 class="dashboard-subhead">Continúa con tus temas</h3>
      <ul class="continue-topics-list">
        ${continueTopics.map((t) => {
          const pct = t.total > 0 ? Math.round((t.mastered / t.total) * 100) : 0;
          const icon = TOPIC_ICONS[t.topic.id] || '📘';
          const dueLabel = t.dueInTopic > 0
            ? ` · <strong>${t.dueInTopic}</strong> hoy`
            : '';
          return `
            <li class="continue-topic-row" data-topic-id="${escapeHtml(t.topic.id)}">
              <span class="continue-topic-icon" aria-hidden="true">${icon}</span>
              <div class="continue-topic-body">
                <p class="continue-topic-title">${escapeHtml(t.topic.title)}</p>
                <div class="topic-card-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Dominio del tema">
                  <span style="width: ${pct}%"></span>
                </div>
                <p class="continue-topic-meta">${t.mastered}/${t.total} dominado${t.total === 1 ? '' : 's'}${dueLabel}</p>
              </div>
              <button class="btn btn-small continue-topic-cta" data-action="practice" data-topic-id="${escapeHtml(t.topic.id)}" type="button" aria-label="Practicar ${escapeHtml(t.topic.title)}">▶</button>
            </li>
          `;
        }).join('')}
      </ul>
    </section>
  `;

  // Barra apilada (dominados / empezados / por explorar).
  const tt = Math.max(topicSummary.totalTopics, 1);
  const pctDominated = Math.round((topicSummary.dominated / tt) * 100);
  const pctStarted = Math.round((topicSummary.started / tt) * 100);
  const pctUntouched = Math.max(0, 100 - pctDominated - pctStarted);

  // Spotlight de logros.
  const spotlight = pickAchievementSpotlight(profile, achievements || [], boxDist);
  const spotlightRecentHtml = spotlight.recent ? `
    <div class="spotlight-recent">
      <span class="spotlight-recent-icon" aria-hidden="true">${spotlight.recent.icon}</span>
      <div class="spotlight-recent-body">
        <p class="spotlight-recent-kicker">Último logro</p>
        <p class="spotlight-recent-title">${escapeHtml(spotlight.recent.title)}</p>
      </div>
    </div>
  ` : '';
  const spotlightNextHtml = spotlight.next ? (() => {
    const { def, progress } = spotlight.next;
    const pct = progress && progress.target ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0;
    const barHtml = progress ? `
      <div class="lesson-session-bar spotlight-next-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progreso hacia ${escapeHtml(def.title)}">
        <span style="width: ${pct}%"></span>
      </div>
      <p class="spotlight-next-meta">${progress.current} / ${progress.target}</p>
    ` : '';
    return `
      <div class="spotlight-next">
        <p class="spotlight-next-kicker">Próximo logro</p>
        <p class="spotlight-next-title"><span aria-hidden="true">${def.icon}</span> ${escapeHtml(def.title)}</p>
        <p class="spotlight-next-desc">${escapeHtml(def.desc)}</p>
        ${barHtml}
      </div>
    `;
  })() : '';
  const spotlightHtml = (spotlightRecentHtml || spotlightNextHtml) ? `
    <section class="card card-achievement-spotlight">
      <h3 class="dashboard-subhead">Logros</h3>
      ${spotlightRecentHtml}
      ${spotlightNextHtml}
      <button class="btn btn-secondary btn-small spotlight-cta" id="btn-go-profile" type="button">Ver todos →</button>
    </section>
  ` : '';

  appMain().innerHTML = `
    <h1>${greeting}</h1>

    <section class="card card-next-step dashboard-hero">
      <div class="dashboard-hero-meta">
        <span class="next-step-kicker">Próximo paso</span>
        ${heroStreakChip}
      </div>
      <h2>${escapeHtml(nextStep.title)}</h2>
      <p>${nextStep.body}</p>
      <button class="btn" id="btn-next-step" type="button">${escapeHtml(nextStep.ctaLabel)}</button>
    </section>

    <section class="card card-streak-week">
      <div class="streak-week-head">
        <h3 class="dashboard-subhead">Tu semana</h3>
        <span class="streak-week-summary">${activeThisWeek}/7 día${activeThisWeek === 1 ? '' : 's'}</span>
      </div>
      <div class="streak-week-grid" role="img" aria-label="Actividad de los últimos 7 días: ${activeThisWeek} día${activeThisWeek === 1 ? '' : 's'} con práctica">
        ${weekDaysHtml}
      </div>
    </section>

    ${continueTopicsHtml}

    <section class="card">
      <h2>Tu camino</h2>
      <p class="muted">
        <strong>${topicSummary.dominated}</strong> de ${topicSummary.totalTopics} tema${topicSummary.totalTopics === 1 ? '' : 's'} dominado${topicSummary.dominated === 1 ? '' : 's'}.
      </p>
      <div class="topic-progress-bar" role="img" aria-label="${topicSummary.dominated} dominados, ${topicSummary.started} en curso, ${topicSummary.untouched} sin empezar">
        <span class="seg seg-dominated" style="width: ${pctDominated}%"></span>
        <span class="seg seg-started" style="width: ${pctStarted}%"></span>
        <span class="seg seg-untouched" style="width: ${pctUntouched}%"></span>
      </div>
      <ul class="topic-progress-legend">
        <li><span class="dot dot-dominated"></span>Dominados <strong>${topicSummary.dominated}</strong></li>
        <li><span class="dot dot-started"></span>En curso <strong>${topicSummary.started}</strong></li>
        <li><span class="dot dot-untouched"></span>Por explorar <strong>${topicSummary.untouched}</strong></li>
      </ul>
      <button class="btn btn-secondary" id="btn-go-learn" type="button">Ver todos los temas →</button>
    </section>

    <div class="dashboard-grid">
      <section class="card card-leitner-compact">
        <p class="leitner-compact-title">Sistema Leitner · ${totalLessons} ejercicio${totalLessons === 1 ? '' : 's'}</p>
        <ul class="leitner-compact-list">
          <li><span class="leitner-icon" aria-hidden="true">📥</span>Por aprender <strong>${leitner.porAprender}</strong></li>
          <li><span class="leitner-icon" aria-hidden="true">🔄</span>Aprendiendo <strong>${leitner.aprendiendo}</strong></li>
          <li><span class="leitner-icon" aria-hidden="true">✅</span>Dominados <strong>${leitner.dominados}</strong></li>
        </ul>
        <p class="muted leitner-compact-foot">Ver detalle por caja en tu Perfil.</p>
      </section>

      <section class="card">
        <h2>Tus números</h2>
        <p>Respondidas: <strong>${profile.totalAnswered || 0}</strong></p>
        <p>Aciertos: <strong>${profile.totalCorrect || 0}</strong>${profile.totalAnswered ? ` (${accuracy}%)` : ''}</p>
      </section>
    </div>

    ${spotlightHtml}
  `;

  el('btn-next-step').addEventListener('click', nextStep.action);
  el('btn-go-learn').addEventListener('click', () => navigate('learn'));
  const goProfile = el('btn-go-profile');
  if (goProfile) goProfile.addEventListener('click', () => navigate('profile'));

  document.querySelectorAll('.continue-topic-row').forEach((row) => {
    const topicId = row.dataset.topicId;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      navigate('topic', { topicId });
    });
  });
  document.querySelectorAll('.continue-topic-row [data-action="practice"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('lesson', { topicId: btn.dataset.topicId });
    });
  });
}

/* Lesson ----------------------------------------------------------------- */
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* =========================================================================
 * Dispatcher de formatos de lección
 *
 * Cada lección lleva un campo opcional `format` ∈
 *   { 'multiple-choice', 'true-false', 'fill-blank', 'word-order', 'matching' }
 * Default: 'multiple-choice' (retro-compatibilidad para lecciones sin format).
 *
 * Tres puntos de extensión:
 *   - renderQuestion(lesson)              → HTML del cuerpo de la pregunta.
 *   - bindAnswerHandlers(lesson)          → listeners + atajos de teclado.
 *   - evaluateAnswer(lesson, userInput)   → boolean.
 *   - applyAnswerFeedback(lesson, userInput, isCorrect) → marcas visuales.
 *
 * El motor Leitner es format-agnóstico: solo recibe el boolean.
 * ========================================================================= */

const FORMAT_DEFAULT = 'multiple-choice';

function lessonFormat(lesson) {
  return (lesson && lesson.format) || FORMAT_DEFAULT;
}

function renderQuestion(lesson) {
  switch (lessonFormat(lesson)) {
    case 'multiple-choice': return renderMultipleChoice(lesson);
    case 'true-false':      return renderTrueFalse(lesson);
    case 'fill-blank':      return renderFillBlank(lesson);
    case 'word-order':      return renderWordOrder(lesson);
    case 'matching':        return renderMatching(lesson);
    default:
      console.warn('Formato de lección desconocido:', lessonFormat(lesson), '— usando multiple-choice');
      return renderMultipleChoice(lesson);
  }
}

function bindAnswerHandlers(lesson) {
  switch (lessonFormat(lesson)) {
    case 'multiple-choice': bindMultipleChoiceHandlers(lesson); break;
    case 'true-false':      bindTrueFalseHandlers(lesson); break;
    case 'fill-blank':      bindFillBlankHandlers(lesson); break;
    case 'word-order':      bindWordOrderHandlers(lesson); break;
    case 'matching':        bindMatchingHandlers(lesson); break;
  }
}

function evaluateAnswer(lesson, userInput) {
  switch (lessonFormat(lesson)) {
    case 'multiple-choice': return userInput === lesson.correctIndex;
    case 'true-false':      return userInput === lesson.correctAnswer;
    case 'fill-blank':      return evaluateFillBlank(lesson, userInput);
    case 'word-order':      return JSON.stringify(userInput) === JSON.stringify(lesson.tokens);
    case 'matching':        return userInput === true; // matching dispara handleAnswer ya con boolean
    default: return false;
  }
}

function applyAnswerFeedback(lesson, userInput, isCorrect) {
  switch (lessonFormat(lesson)) {
    case 'multiple-choice': applyMultipleChoiceFeedback(lesson, userInput, isCorrect); break;
    case 'true-false':      applyTrueFalseFeedback(lesson, userInput, isCorrect); break;
    case 'fill-blank':      applyFillBlankFeedback(lesson, userInput, isCorrect); break;
    case 'word-order':      applyWordOrderFeedback(lesson, userInput, isCorrect); break;
    case 'matching':        /* feedback inline durante el match; nada extra al final */ break;
  }
}

function shuffleArrayDifferent(arr) {
  // Fisher-Yates; reintenta hasta máximo 8 veces si por azar queda igual.
  if (arr.length <= 1) return arr.slice();
  for (let attempt = 0; attempt < 8; attempt++) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.some((v, i) => v !== arr[i])) return a;
  }
  // Caso degenerado: intercambia los dos primeros.
  const a = arr.slice();
  if (a.length >= 2) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function normalizeAnswer(s) {
  if (s == null) return '';
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/* --- multiple-choice ----------------------------------------------------- */

function renderMultipleChoice(lesson) {
  const optionsHtml = lesson.options.map((opt, i) => `
    <li>
      <button class="option-card" data-index="${i}" type="button">
        <span class="option-letter" aria-hidden="true">${OPTION_LETTERS[i] || (i + 1)}</span>
        <span class="option-text">${escapeHtml(opt)}</span>
      </button>
    </li>
  `).join('');
  return `
    <p class="lesson-question">${escapeHtml(lesson.question)}</p>
    <ul class="options-list" id="options-container">${optionsHtml}</ul>
  `;
}

function bindMultipleChoiceHandlers(lesson) {
  document.querySelectorAll('.option-card').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index, 10)));
  });

  // Atajos de teclado: 1-9 / A-Z para seleccionar la opción correspondiente.
  const optionCount = lesson.options.length;
  setLessonKeyboard((e) => {
    const tag = e.target && e.target.tagName;
    if (tag && /^(input|textarea|select)$/i.test(tag)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    let idx = -1;
    if (/^[1-9]$/.test(e.key)) idx = parseInt(e.key, 10) - 1;
    else if (/^[a-zA-Z]$/.test(e.key)) idx = e.key.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < optionCount) {
      e.preventDefault();
      const btn = document.querySelector(`.option-card[data-index="${idx}"]`);
      if (btn && !btn.disabled) btn.click();
    }
  });
}

function applyMultipleChoiceFeedback(lesson, selectedIndex, isCorrect) {
  document.querySelectorAll('.option-card').forEach((btn, i) => {
    btn.disabled = true;
    if (i === lesson.correctIndex) btn.classList.add('correct');
    else if (i === selectedIndex && !isCorrect) btn.classList.add('incorrect');
  });
  if (!isCorrect) {
    const wrong = document.querySelector(`.option-card[data-index="${selectedIndex}"]`);
    if (wrong) {
      wrong.classList.add('shake');
      wrong.addEventListener('animationend', () => wrong.classList.remove('shake'), { once: true });
    }
  }
}

/* --- true-false ---------------------------------------------------------- */

function renderTrueFalse(lesson) {
  return `
    <p class="lesson-statement">${escapeHtml(lesson.statement)}</p>
    <ul class="options-list options-list-tf" id="options-container">
      <li>
        <button class="option-card option-card-tf" data-tf="true" type="button">
          <span class="option-letter" aria-hidden="true">✓</span>
          <span class="option-text">Verdadero</span>
        </button>
      </li>
      <li>
        <button class="option-card option-card-tf" data-tf="false" type="button">
          <span class="option-letter" aria-hidden="true">✕</span>
          <span class="option-text">Falso</span>
        </button>
      </li>
    </ul>
  `;
}

function bindTrueFalseHandlers(lesson) {
  document.querySelectorAll('.option-card-tf').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.tf === 'true'));
  });
  // Atajos: V/F (verdadero/falso) y T/F (true/false).
  setLessonKeyboard((e) => {
    const tag = e.target && e.target.tagName;
    if (tag && /^(input|textarea|select)$/i.test(tag)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    let val = null;
    if (/^[vVtT1]$/.test(e.key)) val = 'true';
    else if (/^[fF0]$/.test(e.key)) val = 'false';
    if (val !== null) {
      e.preventDefault();
      const btn = document.querySelector(`.option-card-tf[data-tf="${val}"]`);
      if (btn && !btn.disabled) btn.click();
    }
  });
}

function applyTrueFalseFeedback(lesson, userAnswer, isCorrect) {
  document.querySelectorAll('.option-card-tf').forEach((btn) => {
    btn.disabled = true;
    const btnVal = btn.dataset.tf === 'true';
    if (btnVal === lesson.correctAnswer) btn.classList.add('correct');
    else if (btnVal === userAnswer && !isCorrect) btn.classList.add('incorrect');
  });
  if (!isCorrect) {
    const wrong = document.querySelector(`.option-card-tf[data-tf="${userAnswer}"]`);
    if (wrong) {
      wrong.classList.add('shake');
      wrong.addEventListener('animationend', () => wrong.classList.remove('shake'), { once: true });
    }
  }
}

/* --- fill-blank ---------------------------------------------------------- */

function renderFillBlank(lesson) {
  // Reemplaza '___' (uno o más guiones bajos) por un input. Tres _ es la
  // convención del seed; aceptamos 2+ para tolerancia.
  const parts = escapeHtml(lesson.question).split(/_{2,}/);
  const safeParts = parts.length === 2
    ? parts
    : [escapeHtml(lesson.question), '']; // fallback: input al final
  const html = `${safeParts[0]}<input
    type="text"
    id="fill-blank-input"
    class="fill-blank-input"
    autocomplete="off"
    autocapitalize="off"
    autocorrect="off"
    spellcheck="false"
    aria-label="Escribe la palabra que falta"
  >${safeParts[1]}`;
  return `
    <p class="lesson-question lesson-question-fill">${html}</p>
    <div class="fill-blank-actions">
      <button class="btn" id="btn-check-fill" type="button" disabled>Comprobar</button>
    </div>
  `;
}

function bindFillBlankHandlers(lesson) {
  const input = document.getElementById('fill-blank-input');
  const checkBtn = document.getElementById('btn-check-fill');
  if (!input || !checkBtn) return;

  const submit = () => {
    if (input.disabled) return;
    handleAnswer(input.value);
  };
  input.addEventListener('input', () => {
    checkBtn.disabled = input.value.trim().length === 0;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!checkBtn.disabled) submit();
    }
  });
  checkBtn.addEventListener('click', submit);

  setLessonKeyboard(null);
  // Foco diferido para que el teclado móvil no salte sobre la animación.
  setTimeout(() => input.focus(), 50);
}

function evaluateFillBlank(lesson, userInput) {
  const norm = normalizeAnswer(userInput);
  if (!norm) return false;
  return (lesson.acceptedAnswers || []).some((a) => normalizeAnswer(a) === norm);
}

function applyFillBlankFeedback(lesson, userInput, isCorrect) {
  const input = document.getElementById('fill-blank-input');
  const checkBtn = document.getElementById('btn-check-fill');
  if (!input) return;
  input.disabled = true;
  if (checkBtn) checkBtn.disabled = true;
  input.classList.add(isCorrect ? 'correct' : 'incorrect');
  if (!isCorrect) {
    input.classList.add('shake');
    input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
    // Mostrar la respuesta esperada al lado del input (la primera variante).
    const expected = (lesson.acceptedAnswers || [])[0];
    if (expected) {
      const tag = document.createElement('span');
      tag.className = 'fill-blank-expected';
      tag.textContent = `→ ${expected}`;
      input.insertAdjacentElement('afterend', tag);
    }
  }
}

/* --- word-order ---------------------------------------------------------- */

function renderWordOrder(lesson) {
  const shuffled = shuffleArrayDifferent(lesson.tokens || []);
  const bankHtml = shuffled.map((tok, i) =>
    `<button class="word-tile" data-token-idx="${i}" type="button">${escapeHtml(tok)}</button>`
  ).join('');
  return `
    <p class="lesson-question">${escapeHtml(lesson.instruction || 'Ordena las palabras para formar la oración.')}</p>
    <div class="word-answer" id="word-answer" role="list" aria-label="Tu respuesta"></div>
    <div class="word-bank" id="word-bank" role="list" aria-label="Banco de palabras">${bankHtml}</div>
    <div class="fill-blank-actions">
      <button class="btn" id="btn-check-word" type="button" disabled>Comprobar</button>
    </div>
  `;
}

function bindWordOrderHandlers(lesson) {
  const bank = document.getElementById('word-bank');
  const answer = document.getElementById('word-answer');
  const checkBtn = document.getElementById('btn-check-word');
  if (!bank || !answer || !checkBtn) return;

  const totalTokens = (lesson.tokens || []).length;

  const refreshCheckButton = () => {
    checkBtn.disabled = answer.querySelectorAll('.word-tile').length !== totalTokens;
  };

  bank.addEventListener('click', (e) => {
    const tile = e.target.closest('.word-tile');
    if (!tile || tile.disabled) return;
    answer.appendChild(tile);
    refreshCheckButton();
  });
  answer.addEventListener('click', (e) => {
    const tile = e.target.closest('.word-tile');
    if (!tile || tile.disabled) return;
    bank.appendChild(tile);
    refreshCheckButton();
  });

  checkBtn.addEventListener('click', () => {
    const order = Array.from(answer.querySelectorAll('.word-tile')).map((t) => t.textContent);
    handleAnswer(order);
  });

  setLessonKeyboard(null);
}

/* --- matching ------------------------------------------------------------ */

function renderMatching(lesson) {
  const pairs = lesson.pairs || [];
  const enShuffled = shuffleArrayDifferent(pairs.map((p, i) => ({ key: 'en', idx: i, text: p.en })));
  const esShuffled = shuffleArrayDifferent(pairs.map((p, i) => ({ key: 'es', idx: i, text: p.es })));
  const colHtml = (items) => items.map((it) =>
    `<button class="matching-item" data-side="${it.key}" data-pair="${it.idx}" type="button">${escapeHtml(it.text)}</button>`
  ).join('');
  return `
    <p class="lesson-question">${escapeHtml(lesson.instruction || 'Empareja cada palabra en inglés con su traducción.')}</p>
    <div class="matching-grid">
      <div class="matching-col" id="matching-col-en" aria-label="Inglés">${colHtml(enShuffled)}</div>
      <div class="matching-col" id="matching-col-es" aria-label="Español">${colHtml(esShuffled)}</div>
    </div>
    <p class="matching-progress" id="matching-progress" aria-live="polite">0 de ${pairs.length} parejas</p>
  `;
}

function bindMatchingHandlers(lesson) {
  const grid = document.querySelector('.matching-grid');
  const progress = document.getElementById('matching-progress');
  if (!grid) return;

  const total = (lesson.pairs || []).length;
  let selected = null;   // { side, pair, btn }
  let matched = 0;
  let errors = 0;

  const updateProgress = () => {
    if (progress) progress.textContent = `${matched} de ${total} parejas`;
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.matching-item');
    if (!btn || btn.disabled) return;
    const side = btn.dataset.side;
    const pair = parseInt(btn.dataset.pair, 10);

    // Tocar el mismo botón → deseleccionar.
    if (selected && selected.btn === btn) {
      btn.classList.remove('selected');
      selected = null;
      return;
    }
    // Mismo lado → reemplazar selección.
    if (!selected || selected.side === side) {
      if (selected) selected.btn.classList.remove('selected');
      btn.classList.add('selected');
      selected = { side, pair, btn };
      return;
    }
    // Lado distinto → comprobar match.
    const pairsMatch = selected.pair === pair;
    if (pairsMatch) {
      btn.classList.add('matched');
      selected.btn.classList.add('matched');
      btn.classList.remove('selected');
      selected.btn.classList.remove('selected');
      btn.disabled = true;
      selected.btn.disabled = true;
      selected = null;
      matched += 1;
      updateProgress();
      if (matched === total) {
        // Toda la lección emparejada — dispara isCorrect = (errores === 0).
        handleAnswer(errors === 0);
      }
    } else {
      errors += 1;
      btn.classList.add('shake', 'incorrect-flash');
      selected.btn.classList.add('shake', 'incorrect-flash');
      const cleanup = (el) => {
        el.classList.remove('shake', 'incorrect-flash', 'selected');
      };
      const a = btn, b = selected.btn;
      setTimeout(() => { cleanup(a); cleanup(b); }, 450);
      selected = null;
    }
  });

  setLessonKeyboard(null);
}

function applyWordOrderFeedback(lesson, userOrder, isCorrect) {
  const answer = document.getElementById('word-answer');
  const checkBtn = document.getElementById('btn-check-word');
  if (checkBtn) checkBtn.disabled = true;
  if (!answer) return;
  const tiles = Array.from(answer.querySelectorAll('.word-tile'));
  tiles.forEach((tile, i) => {
    tile.disabled = true;
    if (isCorrect) {
      tile.classList.add('correct');
    } else {
      const expected = lesson.tokens[i];
      if (tile.textContent === expected) tile.classList.add('correct');
      else tile.classList.add('incorrect');
    }
  });
  if (!isCorrect) {
    answer.classList.add('shake');
    answer.addEventListener('animationend', () => answer.classList.remove('shake'), { once: true });
    // Mostrar la oración correcta debajo.
    const expectedSentence = (lesson.tokens || []).join(' ');
    const tag = document.createElement('p');
    tag.className = 'word-expected';
    tag.textContent = `→ ${expectedSentence}`;
    answer.insertAdjacentElement('afterend', tag);
  }
}

async function renderLesson(params) {
  // _continuation === true marca el avance al siguiente ejercicio dentro de
  // una sesión activa. Solo en una entrada "fresca" reseteamos sessionState.
  const isContinuation = !!(params && params._continuation);
  if (!isContinuation) {
    if (params && Object.prototype.hasOwnProperty.call(params, 'topicId')) {
      currentLessonTopicId = params.topicId || null;
    } else if (params === undefined) {
      // Llamado sin params → vino del nav inferior, limpiar filtro.
      currentLessonTopicId = null;
    }
    resetSessionState(currentLessonTopicId);
  }
  closeFeedbackPanel();

  const lesson = await Leitner.selectNextLesson(
    currentLessonTopicId ? { topicId: currentLessonTopicId } : undefined
  );

  let topicHeader = '';
  if (currentLessonTopicId) {
    const topic = await DB.getTopic(currentLessonTopicId);
    if (topic) {
      topicHeader = `<button class="topic-breadcrumb" id="btn-back-topic" type="button">← ${escapeHtml(topic.title)}</button>`;
    }
  }

  if (!lesson) {
    setLessonKeyboard(null);
    appMain().innerHTML = `
      ${topicHeader}
      <div class="empty-state">
        <span class="icon">🎉</span>
        <h2>${currentLessonTopicId ? '¡Tema al día!' : '¡Todo al día!'}</h2>
        <p>${currentLessonTopicId
          ? 'No hay ejercicios de este tema pendientes en este momento.'
          : 'No hay ejercicios pendientes para revisar en este momento. Vuelve más tarde para reforzar lo aprendido.'}</p>
        <button class="btn btn-secondary" id="btn-back" type="button">${currentLessonTopicId ? 'Volver al tema' : 'Volver al inicio'}</button>
      </div>
    `;
    el('btn-back').addEventListener('click', () => {
      if (currentLessonTopicId) navigate('topic', { topicId: currentLessonTopicId });
      else navigate('dashboard');
    });
    if (el('btn-back-topic')) {
      el('btn-back-topic').addEventListener('click', () => navigate('topic', { topicId: currentLessonTopicId }));
    }
    return;
  }

  currentLesson = lesson;
  const progress = await DB.getProgress(lesson.id);
  const box = progress.box || 1;

  // Header de sesión: contador + chip de racha + barra de progreso.
  const target = sessionState.target;
  const displayCount = Math.min(sessionState.count + 1, target);
  const pct = Math.min(Math.round((sessionState.count / target) * 100), 100);
  const streak = sessionState.correctStreak;
  const streakChip = streak > 0
    ? `<span class="lesson-streak-chip"><span aria-hidden="true">🔥</span>${streak} segui${streak === 1 ? 'do' : 'dos'}</span>`
    : '';

  // Badge de la caja Leitner del ejercicio actual (5 dots, los <= box llenos).
  const dots = [1, 2, 3, 4, 5]
    .map((n) => `<span class="lesson-box-dot${n <= box ? ' on' : ''}"></span>`)
    .join('');

  appMain().innerHTML = `
    ${topicHeader}
    <header class="lesson-session-header">
      <div class="lesson-session-meta">
        <span class="lesson-session-counter">Ejercicio <strong>${displayCount}</strong> de ${target}</span>
        ${streakChip}
      </div>
      <div class="lesson-session-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progreso de la sesión">
        <span style="width: ${pct}%"></span>
      </div>
    </header>

    <div class="card lesson-card lesson-card-${lessonFormat(lesson)}">
      <div class="lesson-card-head">
        <p class="lesson-prompt">${escapeHtml(lesson.prompt)}</p>
        <span class="lesson-box-badge" title="Caja Leitner: cuanto más alta, mejor dominas el ejercicio">
          <span class="lesson-box-label">Caja ${box}</span>
          <span class="lesson-box-dots" aria-hidden="true">${dots}</span>
        </span>
      </div>
      ${renderQuestion(lesson)}
    </div>
  `;

  if (el('btn-back-topic')) {
    el('btn-back-topic').addEventListener('click', () => navigate('topic', { topicId: currentLessonTopicId }));
  }

  bindAnswerHandlers(lesson);
}

async function handleAnswer(userInput) {
  if (!currentLesson) return;
  const isCorrect = evaluateAnswer(currentLesson, userInput);
  applyAnswerFeedback(currentLesson, userInput, isCorrect);

  const updated = await Leitner.processAnswer(currentLesson.id, isCorrect);
  const { pointsEarned, newlyUnlocked } = await Gamification.registerAnswer(isCorrect, updated.box);

  sessionState.count += 1;
  sessionState.correctStreak = isCorrect ? sessionState.correctStreak + 1 : 0;

  const achievementsHtml = newlyUnlocked.map((a) => `
    <p class="feedback-achievement">🎖️ <strong>Logro desbloqueado:</strong> ${escapeHtml(a.icon)} ${escapeHtml(a.title)}</p>
  `).join('');

  const panel = document.createElement('aside');
  panel.className = `lesson-feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`;
  panel.id = 'feedback-panel';
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div class="lesson-feedback-panel-inner">
      <div class="feedback-content">
        <p class="feedback-status">
          <span class="feedback-icon" aria-hidden="true">${isCorrect ? '✓' : '✕'}</span>
          <span>${isCorrect ? '¡Correcto!' : 'Incorrecto.'}</span>
          ${isCorrect && pointsEarned > 0 ? `<span class="feedback-points">+${pointsEarned} pts</span>` : ''}
        </p>
        <p class="feedback-explanation">${escapeHtml(currentLesson.explanation)}</p>
        <p class="feedback-meta">
          ${isCorrect ? `Avanzaste a la caja ${updated.box}.` : 'Volviste a la caja 1 para reforzar.'}
        </p>
        ${achievementsHtml}
      </div>
      <button class="btn feedback-cta" id="btn-continue" type="button">Continuar</button>
    </div>
  `;
  document.body.appendChild(panel);
  document.body.classList.add('feedback-open');

  const continueBtn = el('btn-continue');
  continueBtn.focus();

  const advance = () => {
    closeFeedbackPanel();
    renderLesson({ topicId: currentLessonTopicId, _continuation: true });
  };
  continueBtn.addEventListener('click', advance);

  // Mientras el panel esté abierto, Enter/Espacio avanzan al siguiente ejercicio.
  setLessonKeyboard((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      advance();
    }
  });

  await renderStats();
}

/* Learn (índice de topics) ----------------------------------------------- */
const TOPIC_ICONS = {
  'verb-to-be': '🪞',
  'there-is-are': '🏘️',
  'present-simple-negative': '🚫',
  'articles-a-an': '🔤',
  'plurals': '➕',
  'possessive-adjectives': '🤝',
  'can-cant': '💪',
  'prepositions-of-place': '📍',
  'vocabulary-farm-animals': '🐄',
  'vocabulary-people-jobs': '👩‍🌾',
  'vocabulary-food-crops': '🌽',
  'vocabulary-nature': '🌳',
  'vocabulary-community': '🏡'
};

async function renderLearn() {
  currentTopicId = null;
  const [topics, lessons, allProgress] = await Promise.all([
    DB.getAllTopics(),
    DB.getAllLessons(),
    DB.getAllProgress()
  ]);

  if (!topics || topics.length === 0) {
    appMain().innerHTML = `
      <div class="empty-state">
        <span class="icon">📚</span>
        <h2>Sin temas todavía</h2>
        <p>El contenido de aprendizaje aún no se ha sembrado.</p>
      </div>
    `;
    return;
  }

  const lessonsById = new Map(lessons.map((l) => [l.id, l]));
  const progressById = new Map(allProgress.map((p) => [p.lessonId, p]));
  const now = Date.now();

  topics.sort((a, b) => {
    if (a.level !== b.level) return String(a.level).localeCompare(String(b.level));
    return (a.order || 0) - (b.order || 0);
  });

  const byLevel = new Map();
  for (const topic of topics) {
    if (!byLevel.has(topic.level)) byLevel.set(topic.level, []);
    byLevel.get(topic.level).push(topic);
  }

  const totalDue = allProgress.filter((p) => (p.nextReview || 0) <= now).length;
  const heroHtml = totalDue > 0
    ? `
      <header class="learn-hero learn-hero--due">
        <div class="learn-hero-body">
          <span class="learn-hero-eyebrow">Tu próxima sesión</span>
          <h1 class="learn-hero-title">${totalDue} ejercicio${totalDue === 1 ? '' : 's'} pendiente${totalDue === 1 ? '' : 's'}</h1>
          <p class="learn-hero-sub">El sistema Leitner recomienda repasarlos hoy para fijar lo aprendido.</p>
        </div>
        <button class="btn learn-hero-cta" id="btn-hero-practice" type="button">Practicar ahora →</button>
      </header>
    `
    : `
      <header class="learn-hero learn-hero--done">
        <div class="learn-hero-body">
          <span class="learn-hero-eyebrow">¡Bien hecho!</span>
          <h1 class="learn-hero-title">Estás al día 🎉</h1>
          <p class="learn-hero-sub">Explora un nuevo tema o vuelve más tarde para reforzar lo aprendido.</p>
        </div>
      </header>
    `;

  const levelSections = Array.from(byLevel.entries()).map(([level, levelTopics]) => {
    const cards = levelTopics.map((topic) => {
      const lessonIds = (topic.lessonIds || []).filter((id) => lessonsById.has(id));
      const total = lessonIds.length;
      const mastered = lessonIds.filter((id) => {
        const p = progressById.get(id);
        return p && (p.box || 1) >= 4;
      }).length;
      const due = lessonIds.filter((id) => {
        const p = progressById.get(id);
        return p && (p.nextReview || 0) <= now;
      }).length;
      const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
      const icon = TOPIC_ICONS[topic.id] || '📘';
      const dueBadge = due > 0
        ? `<span class="topic-card-due" title="Ejercicios pendientes para hoy">${due} hoy</span>`
        : '';
      const stateClass = total > 0 && mastered === total
        ? 'topic-card--mastered'
        : (due > 0 ? 'topic-card--due' : '');

      return `
        <article class="topic-card ${stateClass}" data-topic-id="${escapeHtml(topic.id)}">
          <div class="topic-card-icon" aria-hidden="true">${icon}</div>
          <div class="topic-card-body">
            <div class="topic-card-head">
              <h3 class="topic-card-title">${escapeHtml(topic.title)}</h3>
              ${dueBadge}
            </div>
            <p class="topic-card-summary">${escapeHtml(topic.summary || '')}</p>
            <div class="topic-card-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Dominio del tema">
              <span style="width: ${pct}%"></span>
            </div>
            <p class="topic-card-meta">
              <span>${mastered}/${total} dominado${total === 1 ? '' : 's'}</span>
              <span class="topic-card-meta-pct">${pct}%</span>
            </p>
            <div class="topic-card-actions">
              <button class="btn btn-secondary btn-small" data-action="theory" data-topic-id="${escapeHtml(topic.id)}" type="button">📖 Teoría</button>
              <button class="btn btn-small" data-action="practice" data-topic-id="${escapeHtml(topic.id)}" type="button" ${total === 0 ? 'disabled' : ''}>▶ Practicar</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
    return `
      <section class="learn-level">
        <div class="learn-level-head">
          <h2 class="learn-level-title">Nivel ${escapeHtml(level)}</h2>
          <span class="learn-level-count">${levelTopics.length} tema${levelTopics.length === 1 ? '' : 's'}</span>
        </div>
        <div class="topic-list">${cards}</div>
      </section>
    `;
  }).join('');

  appMain().innerHTML = `
    ${heroHtml}
    ${levelSections}
  `;

  if (totalDue > 0) {
    el('btn-hero-practice').addEventListener('click', () => navigate('lesson', { topicId: null }));
  }

  document.querySelectorAll('.topic-card').forEach((card) => {
    const topicId = card.dataset.topicId;
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      navigate('topic', { topicId });
    });
  });
  document.querySelectorAll('.topic-card [data-action="theory"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('topic', { topicId: btn.dataset.topicId });
    });
  });
  document.querySelectorAll('.topic-card [data-action="practice"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('lesson', { topicId: btn.dataset.topicId });
    });
  });
}

/* Topic detail ----------------------------------------------------------- */
function renderSection(section) {
  const title = escapeHtml(section.title || '');
  switch (section.kind) {
    case 'forms': {
      const cards = (section.rows || []).map((row) => `
        <div class="subject-card">
          <h4 class="subject-card-subject">${escapeHtml(row.subject)}</h4>
          ${row.affirmative ? `<p class="subject-line"><span class="subject-line-icon" aria-hidden="true">✅</span><span>${escapeHtml(row.affirmative)}</span></p>` : ''}
          ${row.negative ? `<p class="subject-line"><span class="subject-line-icon" aria-hidden="true">❌</span><span>${escapeHtml(row.negative)}</span></p>` : ''}
          ${row.question ? `<p class="subject-line"><span class="subject-line-icon" aria-hidden="true">❓</span><span>${escapeHtml(row.question)}</span></p>` : ''}
        </div>
      `).join('');
      return `
        <section class="topic-section">
          <h3 class="topic-section-title">${title}</h3>
          <div class="subject-grid">${cards}</div>
        </section>
      `;
    }
    case 'use':
    case 'note': {
      const className = section.kind === 'note' ? 'topic-note' : 'use-prose';
      return `
        <section class="topic-section">
          <h3 class="topic-section-title">${title}</h3>
          <p class="${className}">${escapeHtml(section.body || '')}</p>
        </section>
      `;
    }
    case 'examples': {
      const items = (section.items || []).map((item) => `<li><code>${escapeHtml(item)}</code></li>`).join('');
      return `
        <section class="topic-section">
          <h3 class="topic-section-title">${title}</h3>
          <ul class="examples-list">${items}</ul>
        </section>
      `;
    }
    default:
      return '';
  }
}

async function renderTopic(topicId) {
  if (!topicId) return navigate('learn');
  const topic = await DB.getTopic(topicId);
  if (!topic) {
    appMain().innerHTML = `
      <div class="empty-state">
        <span class="icon">⚠️</span>
        <h2>Tema no encontrado</h2>
        <button class="btn btn-secondary" id="btn-back-learn" type="button">Volver al índice</button>
      </div>
    `;
    el('btn-back-learn').addEventListener('click', () => navigate('learn'));
    return;
  }

  currentTopicId = topicId;
  const lessonCount = (topic.lessonIds || []).length;
  const sectionsHtml = (topic.sections || []).map(renderSection).join('');

  // Marcar el tab Aprender como activo (el detalle es sub-vista de Aprender).
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === 'learn');
  });

  appMain().innerHTML = `
    <button class="topic-breadcrumb" id="btn-back-learn" type="button">← Aprender</button>
    <h1 class="topic-title">${escapeHtml(topic.title)}</h1>
    <p class="topic-summary">${escapeHtml(topic.summary || '')}</p>
    <div class="topic-detail">
      ${sectionsHtml}
    </div>
    <button class="btn topic-cta" id="btn-practice" type="button" ${lessonCount === 0 ? 'disabled' : ''}>
      ${lessonCount > 0 ? `Practicar este tema (${lessonCount} ejercicio${lessonCount === 1 ? '' : 's'}) →` : 'Sin ejercicios disponibles'}
    </button>
  `;

  el('btn-back-learn').addEventListener('click', () => navigate('learn'));
  if (lessonCount > 0) {
    el('btn-practice').addEventListener('click', () => navigate('lesson', { topicId }));
  }
}

/* Profile ---------------------------------------------------------------- */
const AVATAR_OPTIONS = ['🧑‍🎓', '👩‍🎓', '👨‍🎓', '🦊', '🐯', '🐱', '🐶', '🦁', '🐼', '🦉', '🚀', '🌟'];
const DEFAULT_AVATAR = '🧑‍🎓';

async function renderProfile() {
  const [profile, unlocked, boxDist] = await Promise.all([
    DB.getProfile(),
    DB.getAllAchievements(),
    DB.getBoxDistribution()
  ]);
  const unlockedIds = new Set(unlocked.map((a) => a.id));
  const accuracy = profile.totalAnswered
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
    : 0;
  const totalDefs = Gamification.achievementDefs.length;
  const avatar = profile.avatar || DEFAULT_AVATAR;
  const level = profile.level || 1;
  const points = profile.points || 0;
  const intoLevel = points % Gamification.pointsPerLevel;
  const levelPct = Math.round((intoLevel / Gamification.pointsPerLevel) * 100);

  const boxes = boxDist.boxes || [0, 0, 0, 0, 0];
  const boxTotal = boxDist.total || 0;
  const maxBox = Math.max(1, ...boxes);
  const masteredCount = boxes[4];
  const learningCount = boxes[1] + boxes[2] + boxes[3];
  const newCount = boxes[0];

  appMain().innerHTML = `
    <h1>Tu perfil</h1>

    <header class="profile-header card" id="card-personal">
      <button class="profile-avatar" id="btn-edit-profile" type="button" aria-label="Editar perfil">
        <span class="profile-avatar-emoji" aria-hidden="true">${avatar}</span>
        <span class="profile-avatar-edit" aria-hidden="true">✎</span>
      </button>
      <div class="profile-identity">
        <div class="profile-name">${profile.name ? escapeHtml(profile.name) : '<span class="muted">Sin nombre</span>'}</div>
        <div class="profile-level-pill">Nivel ${level}</div>
      </div>
    </header>

    <div class="card">
      <h2>Tu progreso</h2>
      <div class="profile-stats-grid">
        <div class="stat-tile stat-tile--points">
          <div class="stat-tile-icon" aria-hidden="true">⭐</div>
          <div class="stat-tile-value">${points}</div>
          <div class="stat-tile-label">Puntos</div>
        </div>
        <div class="stat-tile stat-tile--accuracy">
          <div class="stat-tile-icon" aria-hidden="true">🎯</div>
          <div class="stat-tile-value">${profile.totalAnswered ? `${accuracy}%` : '—'}</div>
          <div class="stat-tile-label">Precisión</div>
        </div>
        <div class="stat-tile stat-tile--streak">
          <div class="stat-tile-icon" aria-hidden="true">🔥</div>
          <div class="stat-tile-value">${profile.streak || 0}</div>
          <div class="stat-tile-label">Días seguidos</div>
        </div>
        <div class="stat-tile stat-tile--answered">
          <div class="stat-tile-icon" aria-hidden="true">📝</div>
          <div class="stat-tile-value">${profile.totalAnswered || 0}</div>
          <div class="stat-tile-label">Respondidas</div>
        </div>
      </div>

      <div class="next-level">
        <div class="next-level-head">
          <span>Próximo nivel: <strong>${level + 1}</strong></span>
          <span class="next-level-pts">${intoLevel}/${Gamification.pointsPerLevel} pts</span>
        </div>
        <div class="next-level-bar"><span style="width:${levelPct}%"></span></div>
      </div>
    </div>

    <div class="card">
      <h2>Sistema Leitner</h2>
      <p class="muted">Cómo se distribuyen tus ${boxTotal} ejercicio${boxTotal === 1 ? '' : 's'} en las 5 cajas de repaso.</p>
      <div class="leitner-chart" role="list">
        ${boxes.map((count, idx) => {
          const heightPct = Math.round((count / maxBox) * 100);
          const boxNum = idx + 1;
          return `
            <div class="leitner-col" role="listitem">
              <div class="leitner-col-track" title="${count} en caja ${boxNum}">
                <div class="leitner-col-fill leitner-col-fill--box${boxNum}" style="height:${heightPct}%"></div>
                <span class="leitner-col-count">${count}</span>
              </div>
              <div class="leitner-col-label">Caja ${boxNum}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="leitner-summary">
        <div class="leitner-pill leitner-pill--mastered">
          <span class="leitner-pill-icon" aria-hidden="true">🏆</span>
          <strong>${masteredCount}</strong> dominados
        </div>
        <div class="leitner-pill leitner-pill--learning">
          <span class="leitner-pill-icon" aria-hidden="true">📚</span>
          <strong>${learningCount}</strong> aprendiendo
        </div>
        <div class="leitner-pill leitner-pill--new">
          <span class="leitner-pill-icon" aria-hidden="true">🌱</span>
          <strong>${newCount}</strong> por aprender
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Logros <span class="muted">(${unlocked.length}/${totalDefs})</span></h2>
      <div class="achievements-grid">
        ${Gamification.achievementDefs.map((a) => {
          const isUnlocked = unlockedIds.has(a.id);
          return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="achievement-card-icon" aria-hidden="true">${isUnlocked ? a.icon : '🔒'}</div>
              <div class="achievement-card-title">${a.title}</div>
              <div class="achievement-card-desc">${a.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const editBtn = el('btn-edit-profile');
  if (editBtn) editBtn.addEventListener('click', () => startEditPersonal(profile));
}

function startEditPersonal(profile) {
  const card = el('card-personal');
  if (!card) return;
  const currentName = profile.name || '';
  const currentAvatar = profile.avatar || DEFAULT_AVATAR;

  card.classList.remove('profile-header');
  card.innerHTML = `
    <h2>Editar perfil</h2>

    <fieldset class="avatar-picker">
      <legend class="onboarding-label">Avatar</legend>
      <div class="avatar-grid" role="radiogroup" aria-label="Elige un avatar">
        ${AVATAR_OPTIONS.map((emoji) => `
          <button
            type="button"
            class="avatar-option ${emoji === currentAvatar ? 'selected' : ''}"
            data-avatar="${emoji}"
            role="radio"
            aria-checked="${emoji === currentAvatar}"
          >${emoji}</button>
        `).join('')}
      </div>
    </fieldset>

    <label class="onboarding-label" for="edit-name-input">Tu nombre</label>
    <input
      id="edit-name-input"
      class="onboarding-input"
      type="text"
      maxlength="40"
      value="${escapeHtml(currentName)}"
    >
    <p id="edit-name-error" class="onboarding-error hidden">Por favor ingresa un nombre.</p>

    <div class="onboarding-actions">
      <button class="btn btn-secondary" id="btn-cancel-edit" type="button">Cancelar</button>
      <button class="btn" id="btn-save-edit" type="button">Guardar</button>
    </div>
  `;

  const input = el('edit-name-input');
  const errorEl = el('edit-name-error');
  let chosenAvatar = currentAvatar;

  setTimeout(() => { input.focus(); input.select(); }, 0);

  card.querySelectorAll('.avatar-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      chosenAvatar = btn.dataset.avatar;
      card.querySelectorAll('.avatar-option').forEach((b) => {
        const isSel = b === btn;
        b.classList.toggle('selected', isSel);
        b.setAttribute('aria-checked', String(isSel));
      });
    });
  });

  el('btn-cancel-edit').addEventListener('click', () => renderProfile());
  el('btn-save-edit').addEventListener('click', async () => {
    const name = (input.value || '').trim();
    if (!name) {
      errorEl.classList.remove('hidden');
      input.focus();
      return;
    }
    const fresh = await DB.getProfile();
    await DB.updateProfile({ ...fresh, name, avatar: chosenAvatar });
    await renderProfile();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); el('btn-save-edit').click(); }
    if (e.key === 'Escape') { e.preventDefault(); renderProfile(); }
  });
}

/* Init ------------------------------------------------------------------- */
async function init() {
  try {
    await DB.init();
  } catch (err) {
    console.error('[App] Error inicializando IndexedDB:', err);
    appMain().innerHTML = `
      <div class="empty-state">
        <span class="icon">⚠️</span>
        <h2>Error de almacenamiento</h2>
        <p>No fue posible inicializar el almacenamiento local. Verifica que tu navegador soporte IndexedDB.</p>
      </div>
    `;
    return;
  }

  window.addEventListener('online', flashOnline);
  window.addEventListener('offline', updateConnectionBanner);
  updateConnectionBanner();

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.view));
  });

  const profile = await DB.getProfile();
  if (typeof Onboarding !== 'undefined' && Onboarding.shouldShow(profile)) {
    await renderStats();
    Onboarding.render(() => { navigate('dashboard'); });
    return;
  }

  await navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
