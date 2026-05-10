/**
 * Bootstrap, router y vistas del prototipo.
 *
 * Orquesta los módulos DB, Leitner y Gamification para producir la
 * experiencia del estudiante. Implementa un router minimalista de 3 vistas
 * (Dashboard, Lección, Perfil) y reacciona a eventos de conectividad.
 */
let currentLesson = null;

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
async function navigate(view) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  await renderStats();
  if (view === 'lesson')  return renderLesson();
  if (view === 'profile') return renderProfile();
  return renderDashboard();
}

/* Dashboard -------------------------------------------------------------- */
async function renderDashboard() {
  const dueCount = await Leitner.dueCount();
  const { boxes, total } = await DB.getBoxDistribution();
  const profile = await DB.getProfile();
  const accuracy = profile.totalAnswered
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
    : 0;

  appMain().innerHTML = `
    <h1>Hola 👋</h1>
    <div class="card">
      <h2>Listo para hoy</h2>
      <p>Tienes <strong>${dueCount}</strong> de ${total} ejercicios listos para revisar.</p>
      <button class="btn" id="btn-start" ${dueCount === 0 ? 'disabled' : ''} type="button">
        ${dueCount > 0 ? 'Comenzar lección' : '¡Todo al día!'}
      </button>
    </div>
    <div class="card">
      <h2>Tu progreso (Sistema Leitner)</h2>
      <p class="muted">Cada ejercicio avanza de caja al responder bien. La caja 5 indica dominio.</p>
      <div class="boxes" role="list">
        ${boxes.map((c, i) => `
          <div class="box" role="listitem">
            <span class="box-num">Caja ${i + 1}</span>
            <span class="box-count">${c}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <h2>Tus números</h2>
      <p>Respondidas: <strong>${profile.totalAnswered || 0}</strong></p>
      <p>Aciertos: <strong>${profile.totalCorrect || 0}</strong>${profile.totalAnswered ? ` (${accuracy}%)` : ''}</p>
    </div>
  `;

  const btn = el('btn-start');
  if (btn && !btn.disabled) {
    btn.addEventListener('click', () => navigate('lesson'));
  }
}

/* Lesson ----------------------------------------------------------------- */
async function renderLesson() {
  const lesson = await Leitner.selectNextLesson();
  if (!lesson) {
    appMain().innerHTML = `
      <div class="empty-state">
        <span class="icon">🎉</span>
        <h2>¡Todo al día!</h2>
        <p>No hay ejercicios pendientes para revisar en este momento. Vuelve más tarde para reforzar lo aprendido.</p>
        <button class="btn btn-secondary" id="btn-back" type="button">Volver al inicio</button>
      </div>
    `;
    el('btn-back').addEventListener('click', () => navigate('dashboard'));
    return;
  }

  currentLesson = lesson;
  const progress = await DB.getProgress(lesson.id);

  appMain().innerHTML = `
    <div class="card">
      <p class="lesson-prompt">${lesson.prompt} · Caja ${progress.box}</p>
      <p class="lesson-question">${lesson.question}</p>
      <div id="options-container">
        ${lesson.options.map((opt, i) => `
          <button class="btn-option" data-index="${i}" type="button">${opt}</button>
        `).join('')}
      </div>
      <div id="feedback-container"></div>
    </div>
  `;

  document.querySelectorAll('.btn-option').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index, 10)));
  });
}

async function handleAnswer(selectedIndex) {
  if (!currentLesson) return;
  const isCorrect = selectedIndex === currentLesson.correctIndex;

  document.querySelectorAll('.btn-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === currentLesson.correctIndex) btn.classList.add('correct');
    else if (i === selectedIndex && !isCorrect) btn.classList.add('incorrect');
  });

  const updated = await Leitner.processAnswer(currentLesson.id, isCorrect);
  const { pointsEarned, newlyUnlocked } = await Gamification.registerAnswer(isCorrect, updated.box);

  const feedback = document.createElement('div');
  feedback.className = `lesson-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.innerHTML = `
    <strong>${isCorrect ? '¡Correcto!' : 'Incorrecto.'}</strong>
    ${isCorrect && pointsEarned > 0 ? ` +${pointsEarned} puntos.` : ''}
    <p style="margin: 8px 0 0; font-weight: normal;">${currentLesson.explanation}</p>
    <p class="muted" style="margin: 8px 0 0; font-size: 0.85rem;">
      ${isCorrect ? `Avanzaste a la caja ${updated.box}.` : 'Volviste a la caja 1 para reforzar.'}
    </p>
    ${newlyUnlocked.map((a) => `
      <p style="margin: 8px 0 0;">🎖️ <strong>Logro desbloqueado:</strong> ${a.icon} ${a.title}</p>
    `).join('')}
  `;
  el('feedback-container').appendChild(feedback);

  const next = document.createElement('button');
  next.className = 'btn';
  next.style.marginTop = '16px';
  next.type = 'button';
  next.textContent = 'Siguiente ejercicio';
  next.addEventListener('click', () => renderLesson());
  el('feedback-container').appendChild(next);

  await renderStats();
}

/* Profile ---------------------------------------------------------------- */
async function renderProfile() {
  const profile = await DB.getProfile();
  const unlocked = await DB.getAllAchievements();
  const unlockedIds = new Set(unlocked.map((a) => a.id));
  const accuracy = profile.totalAnswered
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
    : 0;
  const totalDefs = Gamification.achievementDefs.length;

  appMain().innerHTML = `
    <h1>Tu perfil</h1>
    <div class="card">
      <h2>Estadísticas</h2>
      <p>Puntos totales: <strong>${profile.points || 0}</strong></p>
      <p>Nivel: <strong>${profile.level || 1}</strong></p>
      <p>Racha actual: <strong>${profile.streak || 0}</strong> día(s)</p>
      <p>Respondidas: <strong>${profile.totalAnswered || 0}</strong></p>
      <p>Aciertos: <strong>${profile.totalCorrect || 0}</strong>${profile.totalAnswered ? ` (${accuracy}%)` : ''}</p>
    </div>
    <div class="card">
      <h2>Logros (${unlocked.length}/${totalDefs})</h2>
      ${Gamification.achievementDefs.map((a) => `
        <div class="achievement ${unlockedIds.has(a.id) ? '' : 'locked'}">
          <span class="achievement-icon" aria-hidden="true">${a.icon}</span>
          <div class="achievement-body">
            <div class="achievement-title">${a.title}</div>
            <div class="achievement-desc">${a.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
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

  await navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
