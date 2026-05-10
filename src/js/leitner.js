/**
 * Motor de Aprendizaje Adaptativo basado en el Sistema Leitner.
 *
 * Componente innovador del diseño consolidado en la Etapa 3. Implementa el
 * algoritmo de repetición espaciada de Sebastian Leitner (1972) usando 5 cajas
 * de dificultad. Toda la lógica se ejecuta 100 % en el cliente, sin necesidad
 * de servidor remoto, alineado con el principio offline-first del proyecto.
 *
 * Funcionamiento:
 *   1. Cada ejercicio inicia en la caja 1.
 *   2. Si el estudiante responde correctamente, el ejercicio avanza una caja
 *      (hasta un máximo de 5).
 *   3. Si responde incorrectamente, el ejercicio regresa a la caja 1.
 *   4. El intervalo de revisión depende de la caja: caja 1 = inmediato,
 *      caja 5 = 14 días. Esto implementa la "repetición espaciada".
 *   5. La selección del próximo ejercicio prioriza los vencidos en cajas
 *      bajas, garantizando que se refuercen los contenidos más débiles.
 */
const LEITNER_INTERVALS_DAYS = [0, 2, 4, 7, 14];
const LEITNER_NUM_BOXES = 5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const Leitner = {
  intervalsDays: LEITNER_INTERVALS_DAYS,
  numBoxes: LEITNER_NUM_BOXES,

  /**
   * Selecciona el próximo ejercicio a presentar al estudiante.
   * Prioriza ejercicios vencidos en cajas más bajas (más necesitados de refuerzo).
   *
   * Si se pasa { topicId }, restringe la selección a los ejercicios de ese topic.
   * Cuando todos los ejercicios del topic están al día (no due), relaja el filtro
   * de "vencido" y devuelve el ejercicio en la caja más baja del topic, para que
   * el estudiante pueda seguir practicando bajo demanda. Sin filtro de topic, el
   * comportamiento original se preserva (devuelve null si no hay nada vencido).
   *
   * @param {Object} [opts]
   * @param {string} [opts.topicId] — restringir a un topic específico
   * @returns {Promise<Object|null>}
   */
  async selectNextLesson(opts) {
    const topicId = opts && opts.topicId ? opts.topicId : null;
    const allProgress = await DB.getAllProgress();
    const now = Date.now();

    let candidates = allProgress;

    if (topicId) {
      const allLessons = await DB.getAllLessons();
      const topicLessonIds = new Set(
        allLessons.filter((l) => l.topicId === topicId).map((l) => l.id)
      );
      if (topicLessonIds.size === 0) return null;
      candidates = allProgress.filter((p) => topicLessonIds.has(p.lessonId));
    }

    let due = candidates.filter((p) => (p.nextReview || 0) <= now);

    // Sesión por topic: si nada está vencido, practicar igual con el de caja más baja.
    if (due.length === 0 && topicId) {
      due = candidates.slice();
    }

    if (due.length === 0) return null;

    due.sort((a, b) => {
      if (a.box !== b.box) return a.box - b.box;
      return (a.nextReview || 0) - (b.nextReview || 0);
    });

    return DB.getLesson(due[0].lessonId);
  },

  /**
   * Procesa la respuesta del estudiante y actualiza la posición del ejercicio
   * en el sistema Leitner.
   * @param {string} lessonId
   * @param {boolean} isCorrect
   * @returns {Promise<Object>} el progreso actualizado
   */
  async processAnswer(lessonId, isCorrect) {
    const progress = await DB.getProgress(lessonId);
    if (!progress) {
      throw new Error(`Leitner: progreso no encontrado para ${lessonId}`);
    }

    const newBox = isCorrect
      ? Math.min((progress.box || 1) + 1, this.numBoxes)
      : 1;

    const intervalDays = this.intervalsDays[newBox - 1];
    const now = Date.now();

    const updated = {
      ...progress,
      box: newBox,
      lastSeen: now,
      nextReview: now + intervalDays * MS_PER_DAY,
      attempts: (progress.attempts || 0) + 1,
      correct: (progress.correct || 0) + (isCorrect ? 1 : 0)
    };

    await DB.updateProgress(updated);
    return updated;
  },

  /**
   * Cuenta cuántos ejercicios están listos para revisión en este momento.
   */
  async dueCount() {
    const all = await DB.getAllProgress();
    const now = Date.now();
    return all.filter((p) => (p.nextReview || 0) <= now).length;
  }
};
