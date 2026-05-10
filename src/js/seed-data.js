/**
 * Datos semilla para el prototipo.
 *
 * Ejercicios de inglés nivel A1 contextualizados al entorno rural colombiano,
 * siguiendo la recomendación de la lectura de Hoyos (2024) sobre vocabulario
 * relevante al usuario y la del Informe UNCTAD (2025) sobre IA inclusiva.
 *
 * Cada ejercicio se asocia a un topic (ver seed-topics.js) que contiene la
 * teoría previa (Form / Use / Examples). El campo `topicId` enlaza ambos.
 *
 * Estructura de cada ejercicio:
 *   id            — identificador único (string)
 *   topicId       — slug del topic al que pertenece (debe existir en SEED_TOPICS)
 *   type          — 'vocabulary' | 'grammar'
 *   category      — agrupación temática (legacy, también disponible en topic.id)
 *   prompt        — instrucción para el estudiante (en español)
 *   format        — (opcional) tipo de interacción. Default: 'multiple-choice'.
 *                   ∈ { 'multiple-choice' | 'true-false' | 'fill-blank' |
 *                       'word-order' | 'matching' }
 *   explanation   — retroalimentación pedagógica tras responder
 *
 * Campos por formato:
 *   multiple-choice — question, options[], correctIndex
 *   true-false      — statement, correctAnswer (boolean)
 *   fill-blank      — question (con '___' marcando el hueco), acceptedAnswers[]
 *   word-order      — instruction, tokens[] (orden correcto)
 *   matching        — instruction, pairs[] ({en, es})
 */
const SEED_LESSONS = [
  /* Vocabulary — Farm animals ----------------------------------- */
  {
    id: 'voc-001',
    topicId: 'vocabulary-farm-animals',
    type: 'vocabulary',
    category: 'animals',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "vaca" en inglés?',
    options: ['cow', 'horse', 'pig', 'sheep'],
    correctIndex: 0,
    explanation: '"Cow" significa vaca. Es un animal común en las fincas rurales colombianas.'
  },
  {
    id: 'voc-006',
    topicId: 'vocabulary-farm-animals',
    type: 'vocabulary',
    category: 'animals',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "caballo" en inglés?',
    options: ['cow', 'horse', 'pig', 'goat'],
    correctIndex: 1,
    explanation: '"Horse" significa caballo. Importante en muchas fincas para trabajo y transporte.'
  },
  {
    id: 'voc-007',
    topicId: 'vocabulary-farm-animals',
    type: 'vocabulary',
    category: 'animals',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "gallina" en inglés?',
    options: ['sheep', 'pig', 'chicken', 'goat'],
    correctIndex: 2,
    explanation: '"Chicken" significa gallina (también se usa para el pollo como alimento).'
  },
  {
    id: 'voc-008',
    topicId: 'vocabulary-farm-animals',
    type: 'vocabulary',
    category: 'animals',
    prompt: 'Selecciona el plural correcto',
    question: 'Plural de "sheep":',
    options: ['sheeps', 'sheepes', 'sheep', 'sheepies'],
    correctIndex: 2,
    explanation: '"Sheep" es irregular: el plural es igual al singular. Decimos "one sheep" y "ten sheep".'
  },

  /* Vocabulary — People and jobs -------------------------------- */
  {
    id: 'voc-002',
    topicId: 'vocabulary-people-jobs',
    type: 'vocabulary',
    category: 'people',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "agricultor" en inglés?',
    options: ['farmer', 'teacher', 'doctor', 'driver'],
    correctIndex: 0,
    explanation: '"Farmer" es la palabra para agricultor. Viene de "farm" (granja).'
  },
  {
    id: 'voc-009',
    topicId: 'vocabulary-people-jobs',
    type: 'vocabulary',
    category: 'people',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "profesora" en inglés?',
    options: ['nurse', 'teacher', 'doctor', 'driver'],
    correctIndex: 1,
    explanation: '"Teacher" significa profesor o profesora. Es una palabra neutra (no cambia con el género).'
  },
  {
    id: 'voc-010',
    topicId: 'vocabulary-people-jobs',
    type: 'vocabulary',
    category: 'people',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "conductor" en inglés?',
    options: ['driver', 'farmer', 'student', 'doctor'],
    correctIndex: 0,
    explanation: '"Driver" significa conductor. Viene de "drive" (conducir).'
  },

  /* Vocabulary — Food and crops --------------------------------- */
  {
    id: 'voc-003',
    topicId: 'vocabulary-food-crops',
    type: 'vocabulary',
    category: 'food',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "maíz" en inglés?',
    options: ['rice', 'wheat', 'corn', 'bean'],
    correctIndex: 2,
    explanation: '"Corn" significa maíz, uno de los principales cultivos en Colombia.'
  },
  {
    id: 'voc-011',
    topicId: 'vocabulary-food-crops',
    type: 'vocabulary',
    category: 'food',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "frijoles" en inglés?',
    options: ['rice', 'beans', 'corn', 'potato'],
    correctIndex: 1,
    explanation: '"Beans" significa frijoles (siempre va en plural en este sentido).'
  },
  {
    id: 'voc-012',
    topicId: 'vocabulary-food-crops',
    type: 'vocabulary',
    category: 'food',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "café" (la bebida o el grano)?',
    options: ['tea', 'coffee', 'cocoa', 'milk'],
    correctIndex: 1,
    explanation: '"Coffee" significa café. Colombia es uno de los principales productores del mundo.'
  },

  /* Vocabulary — Nature ----------------------------------------- */
  {
    id: 'voc-004',
    topicId: 'vocabulary-nature',
    type: 'vocabulary',
    category: 'nature',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "río" en inglés?',
    options: ['lake', 'river', 'sea', 'pond'],
    correctIndex: 1,
    explanation: '"River" significa río. Colombia tiene muchos ríos importantes.'
  },
  {
    id: 'voc-013',
    topicId: 'vocabulary-nature',
    type: 'vocabulary',
    category: 'nature',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "montaña" en inglés?',
    options: ['valley', 'forest', 'mountain', 'hill'],
    correctIndex: 2,
    explanation: '"Mountain" significa montaña. Los Andes atraviesan Colombia de sur a norte.'
  },
  {
    id: 'voc-014',
    topicId: 'vocabulary-nature',
    type: 'vocabulary',
    category: 'nature',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "bosque" en inglés?',
    options: ['forest', 'desert', 'beach', 'field'],
    correctIndex: 0,
    explanation: '"Forest" significa bosque. Una palabra clave para describir entornos naturales.'
  },

  /* Vocabulary — Community and family --------------------------- */
  {
    id: 'voc-005',
    topicId: 'vocabulary-community',
    type: 'vocabulary',
    category: 'community',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "comunidad" en inglés?',
    options: ['family', 'city', 'community', 'school'],
    correctIndex: 2,
    explanation: '"Community" significa comunidad. Las comunidades rurales son muy unidas.'
  },
  {
    id: 'voc-015',
    topicId: 'vocabulary-community',
    type: 'vocabulary',
    category: 'community',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "vecino" en inglés?',
    options: ['friend', 'neighbor', 'family', 'cousin'],
    correctIndex: 1,
    explanation: '"Neighbor" significa vecino o vecina (sin distinción de género).'
  },
  {
    id: 'voc-016',
    topicId: 'vocabulary-community',
    type: 'vocabulary',
    category: 'community',
    prompt: 'Selecciona la traducción correcta',
    question: '¿Cómo se dice "amigo" en inglés?',
    options: ['friend', 'neighbor', 'parent', 'sibling'],
    correctIndex: 0,
    explanation: '"Friend" significa amigo o amiga. Una palabra esencial en cualquier conversación.'
  },

  /* Grammar — Verb to be ---------------------------------------- */
  {
    id: 'gra-001',
    topicId: 'verb-to-be',
    type: 'grammar',
    category: 'verb-to-be',
    format: 'fill-blank',
    prompt: 'Escribe la forma correcta del verbo "to be"',
    question: 'I ___ a student.',
    acceptedAnswers: ['am', "i'm", 'i am'],
    explanation: 'Con "I" siempre usamos "am". Ejemplo: I am a farmer (Yo soy un agricultor).'
  },
  {
    id: 'gra-002',
    topicId: 'verb-to-be',
    type: 'grammar',
    category: 'verb-to-be',
    format: 'fill-blank',
    prompt: 'Escribe la forma correcta del verbo "to be"',
    question: 'She ___ from Colombia.',
    acceptedAnswers: ['is', "she's", 'she is'],
    explanation: 'Con "she", "he" o "it" usamos "is". She is from Colombia (Ella es de Colombia).'
  },
  {
    id: 'gra-003',
    topicId: 'verb-to-be',
    type: 'grammar',
    category: 'verb-to-be',
    format: 'fill-blank',
    prompt: 'Escribe la forma correcta del verbo "to be"',
    question: 'We ___ farmers.',
    acceptedAnswers: ['are', "we're", 'we are'],
    explanation: 'Con "we", "you" o "they" usamos "are". We are farmers (Nosotros somos agricultores).'
  },

  /* Grammar — There is / There are ------------------------------ */
  {
    id: 'gra-004',
    topicId: 'there-is-are',
    type: 'grammar',
    category: 'there-is-are',
    format: 'fill-blank',
    prompt: 'Completa con "is" o "are"',
    question: 'There ___ many cows in the field.',
    acceptedAnswers: ['are'],
    explanation: 'Usamos "there are" con plural (many cows). Para singular sería "there is".'
  },

  /* Grammar — Present simple negative --------------------------- */
  {
    id: 'gra-005',
    topicId: 'present-simple-negative',
    type: 'grammar',
    category: 'present-simple-negative',
    prompt: 'Completa la oración con la forma correcta',
    question: 'He ___ work in the city.',
    options: ['do not', 'does not', 'is not', 'are not'],
    correctIndex: 1,
    explanation: 'Con "he", "she", "it" usamos "does not". He does not work in the city.'
  },

  /* Grammar — Articles a/an ------------------------------------- */
  {
    id: 'gra-006',
    topicId: 'articles-a-an',
    type: 'grammar',
    category: 'articles',
    prompt: 'Selecciona el artículo correcto',
    question: 'I have ___ orange.',
    options: ['a', 'an', 'the', '(nada)'],
    correctIndex: 1,
    explanation: 'Antes de sonido vocal usamos "an". "Orange" empieza con vocal: an orange.'
  },
  {
    id: 'gra-007',
    topicId: 'articles-a-an',
    type: 'grammar',
    category: 'articles',
    prompt: 'Selecciona el artículo correcto',
    question: 'She is ___ teacher.',
    options: ['a', 'an', 'the', '(nada)'],
    correctIndex: 0,
    explanation: 'Antes de sonido consonante usamos "a". "Teacher" empieza con /t/: a teacher.'
  },

  /* Grammar — Plurals ------------------------------------------- */
  {
    id: 'gra-008',
    topicId: 'plurals',
    type: 'grammar',
    category: 'plurals',
    prompt: 'Selecciona el plural correcto',
    question: 'Plural de "family":',
    options: ['familys', 'families', 'familyes', 'family'],
    correctIndex: 1,
    explanation: 'Cuando una palabra termina en consonante + y, cambiamos -y por -ies: family → families.'
  },
  {
    id: 'gra-009',
    topicId: 'plurals',
    type: 'grammar',
    category: 'plurals',
    prompt: 'Selecciona el plural correcto',
    question: 'Plural de "box":',
    options: ['boxs', 'boxies', 'boxes', 'box'],
    correctIndex: 2,
    explanation: 'Las palabras que terminan en -x, -s, -ch, -sh forman el plural con -es: box → boxes.'
  },

  /* Grammar — Possessive adjectives ----------------------------- */
  {
    id: 'gra-010',
    topicId: 'possessive-adjectives',
    type: 'grammar',
    category: 'possessives',
    prompt: 'Completa con el posesivo correcto',
    question: '___ name is Carlos. (yo)',
    options: ['Your', 'My', 'His', 'Our'],
    correctIndex: 1,
    explanation: 'El posesivo de "I" es "my". My name is Carlos (Mi nombre es Carlos).'
  },
  {
    id: 'gra-011',
    topicId: 'possessive-adjectives',
    type: 'grammar',
    category: 'possessives',
    prompt: 'Completa con el posesivo correcto',
    question: 'She lives with ___ family. (de ella)',
    options: ['his', 'her', 'their', 'our'],
    correctIndex: 1,
    explanation: 'El posesivo de "she" es "her". She lives with her family.'
  },

  /* Grammar — Can / Can't --------------------------------------- */
  {
    id: 'gra-012',
    topicId: 'can-cant',
    type: 'grammar',
    category: 'can-cant',
    prompt: 'Selecciona la forma correcta',
    question: 'She ___ ride a horse.',
    options: ['cans', 'can', 'cans to', 'is can'],
    correctIndex: 1,
    explanation: '"Can" no cambia con la persona. Decimos "She can ride", nunca "She cans ride".'
  },
  {
    id: 'gra-013',
    topicId: 'can-cant',
    type: 'grammar',
    category: 'can-cant',
    prompt: 'Selecciona la forma negativa correcta',
    question: 'I ___ swim in this river.',
    options: ['no can', 'can no', 'can\'t', 'don\'t can'],
    correctIndex: 2,
    explanation: 'La forma negativa de "can" es "cannot" o su contracción "can\'t".'
  },

  /* Grammar — Prepositions of place ----------------------------- */
  {
    id: 'gra-014',
    topicId: 'prepositions-of-place',
    type: 'grammar',
    category: 'prepositions',
    prompt: 'Selecciona la preposición correcta',
    question: 'The cow is ___ the field.',
    options: ['on', 'in', 'under', 'next'],
    correctIndex: 1,
    explanation: '"In" significa dentro de un espacio (el campo). The cow is in the field.'
  },
  {
    id: 'gra-015',
    topicId: 'prepositions-of-place',
    type: 'grammar',
    category: 'prepositions',
    prompt: 'Selecciona la preposición correcta',
    question: 'The book is ___ the table.',
    options: ['in', 'on', 'under', 'between'],
    correctIndex: 1,
    explanation: '"On" significa sobre una superficie. The book is on the table (encima de la mesa).'
  },

  /* =============================================================
   * Nivel A2 — Pre-intermediate
   * ============================================================= */

  /* Past simple — regular verbs (gra-016 a gra-019) */
  {
    id: 'gra-016',
    topicId: 'past-simple-regular',
    type: 'grammar',
    category: 'past-simple',
    format: 'fill-blank',
    prompt: 'Escribe el verbo "work" en past simple',
    question: 'Yesterday I ___ at home all day.',
    acceptedAnswers: ['worked'],
    explanation: 'Para verbos regulares en past simple añadimos "-ed": work → worked.'
  },
  {
    id: 'gra-017',
    topicId: 'past-simple-regular',
    type: 'grammar',
    category: 'past-simple',
    prompt: 'Completa la negativa correctamente',
    question: 'She ___ TV last night.',
    options: ['didn\'t watched', 'didn\'t watch', 'not watched', 'wasn\'t watch'],
    correctIndex: 1,
    explanation: 'Tras "didn\'t" el verbo vuelve a su forma base. Decimos "didn\'t watch", nunca "didn\'t watched".'
  },
  {
    id: 'gra-018',
    topicId: 'past-simple-regular',
    type: 'grammar',
    category: 'past-simple',
    prompt: 'Selecciona la forma con ortografía correcta',
    question: 'Past simple of "study":',
    options: ['studyed', 'studied', 'studyied', 'studed'],
    correctIndex: 1,
    explanation: 'Si el verbo termina en consonante + y, cambiamos -y por -ied: study → studied.'
  },
  {
    id: 'gra-019',
    topicId: 'past-simple-regular',
    type: 'grammar',
    category: 'past-simple',
    prompt: 'Completa la pregunta correctamente',
    question: '___ you finish your homework?',
    options: ['Did', 'Do', 'Have', 'Are'],
    correctIndex: 0,
    explanation: 'Para preguntas en past simple usamos el auxiliar "did" + sujeto + verbo en forma base.'
  },

  /* Past simple — irregular verbs (gra-020 a gra-023) */
  {
    id: 'gra-020',
    topicId: 'past-simple-irregular',
    type: 'grammar',
    category: 'past-simple',
    format: 'fill-blank',
    prompt: 'Escribe el past simple de "go"',
    question: 'Past simple of "go": ___',
    acceptedAnswers: ['went'],
    explanation: '"Go" es irregular: el past simple es "went". "Gone" es el participio (have gone).'
  },
  {
    id: 'gra-021',
    topicId: 'past-simple-irregular',
    type: 'grammar',
    category: 'past-simple',
    format: 'fill-blank',
    prompt: 'Escribe el past simple de "have"',
    question: 'Past simple of "have": ___',
    acceptedAnswers: ['had'],
    explanation: '"Have" es irregular: past simple → had. "Has" es presente para tercera persona.'
  },
  {
    id: 'gra-022',
    topicId: 'past-simple-irregular',
    type: 'grammar',
    category: 'past-simple',
    format: 'fill-blank',
    prompt: 'Escribe el past simple de "see"',
    question: 'Past simple of "see": ___',
    acceptedAnswers: ['saw'],
    explanation: '"See" es irregular: past simple → saw. "Seen" es el participio.'
  },
  {
    id: 'gra-023',
    topicId: 'past-simple-irregular',
    type: 'grammar',
    category: 'past-simple',
    prompt: 'Completa con el pasado del verbo',
    question: 'I ___ a great movie last night.',
    options: ['see', 'saw', 'seen', 'sawed'],
    correctIndex: 1,
    explanation: '"Last night" indica past simple. El pasado de "see" es "saw".'
  },

  /* Past continuous (gra-024 a gra-027) */
  {
    id: 'gra-024',
    topicId: 'past-continuous',
    type: 'grammar',
    category: 'past-continuous',
    prompt: 'Completa con la forma correcta',
    question: 'While I ___ dinner, the phone rang.',
    options: ['cooked', 'was cooking', 'cooking', 'am cooking'],
    correctIndex: 1,
    explanation: 'La acción larga interrumpida usa past continuous: "I was cooking when the phone rang".'
  },
  {
    id: 'gra-025',
    topicId: 'past-continuous',
    type: 'grammar',
    category: 'past-continuous',
    prompt: 'Completa correctamente',
    question: 'They ___ TV when I arrived.',
    options: ['watched', 'were watching', 'are watching', 'watch'],
    correctIndex: 1,
    explanation: 'La acción que estaba en progreso ("watching TV") va en past continuous: were watching.'
  },
  {
    id: 'gra-026',
    topicId: 'past-continuous',
    type: 'grammar',
    category: 'past-continuous',
    prompt: 'Selecciona la forma correcta',
    question: 'At 8 p.m. yesterday, she ___ in the library.',
    options: ['studies', 'studied', 'was studying', 'is studying'],
    correctIndex: 2,
    explanation: 'Para una acción en progreso en un momento específico del pasado, usamos past continuous.'
  },
  {
    id: 'gra-027',
    topicId: 'past-continuous',
    type: 'grammar',
    category: 'past-continuous',
    prompt: 'Completa con la forma correcta',
    question: 'I was sleeping when the alarm ___.',
    options: ['rang', 'was ringing', 'rings', 'rung'],
    correctIndex: 0,
    explanation: 'La acción corta que interrumpe va en past simple: "rang" (pasado de ring).'
  },

  /* Present continuous vs present simple (gra-028 a gra-031) */
  {
    id: 'gra-028',
    topicId: 'present-continuous',
    type: 'grammar',
    category: 'present-continuous',
    prompt: 'Completa correctamente',
    question: 'Listen! Someone ___ at the door.',
    options: ['knocks', 'is knocking', 'knock', 'knocked'],
    correctIndex: 1,
    explanation: '"Listen!" indica que pasa AHORA → present continuous: is knocking.'
  },
  {
    id: 'gra-029',
    topicId: 'present-continuous',
    type: 'grammar',
    category: 'present-continuous',
    prompt: 'Completa correctamente',
    question: 'Right now I ___ a book.',
    options: ['read', 'reading', 'am reading', 'reads'],
    correctIndex: 2,
    explanation: '"Right now" señala una acción en progreso → present continuous: am reading.'
  },
  {
    id: 'gra-030',
    topicId: 'present-continuous',
    type: 'grammar',
    category: 'present-simple',
    prompt: 'Completa correctamente',
    question: 'She usually ___ the bus to work.',
    options: ['is taking', 'takes', 'take', 'taking'],
    correctIndex: 1,
    explanation: '"Usually" indica rutina → present simple: takes (tercera persona singular lleva -s).'
  },
  {
    id: 'gra-031',
    topicId: 'present-continuous',
    type: 'grammar',
    category: 'state-verbs',
    prompt: 'Completa correctamente',
    question: 'I ___ you. Please speak louder.',
    options: ['don\'t hear', 'am not hearing', 'not hearing', 'doesn\'t hear'],
    correctIndex: 0,
    explanation: '"Hear" es verbo de estado: no se usa en continuo. Lo correcto es "I don\'t hear you".'
  },

  /* Comparatives (gra-032 a gra-035) */
  {
    id: 'gra-032',
    topicId: 'comparatives',
    type: 'grammar',
    category: 'comparatives',
    prompt: 'Completa con el comparativo correcto',
    question: 'My brother is ___ than me.',
    options: ['tall', 'taller', 'more tall', 'tallest'],
    correctIndex: 1,
    explanation: 'Adjetivo corto + "-er": tall → taller. "More tall" es incorrecto.'
  },
  {
    id: 'gra-033',
    topicId: 'comparatives',
    type: 'grammar',
    category: 'comparatives',
    prompt: 'Completa con el comparativo correcto',
    question: 'This book is ___ than that one.',
    options: ['most interesting', 'interestinger', 'more interesting', 'most interestinger'],
    correctIndex: 2,
    explanation: 'Adjetivo largo: usamos "more + adjetivo": more interesting.'
  },
  {
    id: 'gra-034',
    topicId: 'comparatives',
    type: 'grammar',
    category: 'comparatives',
    prompt: 'Completa con el comparativo correcto',
    question: 'Today the weather is ___ than yesterday.',
    options: ['gooder', 'better', 'more good', 'more better'],
    correctIndex: 1,
    explanation: '"Good" es irregular: el comparativo es "better". Nunca "more better" ni "gooder".'
  },
  {
    id: 'gra-035',
    topicId: 'comparatives',
    type: 'grammar',
    category: 'comparatives',
    prompt: 'Completa con el comparativo correcto',
    question: 'She is ___ than her sister.',
    options: ['happier', 'happyer', 'more happy', 'happiest'],
    correctIndex: 0,
    explanation: 'Adjetivo de 2 sílabas terminado en -y: -y → -ier. Happy → happier.'
  },

  /* Superlatives (gra-036 a gra-039) */
  {
    id: 'gra-036',
    topicId: 'superlatives',
    type: 'grammar',
    category: 'superlatives',
    prompt: 'Completa con el superlativo correcto',
    question: 'Mount Everest is the ___ mountain in the world.',
    options: ['high', 'higher', 'highest', 'most high'],
    correctIndex: 2,
    explanation: 'Adjetivo corto + "-est": high → highest. Llevamos "the" delante: the highest.'
  },
  {
    id: 'gra-037',
    topicId: 'superlatives',
    type: 'grammar',
    category: 'superlatives',
    prompt: 'Completa con el superlativo correcto',
    question: 'He is the ___ player on the team.',
    options: ['good', 'better', 'best', 'most good'],
    correctIndex: 2,
    explanation: '"Good" es irregular: superlativo → the best.'
  },
  {
    id: 'gra-038',
    topicId: 'superlatives',
    type: 'grammar',
    category: 'superlatives',
    prompt: 'Completa con el superlativo correcto',
    question: 'This is the ___ restaurant in town.',
    options: ['expensive', 'most expensive', 'more expensive', 'expensivest'],
    correctIndex: 1,
    explanation: 'Adjetivo largo: "the most + adjetivo". The most expensive.'
  },
  {
    id: 'gra-039',
    topicId: 'superlatives',
    type: 'grammar',
    category: 'superlatives',
    prompt: 'Completa con el superlativo correcto',
    question: 'It was the ___ day of my life.',
    options: ['bad', 'worse', 'worst', 'most bad'],
    correctIndex: 2,
    explanation: '"Bad" es irregular: comparativo → worse, superlativo → the worst.'
  },

  /* Future with going to (gra-040 a gra-043) */
  {
    id: 'gra-040',
    topicId: 'future-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Completa la predicción con evidencia',
    question: 'Look at those clouds! It ___ rain.',
    options: ['will', 'is going to', 'goes to', 'going to'],
    correctIndex: 1,
    explanation: 'Predicción con evidencia visible (las nubes) → "is going to". Nunca "going to" sin "is/am/are".'
  },
  {
    id: 'gra-041',
    topicId: 'future-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Completa con la forma correcta',
    question: 'I ___ visit my grandmother next weekend. (plan)',
    options: ['will', 'am going to', 'go to', 'going'],
    correctIndex: 1,
    explanation: 'Plan ya decidido → "am going to + verbo".'
  },
  {
    id: 'gra-042',
    topicId: 'future-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Completa con la forma correcta',
    question: 'She ___ be a doctor when she finishes.',
    options: ['going to', 'is going to', 'will be going', 'is going'],
    correctIndex: 1,
    explanation: 'Plan/intención de futuro → is going to + verbo base (be).'
  },
  {
    id: 'gra-043',
    topicId: 'future-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Completa la oración correctamente',
    question: 'We aren\'t going ___ buy that car.',
    options: ['buy', 'to buy', 'buying', 'bought'],
    correctIndex: 1,
    explanation: 'La estructura es "going TO + verbo base": going to buy.'
  },

  /* =============================================================
   * Nivel B1 — Intermediate
   * ============================================================= */

  /* Present perfect (gra-044 a gra-047) */
  {
    id: 'gra-044',
    topicId: 'present-perfect',
    type: 'grammar',
    category: 'present-perfect',
    prompt: 'Completa con el present perfect',
    question: 'I ___ in this city for ten years.',
    options: ['live', 'lived', 'have lived', 'am living'],
    correctIndex: 2,
    explanation: '"For ten years" + acción que continúa hasta hoy → present perfect: have lived.'
  },
  {
    id: 'gra-045',
    topicId: 'present-perfect',
    type: 'grammar',
    category: 'present-perfect',
    prompt: 'Completa correctamente',
    question: 'She ___ Paris three times.',
    options: ['has visited', 'visited', 'is visiting', 'visit'],
    correctIndex: 0,
    explanation: 'Experiencia de vida sin tiempo específico → present perfect. Tercera persona: has visited.'
  },
  {
    id: 'gra-046',
    topicId: 'present-perfect',
    type: 'grammar',
    category: 'present-perfect',
    prompt: 'Completa con la forma negativa',
    question: 'They ___ arrived yet.',
    options: ['didn\'t', 'haven\'t', 'aren\'t', 'don\'t have'],
    correctIndex: 1,
    explanation: '"Yet" suele acompañar al present perfect en negativas: haven\'t arrived.'
  },
  {
    id: 'gra-047',
    topicId: 'present-perfect',
    type: 'grammar',
    category: 'present-perfect',
    prompt: 'Completa con el present perfect',
    question: 'I ___ him since 2018.',
    options: ['know', 'knew', 'have known', 'am knowing'],
    correctIndex: 2,
    explanation: '"Since 2018" + relación que sigue → present perfect: have known.'
  },

  /* Present perfect vs past simple (gra-048 a gra-051) */
  {
    id: 'gra-048',
    topicId: 'present-perfect-vs-past',
    type: 'grammar',
    category: 'past-vs-perfect',
    prompt: 'Selecciona la forma correcta',
    question: 'I ___ that movie last night.',
    options: ['have seen', 'saw', 'see', 'had seen'],
    correctIndex: 1,
    explanation: '"Last night" es tiempo terminado → past simple: saw.'
  },
  {
    id: 'gra-049',
    topicId: 'present-perfect-vs-past',
    type: 'grammar',
    category: 'past-vs-perfect',
    prompt: 'Selecciona la forma correcta',
    question: 'Have you ever ___ sushi?',
    options: ['try', 'tried', 'been try', 'tasted'],
    correctIndex: 1,
    explanation: 'Tras "have" va el participio. "Tried" funciona en preguntas con "ever" (experiencia de vida).'
  },
  {
    id: 'gra-050',
    topicId: 'present-perfect-vs-past',
    type: 'grammar',
    category: 'past-vs-perfect',
    prompt: 'Selecciona la forma correcta',
    question: 'She ___ in this company since 2020.',
    options: ['worked', 'has worked', 'works', 'is working'],
    correctIndex: 1,
    explanation: '"Since 2020" + sigue trabajando ahora → present perfect: has worked.'
  },
  {
    id: 'gra-051',
    topicId: 'present-perfect-vs-past',
    type: 'grammar',
    category: 'past-vs-perfect',
    prompt: 'Selecciona la forma correcta',
    question: 'He ___ here yesterday.',
    options: ['has been', 'was', 'has come', 'been'],
    correctIndex: 1,
    explanation: '"Yesterday" exige past simple: was.'
  },

  /* First conditional (gra-052 a gra-055) */
  {
    id: 'gra-052',
    topicId: 'first-conditional',
    type: 'grammar',
    category: 'conditionals',
    format: 'word-order',
    prompt: 'Ordena las palabras para formar un primer condicional',
    instruction: 'Arma la oración: si llueve mañana, nos quedaremos en casa.',
    tokens: ['If', 'it', 'rains', 'tomorrow,', 'we', 'will', 'stay', 'home.'],
    explanation: 'Estructura: "If + present simple, will + verbo base". Tras "if" usamos present simple, no "will".'
  },
  {
    id: 'gra-053',
    topicId: 'first-conditional',
    type: 'grammar',
    category: 'conditionals',
    format: 'word-order',
    prompt: 'Ordena las palabras para completar el primer condicional',
    instruction: 'Arma el resultado: si estudias, pasarás el examen.',
    tokens: ['If', 'you', 'study,', 'you', 'will', 'pass', 'the', 'exam.'],
    explanation: 'Primer condicional: "If + present simple, will + verbo base".'
  },
  {
    id: 'gra-054',
    topicId: 'first-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa la condicional negativa',
    question: 'If she ___ hurry, she will miss the bus.',
    options: ['don\'t', 'doesn\'t', 'won\'t', 'not'],
    correctIndex: 1,
    explanation: 'Tercera persona en presente negativo → "doesn\'t". If she doesn\'t hurry...'
  },
  {
    id: 'gra-055',
    topicId: 'first-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa correctamente',
    question: 'I will call you if I ___ time.',
    options: ['will have', 'have', 'had', 'would have'],
    correctIndex: 1,
    explanation: 'Aunque la cláusula con "if" puede ir al final, sigue en present simple: have.'
  },

  /* Modals of obligation (gra-056 a gra-059) */
  {
    id: 'gra-056',
    topicId: 'modals-obligation',
    type: 'grammar',
    category: 'modals',
    format: 'true-false',
    prompt: 'Decide si la afirmación es verdadera o falsa',
    statement: '"You mustn\'t smoke here" means smoking is forbidden by rule.',
    correctAnswer: true,
    explanation: 'Verdadero. "Mustn\'t" expresa prohibición — algo que está prohibido por una regla o ley.'
  },
  {
    id: 'gra-057',
    topicId: 'modals-obligation',
    type: 'grammar',
    category: 'modals',
    format: 'true-false',
    prompt: 'Decide si la afirmación es verdadera o falsa',
    statement: '"Mustn\'t" and "don\'t have to" mean the same thing.',
    correctAnswer: false,
    explanation: 'Falso. "Mustn\'t" = está prohibido. "Don\'t have to" = no es necesario (puedes hacerlo o no, es opcional).'
  },
  {
    id: 'gra-058',
    topicId: 'modals-obligation',
    type: 'grammar',
    category: 'modals',
    prompt: 'Selecciona el modal correcto',
    question: 'You look tired. You ___ rest.',
    options: ['must', 'should', 'have to', 'shouldn\'t'],
    correctIndex: 1,
    explanation: '"Should" se usa para dar consejos: "deberías descansar".'
  },
  {
    id: 'gra-059',
    topicId: 'modals-obligation',
    type: 'grammar',
    category: 'modals',
    prompt: 'Selecciona la forma correcta en pasado',
    question: 'Yesterday I ___ leave early.',
    options: ['must', 'had to', 'should to', 'have to'],
    correctIndex: 1,
    explanation: '"Must" no tiene pasado: usamos "had to" para expresar obligación pasada.'
  },

  /* Will vs going to (gra-060 a gra-063) */
  {
    id: 'gra-060',
    topicId: 'will-vs-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Selecciona la forma correcta',
    question: '"The phone is ringing." — "I ___ get it!"',
    options: ['am going to', 'will', 'going to', 'get'],
    correctIndex: 1,
    explanation: 'Decisión espontánea en el momento de hablar → "will": "I\'ll get it".'
  },
  {
    id: 'gra-061',
    topicId: 'will-vs-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Selecciona la forma correcta',
    question: 'I\'ve decided. I ___ buy a new car next month.',
    options: ['will', 'am going to', 'go to', 'would'],
    correctIndex: 1,
    explanation: '"I\'ve decided" indica plan ya pensado → "am going to".'
  },
  {
    id: 'gra-062',
    topicId: 'will-vs-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Selecciona la forma correcta',
    question: 'Watch out! You ___ fall!',
    options: ['will', 'are going to', 'go to', 'would'],
    correctIndex: 1,
    explanation: 'Predicción con evidencia visible (lo veo a punto de caerse) → "are going to".'
  },
  {
    id: 'gra-063',
    topicId: 'will-vs-going-to',
    type: 'grammar',
    category: 'future',
    prompt: 'Selecciona la forma correcta',
    question: 'I think Brazil ___ win the World Cup.',
    options: ['is going to', 'will', 'would', 'going'],
    correctIndex: 1,
    explanation: 'Predicción basada en opinión (sin evidencia clara) → "will": I think Brazil will win.'
  },

  /* Used to (gra-064 a gra-067) */
  {
    id: 'gra-064',
    topicId: 'used-to',
    type: 'grammar',
    category: 'used-to',
    prompt: 'Completa con la forma correcta',
    question: 'When I was a child, I ___ play soccer every day.',
    options: ['use to', 'used to', 'would use', 'am used to'],
    correctIndex: 1,
    explanation: '"Used to" expresa hábito pasado que ya no existe.'
  },
  {
    id: 'gra-065',
    topicId: 'used-to',
    type: 'grammar',
    category: 'used-to',
    prompt: 'Completa con la forma correcta',
    question: 'She ___ smoke, but she stopped last year.',
    options: ['use to', 'used to', 'would use to', 'didn\'t use to'],
    correctIndex: 1,
    explanation: '"Used to" + verbo base para hábitos del pasado que ya no se hacen.'
  },
  {
    id: 'gra-066',
    topicId: 'used-to',
    type: 'grammar',
    category: 'used-to',
    prompt: 'Completa la pregunta',
    question: '___ you use to live in Bogotá?',
    options: ['Did', 'Do', 'Are', 'Have'],
    correctIndex: 0,
    explanation: 'Para preguntas con "use to" usamos el auxiliar "Did" + sujeto + use to.'
  },
  {
    id: 'gra-067',
    topicId: 'used-to',
    type: 'grammar',
    category: 'used-to',
    prompt: 'Completa con la forma correcta',
    question: 'He didn\'t ___ to like vegetables.',
    options: ['used', 'use', 'using', 'uses'],
    correctIndex: 1,
    explanation: 'En negativa y pregunta la "d" desaparece: didn\'t USE to (no "didn\'t used to").'
  },

  /* Relative clauses (gra-068 a gra-071) */
  {
    id: 'gra-068',
    topicId: 'relative-clauses',
    type: 'grammar',
    category: 'relative-clauses',
    prompt: 'Selecciona el pronombre relativo correcto',
    question: 'The man ___ called you is my brother.',
    options: ['which', 'who', 'where', 'what'],
    correctIndex: 1,
    explanation: '"Who" para personas. The man WHO called you is my brother.'
  },
  {
    id: 'gra-069',
    topicId: 'relative-clauses',
    type: 'grammar',
    category: 'relative-clauses',
    prompt: 'Selecciona el pronombre relativo correcto',
    question: 'The book ___ I bought is interesting.',
    options: ['who', 'which', 'where', 'what'],
    correctIndex: 1,
    explanation: '"Which" para cosas/animales. (También se podría usar "that" o incluso omitirse).'
  },
  {
    id: 'gra-070',
    topicId: 'relative-clauses',
    type: 'grammar',
    category: 'relative-clauses',
    prompt: 'Selecciona el pronombre relativo correcto',
    question: 'This is the house ___ I was born.',
    options: ['which', 'who', 'where', 'that'],
    correctIndex: 2,
    explanation: '"Where" introduce un lugar. Solo "where" funciona aquí sin reformular la oración.'
  },
  {
    id: 'gra-071',
    topicId: 'relative-clauses',
    type: 'grammar',
    category: 'relative-clauses',
    prompt: 'Selecciona el pronombre relativo correcto',
    question: 'The friend ___ helped me lives in Cali.',
    options: ['which', 'who', 'where', 'what'],
    correctIndex: 1,
    explanation: '"Who" para personas. Como es sujeto de la cláusula, NO se puede omitir.'
  },

  /* =============================================================
   * Nivel B2 — Upper-intermediate
   * ============================================================= */

  /* Past perfect (gra-072 a gra-075) */
  {
    id: 'gra-072',
    topicId: 'past-perfect',
    type: 'grammar',
    category: 'past-perfect',
    format: 'fill-blank',
    prompt: 'Completa con el auxiliar de past perfect',
    question: 'When I arrived, the train ___ already left.',
    acceptedAnswers: ['had'],
    explanation: 'Past perfect: had + participio. El tren se fue ANTES de mi llegada → had left.'
  },
  {
    id: 'gra-073',
    topicId: 'past-perfect',
    type: 'grammar',
    category: 'past-perfect',
    format: 'fill-blank',
    prompt: 'Completa con la forma de past perfect del verbo "meet"',
    question: 'She told me she ___ him before.',
    acceptedAnswers: ['had met'],
    explanation: 'Acción anterior a otro evento pasado → past perfect: had + participio (met).'
  },
  {
    id: 'gra-074',
    topicId: 'past-perfect',
    type: 'grammar',
    category: 'past-perfect',
    prompt: 'Completa con el past perfect',
    question: 'By the time we got there, the movie ___.',
    options: ['started', 'had started', 'has started', 'starts'],
    correctIndex: 1,
    explanation: '"By the time" + acción anterior a otra → past perfect: had started.'
  },
  {
    id: 'gra-075',
    topicId: 'past-perfect',
    type: 'grammar',
    category: 'past-perfect',
    prompt: 'Completa con el past perfect',
    question: 'I realized I ___ my keys at home.',
    options: ['forgot', 'had forgotten', 'forgotten', 'was forgetting'],
    correctIndex: 1,
    explanation: 'El olvido ocurrió ANTES de que me diera cuenta → past perfect: had forgotten.'
  },

  /* Second conditional (gra-076 a gra-079) */
  {
    id: 'gra-076',
    topicId: 'second-conditional',
    type: 'grammar',
    category: 'conditionals',
    format: 'word-order',
    prompt: 'Ordena las palabras para formar un segundo condicional',
    instruction: 'Arma la oración: si fuera rico, viajaría por el mundo.',
    tokens: ['If', 'I', 'were', 'rich,', 'I', 'would', 'travel', 'the', 'world.'],
    explanation: 'Segundo condicional: "If + past simple, would + verbo base". Con "I/he/she/it" se prefiere "were" en estilo cuidado.'
  },
  {
    id: 'gra-077',
    topicId: 'second-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el segundo condicional',
    question: 'If she ___ harder, she would pass the exam.',
    options: ['studied', 'studies', 'would study', 'had studied'],
    correctIndex: 0,
    explanation: 'Tras "if" en segundo condicional usamos past simple: studied.'
  },
  {
    id: 'gra-078',
    topicId: 'second-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el segundo condicional',
    question: 'What would you do if you ___ the lottery?',
    options: ['win', 'won', 'would win', 'had won'],
    correctIndex: 1,
    explanation: 'Situación hipotética → tras "if" va past simple: won. (Nunca "would win" tras if).'
  },
  {
    id: 'gra-079',
    topicId: 'second-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el segundo condicional',
    question: 'If I were you, I ___ tell her the truth.',
    options: ['will', 'would', 'am going to', 'had'],
    correctIndex: 1,
    explanation: 'En la cláusula principal del segundo condicional usamos "would + verbo base".'
  },

  /* Third conditional (gra-080 a gra-083) */
  {
    id: 'gra-080',
    topicId: 'third-conditional',
    type: 'grammar',
    category: 'conditionals',
    format: 'word-order',
    prompt: 'Ordena las palabras para formar un tercer condicional',
    instruction: 'Arma la oración: si hubiera estudiado, habría pasado.',
    tokens: ['If', 'I', 'had', 'studied,', 'I', 'would', 'have', 'passed.'],
    explanation: 'Tercer condicional: "If + had + participio, would have + participio". Hipótesis sobre el pasado.'
  },
  {
    id: 'gra-081',
    topicId: 'third-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el tercer condicional',
    question: 'She ___ missed the train if she had left earlier.',
    options: ['wouldn\'t have', 'didn\'t', 'hadn\'t', 'wasn\'t'],
    correctIndex: 0,
    explanation: 'Resultado hipotético del pasado → "would have + participio" (negativo: wouldn\'t have).'
  },
  {
    id: 'gra-082',
    topicId: 'third-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el tercer condicional',
    question: 'If you ___ told me, I would have helped.',
    options: ['had', 'would have', 'have', 'did'],
    correctIndex: 0,
    explanation: 'Tras "if" en tercer condicional: had + participio → had told.'
  },
  {
    id: 'gra-083',
    topicId: 'third-conditional',
    type: 'grammar',
    category: 'conditionals',
    prompt: 'Completa el tercer condicional',
    question: 'What would you have done if you ___ been there?',
    options: ['had', 'have', 'would have', 'were'],
    correctIndex: 0,
    explanation: 'Tras "if" en tercer condicional: had + participio → had been.'
  },

  /* Passive voice (gra-084 a gra-087) */
  {
    id: 'gra-084',
    topicId: 'passive-voice',
    type: 'grammar',
    category: 'passive',
    prompt: 'Completa con la voz pasiva',
    question: 'Coffee ___ in Colombia.',
    options: ['grows', 'is grown', 'is growing', 'grew'],
    correctIndex: 1,
    explanation: 'Pasiva en presente: am/is/are + participio. Coffee is grown (es cultivado).'
  },
  {
    id: 'gra-085',
    topicId: 'passive-voice',
    type: 'grammar',
    category: 'passive',
    prompt: 'Completa con la voz pasiva',
    question: 'The book ___ in 1990.',
    options: ['wrote', 'was written', 'was wrote', 'has written'],
    correctIndex: 1,
    explanation: 'Pasiva en pasado: was/were + participio. "Write" es irregular: written.'
  },
  {
    id: 'gra-086',
    topicId: 'passive-voice',
    type: 'grammar',
    category: 'passive',
    prompt: 'Completa con la voz pasiva',
    question: 'These cars ___ in Japan.',
    options: ['make', 'are made', 'are make', 'made'],
    correctIndex: 1,
    explanation: 'Pasiva en presente plural: are + participio. Are made (son fabricados).'
  },
  {
    id: 'gra-087',
    topicId: 'passive-voice',
    type: 'grammar',
    category: 'passive',
    prompt: 'Completa con la voz pasiva',
    question: 'My phone ___ yesterday.',
    options: ['stole', 'was stolen', 'is stolen', 'steal'],
    correctIndex: 1,
    explanation: 'Pasiva pasada con "yesterday": was + participio. Steal → stolen.'
  },

  /* Reported speech (gra-088 a gra-091) */
  {
    id: 'gra-088',
    topicId: 'reported-speech',
    type: 'grammar',
    category: 'reported-speech',
    format: 'word-order',
    prompt: 'Ordena las palabras para formar el estilo indirecto',
    instruction: 'Pasa al estilo indirecto: He said: "I am tired."',
    tokens: ['He', 'said', 'he', 'was', 'tired.'],
    explanation: 'En reported speech: present simple → past simple (am → was), y "I" → "he".'
  },
  {
    id: 'gra-089',
    topicId: 'reported-speech',
    type: 'grammar',
    category: 'reported-speech',
    prompt: 'Completa el estilo indirecto',
    question: 'She said: "I will call you." → She said she ___ call me.',
    options: ['will', 'would', 'had', 'was going to'],
    correctIndex: 1,
    explanation: 'Will → would en reported speech.'
  },
  {
    id: 'gra-090',
    topicId: 'reported-speech',
    type: 'grammar',
    category: 'reported-speech',
    prompt: 'Completa el estilo indirecto',
    question: 'He said: "I saw him yesterday." → He said he ___ him the day before.',
    options: ['saw', 'had seen', 'has seen', 'would see'],
    correctIndex: 1,
    explanation: 'Past simple → past perfect en reported speech: saw → had seen.'
  },
  {
    id: 'gra-091',
    topicId: 'reported-speech',
    type: 'grammar',
    category: 'reported-speech',
    prompt: 'Completa el estilo indirecto',
    question: 'She said: "I can swim." → She said she ___ swim.',
    options: ['can', 'could', 'would', 'had'],
    correctIndex: 1,
    explanation: 'Can → could en reported speech.'
  },

  /* Modals of deduction (gra-092 a gra-095) */
  {
    id: 'gra-092',
    topicId: 'modals-deduction',
    type: 'grammar',
    category: 'modals',
    prompt: 'Selecciona el modal de deducción correcto',
    question: 'The lights are on. They ___ be home.',
    options: ['can', 'must', 'mustn\'t', 'have to'],
    correctIndex: 1,
    explanation: 'Deducción casi segura basada en evidencia → "must": they must be home.'
  },
  {
    id: 'gra-093',
    topicId: 'modals-deduction',
    type: 'grammar',
    category: 'modals',
    prompt: 'Selecciona la deducción del pasado correcta',
    question: 'He didn\'t answer. He ___ have been busy.',
    options: ['must', 'can', 'would', 'will'],
    correctIndex: 0,
    explanation: 'Deducción del pasado: must + have + participio. He must have been busy.'
  },
  {
    id: 'gra-094',
    topicId: 'modals-deduction',
    type: 'grammar',
    category: 'modals',
    format: 'true-false',
    prompt: 'Decide si la afirmación es verdadera o falsa',
    statement: 'To deny a deduction (something is impossible), we say "That mustn\'t be true".',
    correctAnswer: false,
    explanation: 'Falso. Para negar una deducción usamos "can\'t" ("That can\'t be true!"). "Mustn\'t" expresa prohibición, no deducción imposible.'
  },
  {
    id: 'gra-095',
    topicId: 'modals-deduction',
    type: 'grammar',
    category: 'modals',
    prompt: 'Selecciona el modal correcto',
    question: 'I\'m not sure where she is. She ___ be at home.',
    options: ['must', 'might', 'can\'t', 'mustn\'t'],
    correctIndex: 1,
    explanation: 'Posibilidad media (no estoy seguro) → "might": she might be at home.'
  },

  /* Wish / If only (gra-096 a gra-099) */
  {
    id: 'gra-096',
    topicId: 'wish-if-only',
    type: 'grammar',
    category: 'wish',
    prompt: 'Completa con la forma correcta',
    question: 'I wish I ___ more time.',
    options: ['have', 'had', 'will have', 'would have'],
    correctIndex: 1,
    explanation: 'Wish + past simple para deseos imposibles en el presente: had.'
  },
  {
    id: 'gra-097',
    topicId: 'wish-if-only',
    type: 'grammar',
    category: 'wish',
    prompt: 'Completa con la forma correcta',
    question: 'She wishes she ___ harder for the exam.',
    options: ['studied', 'had studied', 'studies', 'would study'],
    correctIndex: 1,
    explanation: 'Arrepentimiento del pasado → wish + past perfect: had studied.'
  },
  {
    id: 'gra-098',
    topicId: 'wish-if-only',
    type: 'grammar',
    category: 'wish',
    prompt: 'Completa con la forma correcta',
    question: 'If only I ___ what to do!',
    options: ['know', 'knew', 'had known', 'would know'],
    correctIndex: 1,
    explanation: '"If only" funciona como "wish": para deseos presentes imposibles → past simple: knew.'
  },
  {
    id: 'gra-099',
    topicId: 'wish-if-only',
    type: 'grammar',
    category: 'wish',
    format: 'true-false',
    prompt: 'Decide si la afirmación es verdadera o falsa',
    statement: 'After "wish" to criticize someone\'s annoying behavior, we use "would" (e.g. "I wish you would stop").',
    correctAnswer: true,
    explanation: 'Verdadero. "Wish + would" sirve para criticar comportamientos ajenos que queremos cambiar.'
  },

  /* =============================================================
   * Lecciones de Matching (vocabulario en pares)
   * ============================================================= */
  {
    id: 'mat-001',
    topicId: 'vocabulary-farm-animals',
    type: 'vocabulary',
    category: 'animals',
    format: 'matching',
    prompt: 'Empareja cada animal con su nombre en inglés',
    instruction: 'Toca una palabra en inglés y luego su traducción en español.',
    pairs: [
      { en: 'cow',     es: 'vaca' },
      { en: 'horse',   es: 'caballo' },
      { en: 'chicken', es: 'gallina' },
      { en: 'sheep',   es: 'oveja' }
    ],
    explanation: 'Animales comunes en una finca. "Sheep" es irregular: el plural es igual al singular.'
  },
  {
    id: 'mat-002',
    topicId: 'vocabulary-people-jobs',
    type: 'vocabulary',
    category: 'people',
    format: 'matching',
    prompt: 'Empareja cada oficio con su nombre en inglés',
    instruction: 'Toca una palabra en inglés y luego su traducción en español.',
    pairs: [
      { en: 'farmer',  es: 'agricultor' },
      { en: 'teacher', es: 'profesor/a' },
      { en: 'driver',  es: 'conductor' },
      { en: 'doctor',  es: 'médico/a' }
    ],
    explanation: 'Oficios comunes. "Teacher" y "driver" son neutros (no cambian con el género).'
  },
  {
    id: 'mat-003',
    topicId: 'vocabulary-food-crops',
    type: 'vocabulary',
    category: 'food',
    format: 'matching',
    prompt: 'Empareja cada alimento con su nombre en inglés',
    instruction: 'Toca una palabra en inglés y luego su traducción en español.',
    pairs: [
      { en: 'corn',   es: 'maíz' },
      { en: 'beans',  es: 'frijoles' },
      { en: 'coffee', es: 'café' },
      { en: 'rice',   es: 'arroz' }
    ],
    explanation: 'Cultivos centrales en Colombia. "Beans" siempre va en plural cuando significa frijoles.'
  },
  {
    id: 'mat-004',
    topicId: 'vocabulary-nature',
    type: 'vocabulary',
    category: 'nature',
    format: 'matching',
    prompt: 'Empareja cada elemento natural con su nombre en inglés',
    instruction: 'Toca una palabra en inglés y luego su traducción en español.',
    pairs: [
      { en: 'river',    es: 'río' },
      { en: 'mountain', es: 'montaña' },
      { en: 'forest',   es: 'bosque' },
      { en: 'field',    es: 'campo' }
    ],
    explanation: 'Vocabulario para describir paisajes rurales colombianos.'
  },
  {
    id: 'mat-005',
    topicId: 'vocabulary-community',
    type: 'vocabulary',
    category: 'community',
    format: 'matching',
    prompt: 'Empareja cada palabra de comunidad con su nombre en inglés',
    instruction: 'Toca una palabra en inglés y luego su traducción en español.',
    pairs: [
      { en: 'community', es: 'comunidad' },
      { en: 'neighbor',  es: 'vecino/a' },
      { en: 'friend',    es: 'amigo/a' },
      { en: 'family',    es: 'familia' }
    ],
    explanation: '"Neighbor" y "friend" son neutros (sin distinción de género).'
  }
];
