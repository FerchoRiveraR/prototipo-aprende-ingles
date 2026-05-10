/**
 * Onboarding de primera ejecución.
 *
 * Carrusel de 3 pasos que se muestra cuando profile.onboarded es false:
 *   1. Bienvenida + captura del nombre (obligatorio).
 *   2. Qué ofrece la app (offline, Leitner, gamificación).
 *   3. Cómo usarla (las 4 pestañas + ritmo de práctica).
 *
 * Tras completarse persiste { name, onboarded: true } en el perfil y entrega
 * el control al router principal vía el callback onComplete().
 */
const Onboarding = (function () {
  let stepIndex = 0;
  let nameDraft = '';
  let onCompleteCb = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function appMain() { return document.getElementById('app'); }
  function appNav() { return document.querySelector('nav.app-nav'); }

  function progressDots(active) {
    return `
      <div class="onboarding-progress" aria-hidden="true">
        ${[0, 1, 2].map((i) => `<span class="dot${i === active ? ' active' : ''}"></span>`).join('')}
      </div>
    `;
  }

  function renderStep1() {
    const main = appMain();
    main.innerHTML = `
      <section class="onboarding-step" aria-labelledby="onboarding-title-1">
        <div class="card">
          <h1 id="onboarding-title-1">¡Bienvenido/a a Aprende Inglés!</h1>
          <p>Una app pensada para aprender inglés <strong>niveles A1 a B2</strong> desde cualquier lugar, incluso sin conexión a internet.</p>
          <p>Para personalizar tu experiencia, ¿cómo te llamas?</p>
          <label class="onboarding-label" for="onboarding-name">Tu nombre</label>
          <input
            id="onboarding-name"
            class="onboarding-input"
            type="text"
            inputmode="text"
            autocomplete="given-name"
            maxlength="40"
            placeholder="Ej. María"
            value="${escapeHtml(nameDraft)}"
          >
          <p id="onboarding-name-error" class="onboarding-error hidden">Por favor ingresa tu nombre para continuar.</p>
          <div class="onboarding-actions">
            <button id="onboarding-next-1" class="btn" type="button" disabled>Siguiente</button>
          </div>
        </div>
        ${progressDots(0)}
      </section>
    `;

    const input = document.getElementById('onboarding-name');
    const nextBtn = document.getElementById('onboarding-next-1');
    const errorEl = document.getElementById('onboarding-name-error');

    const sync = () => {
      nameDraft = input.value;
      const valid = nameDraft.trim().length > 0;
      nextBtn.disabled = !valid;
      if (valid) errorEl.classList.add('hidden');
    };
    input.addEventListener('input', sync);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !nextBtn.disabled) {
        e.preventDefault();
        nextBtn.click();
      }
    });
    sync();
    setTimeout(() => input.focus(), 0);

    nextBtn.addEventListener('click', () => {
      if (!nameDraft.trim()) {
        errorEl.classList.remove('hidden');
        input.focus();
        return;
      }
      stepIndex = 1;
      renderStep2();
    });
  }

  function renderStep2() {
    appMain().innerHTML = `
      <section class="onboarding-step" aria-labelledby="onboarding-title-2">
        <div class="card">
          <h1 id="onboarding-title-2">Qué te ofrece</h1>
          <ul class="onboarding-feature-list">
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">📡</span>
              <div>
                <strong>Funciona sin internet</strong>
                <p>Después de la primera carga, todo el contenido y tu progreso quedan en tu dispositivo.</p>
              </div>
            </li>
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">🧠</span>
              <div>
                <strong>Repetición espaciada</strong>
                <p>Sistema Leitner de 5 cajas: lo que dominas se revisa cada vez con menos frecuencia.</p>
              </div>
            </li>
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">🎮</span>
              <div>
                <strong>Aprendizaje gamificado</strong>
                <p>Suma puntos, sube de nivel, mantén tu racha diaria y desbloquea logros.</p>
              </div>
            </li>
          </ul>
          <div class="onboarding-actions">
            <button id="onboarding-back-2" class="btn btn-secondary" type="button">Atrás</button>
            <button id="onboarding-next-2" class="btn" type="button">Siguiente</button>
          </div>
        </div>
        ${progressDots(1)}
      </section>
    `;
    document.getElementById('onboarding-back-2').addEventListener('click', () => {
      stepIndex = 0;
      renderStep1();
    });
    document.getElementById('onboarding-next-2').addEventListener('click', () => {
      stepIndex = 2;
      renderStep3();
    });
  }

  function renderStep3() {
    appMain().innerHTML = `
      <section class="onboarding-step" aria-labelledby="onboarding-title-3">
        <div class="card">
          <h1 id="onboarding-title-3">Cómo usarla</h1>
          <p>Encontrarás cuatro pestañas en la barra inferior:</p>
          <ul class="onboarding-feature-list">
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">🏠</span>
              <div>
                <strong>Inicio</strong>
                <p>Resumen del día y atajo a tu siguiente práctica.</p>
              </div>
            </li>
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">📚</span>
              <div>
                <strong>Aprender</strong>
                <p>Temas de teoría organizados por categoría.</p>
              </div>
            </li>
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">✏️</span>
              <div>
                <strong>Lección</strong>
                <p>Ejercicios pendientes de revisión según tu progreso.</p>
              </div>
            </li>
            <li class="onboarding-feature">
              <span class="emoji" aria-hidden="true">👤</span>
              <div>
                <strong>Perfil</strong>
                <p>Tus estadísticas, logros y datos personales.</p>
              </div>
            </li>
          </ul>
          <p class="muted">Con <strong>5 minutos diarios</strong> mantienes tu racha y refuerzas lo aprendido.</p>
          <div class="onboarding-actions">
            <button id="onboarding-back-3" class="btn btn-secondary" type="button">Atrás</button>
            <button id="onboarding-finish" class="btn" type="button">Empezar</button>
          </div>
        </div>
        ${progressDots(2)}
      </section>
    `;
    document.getElementById('onboarding-back-3').addEventListener('click', () => {
      stepIndex = 1;
      renderStep2();
    });
    document.getElementById('onboarding-finish').addEventListener('click', finish);
  }

  async function finish(ev) {
    const btn = ev && ev.currentTarget;
    const name = nameDraft.trim();
    if (!name) {
      stepIndex = 0;
      renderStep1();
      return;
    }
    if (btn) btn.disabled = true;
    try {
      const profile = await DB.getProfile();
      await DB.updateProfile({ ...profile, name, onboarded: true });
    } catch (err) {
      console.error('[Onboarding] Error guardando perfil:', err);
      if (btn) btn.disabled = false;
      return;
    }
    const nav = appNav();
    if (nav) nav.classList.remove('hidden');
    if (typeof onCompleteCb === 'function') onCompleteCb();
  }

  return {
    shouldShow(profile) {
      return !profile || !profile.onboarded;
    },
    render(onComplete) {
      onCompleteCb = onComplete;
      stepIndex = 0;
      nameDraft = '';
      const nav = appNav();
      if (nav) nav.classList.add('hidden');
      renderStep1();
    }
  };
})();
