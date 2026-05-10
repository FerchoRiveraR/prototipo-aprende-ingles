/**
 * Motor de Gamificación.
 *
 * Implementa el sistema de motivación descrito en el diseño grupal de la Etapa 3:
 *   - Puntos por respuesta correcta (con bonus por correctas consecutivas).
 *   - Niveles globales que reflejan el avance del estudiante.
 *   - Racha diaria (días consecutivos de práctica) para incentivar el hábito.
 *   - Logros desbloqueables por hitos significativos.
 *
 * Toda la lógica corre en cliente y persiste en IndexedDB. Aborda directamente
 * la "baja motivación estudiantil" identificada como efecto en el árbol de
 * problemas de la Etapa 2.
 */
const POINTS_PER_CORRECT = 10;
const POINTS_BONUS_CONSECUTIVE = 5;
const POINTS_PER_LEVEL = 100;

const ACHIEVEMENT_DEFS = [
  { id: 'first-correct', icon: '✨', title: 'Primer paso',  desc: 'Respondiste correctamente tu primer ejercicio.' },
  { id: 'streak-7',      icon: '🔥', title: 'Constancia',   desc: 'Mantuviste una racha de 7 días seguidos.' },
  { id: 'box-5',         icon: '🏆', title: 'Maestría',     desc: 'Llevaste un ejercicio a la caja 5 del sistema Leitner.' },
  { id: 'level-2',       icon: '🎓', title: 'En camino',    desc: 'Alcanzaste el nivel 2.' },
  { id: 'level-5',       icon: '🌟', title: 'Avanzado',     desc: 'Alcanzaste el nivel 5.' }
];

function dayStamp(timestamp) {
  const d = new Date(timestamp);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

async function maybeUnlock(id, condition) {
  if (!condition) return null;
  const def = ACHIEVEMENT_DEFS.find((a) => a.id === id);
  if (!def) return null;
  if (await DB.hasAchievement(id)) return null;
  await DB.unlockAchievement(def);
  return def;
}

const Gamification = {
  achievementDefs: ACHIEVEMENT_DEFS,
  pointsPerCorrect: POINTS_PER_CORRECT,
  pointsBonusConsecutive: POINTS_BONUS_CONSECUTIVE,
  pointsPerLevel: POINTS_PER_LEVEL,

  /**
   * Registra el resultado de una respuesta y actualiza puntos, racha,
   * nivel y logros.
   * @param {boolean} isCorrect
   * @param {number} newBox  caja Leitner resultante (para detectar logros)
   * @returns {Promise<{profile: Object, pointsEarned: number, newlyUnlocked: Array}>}
   */
  async registerAnswer(isCorrect, newBox) {
    const profile = await DB.getProfile();
    const today = dayStamp(Date.now());
    let pointsEarned = 0;

    profile.totalAnswered = (profile.totalAnswered || 0) + 1;
    if (isCorrect) profile.totalCorrect = (profile.totalCorrect || 0) + 1;

    if (isCorrect) {
      profile.consecutiveCorrect = (profile.consecutiveCorrect || 0) + 1;
      pointsEarned = POINTS_PER_CORRECT;
      if (profile.consecutiveCorrect >= 2) {
        pointsEarned += POINTS_BONUS_CONSECUTIVE;
      }
      profile.points = (profile.points || 0) + pointsEarned;
    } else {
      profile.consecutiveCorrect = 0;
    }

    profile.level = Math.floor((profile.points || 0) / POINTS_PER_LEVEL) + 1;

    if (profile.lastActiveDay !== today) {
      const yesterday = dayStamp(Date.now() - MS_PER_DAY);
      if (profile.lastActiveDay === yesterday) {
        profile.streak = (profile.streak || 0) + 1;
      } else {
        profile.streak = 1;
      }
      profile.lastActiveDay = today;

      // Mantener historial de días activos (máx 14) para la racha visual del Dashboard.
      const days = Array.isArray(profile.activeDays) ? profile.activeDays.slice() : [];
      if (!days.includes(today)) days.push(today);
      const cutoff = dayStamp(Date.now() - 13 * MS_PER_DAY);
      profile.activeDays = days.filter((d) => d >= cutoff).sort();
    }

    await DB.updateProfile(profile);

    const checks = [
      ['first-correct', isCorrect && profile.totalCorrect === 1],
      ['streak-7',      (profile.streak || 0) >= 7],
      ['box-5',         newBox === LEITNER_NUM_BOXES],
      ['level-2',       (profile.level || 1) >= 2],
      ['level-5',       (profile.level || 1) >= 5]
    ];

    const newlyUnlocked = [];
    for (const [id, condition] of checks) {
      const unlocked = await maybeUnlock(id, condition);
      if (unlocked) newlyUnlocked.push(unlocked);
    }

    return { profile, pointsEarned, newlyUnlocked };
  },

  /**
   * Devuelve el progreso porcentual hacia el siguiente nivel (0..1).
   */
  progressToNextLevel(profile) {
    const points = profile.points || 0;
    const intoLevel = points % POINTS_PER_LEVEL;
    return intoLevel / POINTS_PER_LEVEL;
  }
};
