/**
 * Capa de datos del prototipo — IndexedDB vanilla con wrapper async/await.
 *
 * Decisión de diseño documentada en docs/decisiones-de-diseño.md:
 * El diseño grupal de la Etapa 3 menciona Dexie.js como wrapper, pero para este
 * prototipo de bajo nivel se optó por implementar IndexedDB sin librería externa
 * para reducir el bundle, eliminar dependencias de red en la primera carga, y
 * demostrar dominio técnico de la API nativa. La superficie pública del wrapper
 * (`DB.getLesson`, `DB.updateProgress`, etc.) es equivalente a la que ofrecería
 * Dexie, así que el resto del prototipo no se ve afectado.
 *
 * Stores definidos:
 *   - lessons:       contenido educativo (sembrado al primer arranque)
 *   - progress:      estado Leitner por ejercicio (caja, próximo review, etc.)
 *   - settings:      perfil del estudiante (puntos, racha, nivel)
 *   - achievements:  logros desbloqueados
 */
const DB_NAME = 'AprendeIngles';
const DB_VERSION = 1;

const STORES = {
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  SETTINGS: 'settings',
  ACHIEVEMENTS: 'achievements'
};

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.LESSONS)) {
        const lessons = db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
        lessons.createIndex('category', 'category', { unique: false });
        lessons.createIndex('type', 'type', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        const progress = db.createObjectStore(STORES.PROGRESS, { keyPath: 'lessonId' });
        progress.createIndex('box', 'box', { unique: false });
        progress.createIndex('nextReview', 'nextReview', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
      }
    };
  });
}

function reqToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    let result;
    Promise.resolve(fn(store))
      .then((value) => { result = value; })
      .catch(reject);
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function put(storeName, value) {
  return withStore(storeName, 'readwrite', (store) => reqToPromise(store.put(value)));
}
async function get(storeName, key) {
  return withStore(storeName, 'readonly', (store) => reqToPromise(store.get(key)));
}
async function getAll(storeName) {
  return withStore(storeName, 'readonly', (store) => reqToPromise(store.getAll()));
}
async function count(storeName) {
  return withStore(storeName, 'readonly', (store) => reqToPromise(store.count()));
}

const DEFAULT_PROFILE = {
  id: 'profile',
  points: 0,
  streak: 0,
  level: 1,
  lastActiveDay: null,
  consecutiveCorrect: 0,
  totalAnswered: 0,
  totalCorrect: 0
};

const DB = {
  async init() {
    await openDB();

    // Sembrar lecciones la primera vez
    const lessonCount = await count(STORES.LESSONS);
    if (lessonCount === 0 && typeof SEED_LESSONS !== 'undefined') {
      console.log('[DB] Sembrando ejercicios iniciales…');
      const now = Date.now();
      for (const lesson of SEED_LESSONS) {
        await put(STORES.LESSONS, lesson);
        await put(STORES.PROGRESS, {
          lessonId: lesson.id,
          box: 1,
          lastSeen: null,
          nextReview: now,
          attempts: 0,
          correct: 0
        });
      }
    }

    // Crear perfil si no existe
    const profile = await get(STORES.SETTINGS, 'profile');
    if (!profile) {
      await put(STORES.SETTINGS, { ...DEFAULT_PROFILE });
    }
  },

  // Lecciones ----------------------------------------------------
  async getLesson(id) { return get(STORES.LESSONS, id); },
  async getAllLessons() { return getAll(STORES.LESSONS); },

  // Progreso -----------------------------------------------------
  async getProgress(lessonId) { return get(STORES.PROGRESS, lessonId); },
  async getAllProgress() { return getAll(STORES.PROGRESS); },
  async updateProgress(progress) { return put(STORES.PROGRESS, progress); },

  // Perfil -------------------------------------------------------
  async getProfile() {
    const profile = await get(STORES.SETTINGS, 'profile');
    return profile || { ...DEFAULT_PROFILE };
  },
  async updateProfile(profile) {
    return put(STORES.SETTINGS, { ...profile, id: 'profile' });
  },

  // Logros -------------------------------------------------------
  async getAllAchievements() { return getAll(STORES.ACHIEVEMENTS); },
  async unlockAchievement(achievement) {
    return put(STORES.ACHIEVEMENTS, { ...achievement, unlockedAt: Date.now() });
  },
  async hasAchievement(id) {
    const found = await get(STORES.ACHIEVEMENTS, id);
    return Boolean(found);
  },

  // Estadísticas agregadas ---------------------------------------
  async getBoxDistribution() {
    const all = await getAll(STORES.PROGRESS);
    const boxes = [0, 0, 0, 0, 0];
    for (const p of all) {
      const idx = Math.min(Math.max((p.box || 1) - 1, 0), 4);
      boxes[idx] += 1;
    }
    return { boxes, total: all.length };
  }
};
