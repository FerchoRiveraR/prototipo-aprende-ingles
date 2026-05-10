/**
 * Datos semilla para el prototipo.
 *
 * 10 ejercicios de inglés nivel A1 contextualizados al entorno rural colombiano,
 * siguiendo la recomendación de la lectura de Hoyos (2024) sobre vocabulario
 * relevante al usuario y la del Informe UNCTAD (2025) sobre IA inclusiva.
 *
 * Estructura de cada ejercicio:
 *   id            — identificador único (string)
 *   type          — 'vocabulary' | 'grammar'
 *   category      — agrupación temática
 *   prompt        — instrucción para el estudiante (en español)
 *   question      — la pregunta a resolver
 *   options       — arreglo de opciones (string[])
 *   correctIndex  — índice de la respuesta correcta en `options`
 *   explanation   — retroalimentación pedagógica tras responder
 */
const SEED_LESSONS = [
  {
    id: 'voc-001',
    type: 'vocabulary',
    category: 'animals',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "vaca" en inglés?',
    options: ['cow', 'horse', 'pig', 'sheep'],
    correctIndex: 0,
    explanation: '"Cow" significa vaca. Es un animal común en las fincas rurales colombianas.'
  },
  {
    id: 'voc-002',
    type: 'vocabulary',
    category: 'people',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "agricultor" en inglés?',
    options: ['farmer', 'teacher', 'doctor', 'driver'],
    correctIndex: 0,
    explanation: '"Farmer" es la palabra para agricultor. Viene de "farm" (granja).'
  },
  {
    id: 'voc-003',
    type: 'vocabulary',
    category: 'food',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "maíz" en inglés?',
    options: ['rice', 'wheat', 'corn', 'bean'],
    correctIndex: 2,
    explanation: '"Corn" significa maíz, uno de los principales cultivos en Colombia.'
  },
  {
    id: 'voc-004',
    type: 'vocabulary',
    category: 'nature',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "río" en inglés?',
    options: ['lake', 'river', 'sea', 'pond'],
    correctIndex: 1,
    explanation: '"River" significa río. Colombia tiene muchos ríos importantes.'
  },
  {
    id: 'voc-005',
    type: 'vocabulary',
    category: 'community',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "comunidad" en inglés?',
    options: ['family', 'city', 'community', 'school'],
    correctIndex: 2,
    explanation: '"Community" significa comunidad. Las comunidades rurales son muy unidas.'
  },
  {
    id: 'gra-001',
    type: 'grammar',
    category: 'verb-to-be',
    prompt: 'Completa la oración con la forma correcta del verbo',
    question: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 0,
    explanation: 'Con "I" siempre usamos "am". Ejemplo: I am a farmer (Yo soy un agricultor).'
  },
  {
    id: 'gra-002',
    type: 'grammar',
    category: 'verb-to-be',
    prompt: 'Completa la oración con la forma correcta del verbo',
    question: 'She ___ from Colombia.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
    explanation: 'Con "she", "he" o "it" usamos "is". She is from Colombia (Ella es de Colombia).'
  },
  {
    id: 'gra-003',
    type: 'grammar',
    category: 'verb-to-be',
    prompt: 'Completa la oración con la forma correcta del verbo',
    question: 'We ___ farmers.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 2,
    explanation: 'Con "we", "you" o "they" usamos "are". We are farmers (Nosotros somos agricultores).'
  },
  {
    id: 'gra-004',
    type: 'grammar',
    category: 'there-is-are',
    prompt: 'Completa la oración correctamente',
    question: 'There ___ many cows in the field.',
    options: ['is', 'are', 'be', 'have'],
    correctIndex: 1,
    explanation: 'Usamos "There are" con plural (many cows). Para singular sería "There is".'
  },
  {
    id: 'gra-005',
    type: 'grammar',
    category: 'present-simple-negative',
    prompt: 'Completa la oración con la forma correcta',
    question: 'He ___ work in the city.',
    options: ['do not', 'does not', 'is not', 'are not'],
    correctIndex: 1,
    explanation: 'Con "he", "she", "it" usamos "does not". He does not work in the city.'
  }
];
