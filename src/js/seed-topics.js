/**
 * Datos semilla de TOPICS (lecciones de teoría) nivel A1.
 *
 * Cada topic agrupa varios ejercicios de SEED_LESSONS y aporta el contenido
 * pedagógico previo a la práctica, replicando el patrón de test-english.com:
 *   - Form     → tarjetas por sujeto (afirmativa / negativa / pregunta)
 *   - Use      → explicación en prosa de cuándo y por qué se usa
 *   - Examples → lista de oraciones de muestra
 *   - Note     → tip o aviso pedagógico opcional
 *
 * El contenido está contextualizado al entorno rural colombiano siguiendo la
 * recomendación de Hoyos (2024) sobre vocabulario relevante al usuario.
 *
 * Estructura de un topic:
 *   id        — slug estable (string, kebab-case)
 *   level     — 'A1' | 'A2' | 'B1' | 'B2' (de momento solo A1)
 *   order     — orden dentro del nivel
 *   title     — título visible en el índice y la pantalla del topic
 *   summary   — descripción corta (1–2 frases) para el índice
 *   sections  — array de secciones tipadas por `kind`
 *   lessonIds — ejercicios pertenecientes a este topic
 */
const SEED_TOPICS = [
  {
    id: 'verb-to-be',
    level: 'A1',
    order: 1,
    title: 'Verb to be — am / is / are',
    summary: 'El verbo más fundamental del inglés: presentarte, decir de dónde eres y qué eres.',
    lessonIds: ['gra-001', 'gra-002', 'gra-003'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I',
            affirmative: 'I am a farmer.',
            negative: 'I am not a farmer.',
            question: 'Am I a farmer?'
          },
          {
            subject: 'He / She / It',
            affirmative: 'She is from Colombia.',
            negative: 'She is not from Colombia.',
            question: 'Is she from Colombia?'
          },
          {
            subject: 'We / You / They',
            affirmative: 'We are students.',
            negative: 'We are not students.',
            question: 'Are we students?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el verbo "to be" para describir quién eres, de dónde vienes, tu profesión, tu edad y características personales. Es el verbo más frecuente del inglés y aparece en casi todas las conversaciones cotidianas.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I am Colombian.',
          'You are my neighbor.',
          'He is a teacher.',
          'We are from a small town.',
          'They are happy.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'En conversación es muy común usar contracciones: I am → I\'m, she is → she\'s, we are → we\'re.'
      }
    ]
  },
  {
    id: 'there-is-are',
    level: 'A1',
    order: 2,
    title: 'There is / There are',
    summary: 'Cómo decir que algo existe o está presente en un lugar.',
    lessonIds: ['gra-004'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Singular',
            affirmative: 'There is a cow in the field.',
            negative: 'There is not a cow in the field.',
            question: 'Is there a cow in the field?'
          },
          {
            subject: 'Plural',
            affirmative: 'There are many cows in the field.',
            negative: 'There are not many cows in the field.',
            question: 'Are there many cows in the field?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos "there is" con sustantivos en singular y "there are" con sustantivos en plural para indicar que algo existe o está en un lugar.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'There is a river near my house.',
          'There are three children in the family.',
          'Is there a school in your town?',
          'There are not many doctors in rural areas.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'No confundas "there is/are" (existencia) con "it is/they are" (descripción). "There is a cow" describe que existe; "It is a cow" describe qué es ese animal específico.'
      }
    ]
  },
  {
    id: 'present-simple-negative',
    level: 'A1',
    order: 3,
    title: 'Present simple — negative',
    summary: 'Cómo formar oraciones negativas en presente simple con do not / does not.',
    lessonIds: ['gra-005'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I / You / We / They',
            affirmative: 'I work in the city.',
            negative: 'I do not work in the city.',
            question: 'Do I work in the city?'
          },
          {
            subject: 'He / She / It',
            affirmative: 'He works in the city.',
            negative: 'He does not work in the city.',
            question: 'Does he work in the city?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Para negar en presente simple usamos los auxiliares "do not" (don\'t) o "does not" (doesn\'t). El auxiliar carga el tiempo y la persona, así que el verbo principal vuelve a su forma base (sin la "s" de tercera persona).'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I do not speak English very well.',
          'She does not live in the village.',
          'They do not have animals.',
          'My brother does not work on the farm.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Error común: decir "He doesn\'t works". Recuerda que la "s" se va al auxiliar (does), no se queda en el verbo principal.'
      }
    ]
  },
  {
    id: 'articles-a-an',
    level: 'A1',
    order: 4,
    title: 'Articles — a / an',
    summary: 'Cómo elegir entre los artículos indefinidos "a" y "an" según el sonido siguiente.',
    lessonIds: ['gra-006', 'gra-007'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'a + sonido consonante',
            affirmative: 'a cow / a farmer / a river',
            negative: 'no usamos "an" antes de consonante',
            question: 'Is it a horse?'
          },
          {
            subject: 'an + sonido vocal',
            affirmative: 'an apple / an orange / an egg',
            negative: 'no usamos "a" antes de vocal',
            question: 'Is it an animal?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos "a" antes de palabras que empiezan con sonido consonante y "an" antes de palabras que empiezan con sonido vocal. Lo importante es el SONIDO, no la letra: "a university" (suena /yu/) pero "an hour" (la h es muda).'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I have a dog and an iguana.',
          'She is a teacher.',
          'My father is an engineer.',
          'There is an old tree near the river.'
        ]
      }
    ]
  },
  {
    id: 'plurals',
    level: 'A1',
    order: 5,
    title: 'Plurals — regular nouns',
    summary: 'Reglas básicas para formar el plural de los sustantivos en inglés.',
    lessonIds: ['gra-008', 'gra-009'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Regla general: + s',
            affirmative: 'cow → cows',
            negative: 'farmer → farmers',
            question: 'river → rivers'
          },
          {
            subject: 'Termina en -s, -x, -ch, -sh: + es',
            affirmative: 'box → boxes',
            negative: 'bus → buses',
            question: 'church → churches'
          },
          {
            subject: 'Termina en consonante + y: -y → -ies',
            affirmative: 'family → families',
            negative: 'city → cities',
            question: 'country → countries'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'En inglés casi siempre marcamos el plural añadiendo una "s" al final del sustantivo. Hay variaciones ortográficas según la terminación, pero la pronunciación más común sigue siendo /s/ o /z/.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I have two horses.',
          'There are many families in this community.',
          'My uncle works on three farms.',
          'We grow potatoes and tomatoes.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Algunos plurales son irregulares y debes memorizarlos: man → men, woman → women, child → children, foot → feet.'
      }
    ]
  },
  {
    id: 'possessive-adjectives',
    level: 'A1',
    order: 6,
    title: 'Possessive adjectives',
    summary: 'My, your, his, her, our, their — cómo expresar de quién es algo.',
    lessonIds: ['gra-010', 'gra-011'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I → my',
            affirmative: 'My name is Juan.',
            negative: 'My family lives here.',
            question: 'Is this my book?'
          },
          {
            subject: 'You → your',
            affirmative: 'Your dog is friendly.',
            negative: 'Your house is big.',
            question: 'Where is your farm?'
          },
          {
            subject: 'He → his / She → her',
            affirmative: 'His brother is a farmer.',
            negative: 'Her sister is a teacher.',
            question: 'Is this her bag?'
          },
          {
            subject: 'We → our / They → their',
            affirmative: 'Our community is small.',
            negative: 'Their children go to school.',
            question: 'Is this our field?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Los adjetivos posesivos van siempre antes del sustantivo y no cambian con el número del objeto poseído: "my book" y "my books" usan ambos "my".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My father works on the farm.',
          'His name is Carlos.',
          'Her dog is small.',
          'Our community has a school.',
          'Their cows are in the field.'
        ]
      }
    ]
  },
  {
    id: 'can-cant',
    level: 'A1',
    order: 7,
    title: 'Can / Can\'t — ability',
    summary: 'Cómo expresar habilidad y permiso con el verbo modal "can".',
    lessonIds: ['gra-012', 'gra-013'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Todas las personas',
            affirmative: 'I can speak Spanish.',
            negative: 'I cannot (can\'t) speak French.',
            question: 'Can I help you?'
          },
          {
            subject: 'He / She / It',
            affirmative: 'She can ride a horse.',
            negative: 'He can\'t swim.',
            question: 'Can she drive a tractor?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos "can" para expresar habilidad ("sé hacer algo") y permiso ("puedo hacer algo"). Es un verbo modal: nunca cambia de forma con la persona y el verbo principal va siempre en infinitivo sin "to".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I can milk a cow.',
          'My grandfather can speak three languages.',
          'We can\'t see the mountain from here.',
          'Can you help me with the harvest?'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Nunca digas "She cans speak" ni "He can speaks". El modal "can" no lleva "s" en tercera persona y el verbo después siempre va en forma base.'
      }
    ]
  },
  {
    id: 'prepositions-of-place',
    level: 'A1',
    order: 8,
    title: 'Prepositions of place',
    summary: 'In, on, under, next to — cómo describir dónde están las cosas.',
    lessonIds: ['gra-014', 'gra-015'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'in (dentro de)',
            affirmative: 'The cow is in the field.',
            negative: 'The book is in my bag.',
            question: 'Is the chicken in the house?'
          },
          {
            subject: 'on (sobre)',
            affirmative: 'The cat is on the table.',
            negative: 'The hat is on the chair.',
            question: 'Is the food on the plate?'
          },
          {
            subject: 'under (debajo de)',
            affirmative: 'The dog is under the tree.',
            negative: 'The ball is under the bed.',
            question: 'Is the box under the table?'
          },
          {
            subject: 'next to (al lado de)',
            affirmative: 'The school is next to the church.',
            negative: 'My house is next to the river.',
            question: 'Who is next to you?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Las preposiciones de lugar describen la posición de un objeto respecto a otro. Son fundamentales para dar y recibir indicaciones, especialmente útiles cuando alguien te pregunta dónde queda algo en tu vereda o pueblo.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My family is in the kitchen.',
          'The horse is on the hill.',
          'There is a small dog under the chair.',
          'The store is next to the park.'
        ]
      }
    ]
  },
  {
    id: 'vocabulary-farm-animals',
    level: 'A1',
    order: 9,
    title: 'Vocabulary — Farm animals',
    summary: 'Animales de la finca: cow, horse, pig, sheep, chicken.',
    lessonIds: ['voc-001', 'voc-006', 'voc-007', 'voc-008'],
    sections: [
      {
        kind: 'examples',
        title: 'Vocabulary',
        items: [
          'cow — vaca',
          'horse — caballo',
          'pig — cerdo',
          'sheep — oveja',
          'chicken — gallina',
          'goat — cabra'
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Estos animales son comunes en las fincas rurales colombianas. Aprender sus nombres te permite hablar de tu entorno y describir lo que ves cada día.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My family has two cows and three pigs.',
          'The horse is brown.',
          'There are many chickens in the yard.',
          'We have a sheep and a goat.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Cuidado: "sheep" es igual en singular y en plural. Decimos "one sheep" y "ten sheep" (¡nunca "sheeps"!).'
      }
    ]
  },
  {
    id: 'vocabulary-people-jobs',
    level: 'A1',
    order: 10,
    title: 'Vocabulary — People and jobs',
    summary: 'Profesiones y oficios: farmer, teacher, doctor, driver.',
    lessonIds: ['voc-002', 'voc-009', 'voc-010'],
    sections: [
      {
        kind: 'examples',
        title: 'Vocabulary',
        items: [
          'farmer — agricultor',
          'teacher — profesor / profesora',
          'doctor — médico / médica',
          'driver — conductor',
          'nurse — enfermero / enfermera',
          'student — estudiante'
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Hablar de profesiones es útil para presentarte a ti mismo y a otras personas. La estructura típica es: "I am a + profesión" o "She is a + profesión".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My father is a farmer.',
          'She is a teacher in the local school.',
          'The doctor lives in the next town.',
          'I want to be a nurse.'
        ]
      }
    ]
  },
  {
    id: 'vocabulary-food-crops',
    level: 'A1',
    order: 11,
    title: 'Vocabulary — Food and crops',
    summary: 'Alimentos y cultivos: corn, rice, beans, coffee.',
    lessonIds: ['voc-003', 'voc-011', 'voc-012'],
    sections: [
      {
        kind: 'examples',
        title: 'Vocabulary',
        items: [
          'corn — maíz',
          'rice — arroz',
          'beans — frijoles',
          'coffee — café',
          'potato — papa',
          'banana — banano'
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Colombia es un país agrícola con cultivos diversos. Conocer estos términos te ayuda a describir lo que se produce en tu región y comunicarte sobre comida.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'We grow corn and beans.',
          'Colombian coffee is famous.',
          'I like rice with chicken.',
          'My grandmother cooks potatoes every day.'
        ]
      }
    ]
  },
  {
    id: 'vocabulary-nature',
    level: 'A1',
    order: 12,
    title: 'Vocabulary — Nature',
    summary: 'Geografía y entorno natural: river, mountain, forest, valley.',
    lessonIds: ['voc-004', 'voc-013', 'voc-014'],
    sections: [
      {
        kind: 'examples',
        title: 'Vocabulary',
        items: [
          'river — río',
          'mountain — montaña',
          'forest — bosque',
          'valley — valle',
          'field — campo',
          'tree — árbol'
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'El paisaje colombiano combina montañas, ríos, valles y bosques. Estos sustantivos te permiten describir tu región y entender textos sobre naturaleza y geografía.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My town is near a river.',
          'The mountain is very tall.',
          'There is a small forest behind the school.',
          'We live in a green valley.'
        ]
      }
    ]
  },
  {
    id: 'vocabulary-community',
    level: 'A1',
    order: 13,
    title: 'Vocabulary — Community and family',
    summary: 'Personas cercanas: community, family, neighbor, friend.',
    lessonIds: ['voc-005', 'voc-015', 'voc-016'],
    sections: [
      {
        kind: 'examples',
        title: 'Vocabulary',
        items: [
          'community — comunidad',
          'family — familia',
          'neighbor — vecino / vecina',
          'friend — amigo / amiga',
          'parent — padre / madre',
          'sibling — hermano / hermana'
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Las comunidades rurales colombianas son muy unidas. Estos términos te permiten hablar de las personas más cercanas y describir tu red social cotidiana.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'My community is small but united.',
          'My family has five members.',
          'Our neighbors help us with the harvest.',
          'I have many friends in the village.'
        ]
      }
    ]
  },

  /* =============================================================
   * Nivel A2 — Pre-intermediate
   * ============================================================= */
  {
    id: 'past-simple-regular',
    level: 'A2',
    order: 1,
    title: 'Past simple — regular verbs',
    summary: 'Cómo formar el pasado simple con verbos regulares (-ed) para hablar de acciones terminadas.',
    lessonIds: ['gra-016', 'gra-017', 'gra-018', 'gra-019'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Afirmativa: sujeto + verbo-ed',
            affirmative: 'I worked yesterday.',
            negative: 'She walked to school.',
            question: 'They visited their grandmother.'
          },
          {
            subject: 'Negativa: did not + verbo base',
            affirmative: 'I did not work yesterday.',
            negative: 'She didn\'t walk to school.',
            question: 'They didn\'t visit their grandmother.'
          },
          {
            subject: 'Pregunta: did + sujeto + verbo base',
            affirmative: 'Did you work yesterday?',
            negative: 'Did she walk to school?',
            question: 'Did they visit their grandmother?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el past simple para hablar de acciones que empezaron y terminaron en un momento concreto del pasado. Los verbos regulares forman el pasado añadiendo "-ed" al infinitivo (work → worked). En negativas y preguntas, el auxiliar "did" carga el tiempo y el verbo principal vuelve a su forma base.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I watched a movie last night.',
          'They didn\'t arrive on time.',
          'Did you finish the report?',
          'We talked for two hours yesterday.',
          'She didn\'t answer the phone.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Cuidado con la ortografía: si el verbo termina en "-e" solo añadimos "-d" (live → lived). Si termina en consonante + y, cambia a "-ied" (study → studied). Y nunca añadas "-ed" al verbo principal en negativas o preguntas: "Did you worked?" es incorrecto.'
      }
    ]
  },
  {
    id: 'past-simple-irregular',
    level: 'A2',
    order: 2,
    title: 'Past simple — irregular verbs',
    summary: 'Verbos irregulares en pasado: go → went, see → saw, have → had.',
    lessonIds: ['gra-020', 'gra-021', 'gra-022', 'gra-023'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'go → went',
            affirmative: 'I went to the market.',
            negative: 'I didn\'t go to the market.',
            question: 'Did you go to the market?'
          },
          {
            subject: 'have → had',
            affirmative: 'She had breakfast at 7.',
            negative: 'She didn\'t have breakfast.',
            question: 'Did she have breakfast?'
          },
          {
            subject: 'see → saw',
            affirmative: 'We saw the movie.',
            negative: 'We didn\'t see the movie.',
            question: 'Did you see the movie?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Muchos verbos comunes en inglés son irregulares: no siguen la regla del "-ed" y deben memorizarse. La buena noticia: en negativas y preguntas con "did", el verbo vuelve a su forma base (went → didn\'t go, saw → didn\'t see).'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'He took the bus to work.',
          'They came to the party.',
          'I didn\'t know the answer.',
          'Did she write the email?',
          'We bought new shoes yesterday.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Los más frecuentes que debes memorizar primero: be→was/were, have→had, do→did, go→went, see→saw, get→got, make→made, take→took, come→came, know→knew, give→gave.'
      }
    ]
  },
  {
    id: 'past-continuous',
    level: 'A2',
    order: 3,
    title: 'Past continuous vs past simple',
    summary: 'Acciones en progreso en el pasado y cómo se cruzan con acciones puntuales.',
    lessonIds: ['gra-024', 'gra-025', 'gra-026', 'gra-027'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I / He / She / It → was + -ing',
            affirmative: 'I was reading.',
            negative: 'I was not (wasn\'t) reading.',
            question: 'Was I reading?'
          },
          {
            subject: 'You / We / They → were + -ing',
            affirmative: 'They were studying.',
            negative: 'They weren\'t studying.',
            question: 'Were they studying?'
          },
          {
            subject: 'Combinado con past simple',
            affirmative: 'I was cooking when she arrived.',
            negative: 'I wasn\'t cooking when she arrived.',
            question: 'What were you doing when she arrived?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'El past continuous describe una acción que estaba en progreso en un momento del pasado. Se usa mucho con el past simple para mostrar una acción larga interrumpida por una corta: "I was walking home WHEN it started to rain". El past continuous = la acción larga; el past simple = la interrupción.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'At 8 p.m. I was watching TV.',
          'While she was studying, the lights went out.',
          'They were playing football when it began to rain.',
          'What were you doing yesterday at this time?',
          'He wasn\'t listening to me.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'No usamos el past continuous con verbos de estado (know, like, want, believe, understand). Decimos "I knew her" y no "I was knowing her".'
      }
    ]
  },
  {
    id: 'present-continuous',
    level: 'A2',
    order: 4,
    title: 'Present continuous vs present simple',
    summary: 'Diferencia entre lo que pasa ahora mismo y lo que pasa habitualmente.',
    lessonIds: ['gra-028', 'gra-029', 'gra-030', 'gra-031'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Present continuous: be + -ing',
            affirmative: 'I am working now.',
            negative: 'She isn\'t working now.',
            question: 'Are they working now?'
          },
          {
            subject: 'Present simple: verbo base / -s',
            affirmative: 'I work every day.',
            negative: 'She doesn\'t work on Sundays.',
            question: 'Do they work on weekends?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'El present simple describe rutinas, hábitos y verdades generales ("I drink coffee every morning"). El present continuous describe lo que pasa AHORA o alrededor de ahora ("I am drinking coffee right now"). Marcadores típicos: simple → always, usually, every day; continuous → now, at the moment, today.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I usually take the bus, but today I am walking.',
          'She works as a teacher.',
          'Look! It\'s raining.',
          'They don\'t live here anymore.',
          'What are you doing this weekend?'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Verbos de estado (love, hate, want, need, know, understand) normalmente NO van en continuo, aunque se refieran al momento actual: "I want a coffee" (no "I am wanting a coffee").'
      }
    ]
  },
  {
    id: 'comparatives',
    level: 'A2',
    order: 5,
    title: 'Comparative adjectives',
    summary: 'Cómo comparar dos cosas: bigger, more interesting, better.',
    lessonIds: ['gra-032', 'gra-033', 'gra-034', 'gra-035'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Adjetivos cortos: + -er',
            affirmative: 'tall → taller',
            negative: 'fast → faster',
            question: 'cheap → cheaper'
          },
          {
            subject: 'Termina en -y: -y → -ier',
            affirmative: 'happy → happier',
            negative: 'easy → easier',
            question: 'busy → busier'
          },
          {
            subject: 'Adjetivos largos: more + adjetivo',
            affirmative: 'expensive → more expensive',
            negative: 'difficult → more difficult',
            question: 'beautiful → more beautiful'
          },
          {
            subject: 'Irregulares',
            affirmative: 'good → better',
            negative: 'bad → worse',
            question: 'far → farther / further'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Para comparar dos cosas usamos "comparativo + than": "My house is bigger than yours". Adjetivos de una sílaba (o dos terminadas en -y) llevan -er; los más largos llevan "more". Algunos comunes son irregulares y hay que memorizarlos.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'This city is bigger than my hometown.',
          'Math is more difficult than English for me.',
          'She is happier now than last year.',
          'His new car is better than the old one.',
          'Today is colder than yesterday.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Error muy común: "more better" o "more bigger". El comparativo NUNCA se duplica. Decimos "better" o "bigger", nunca con "more" delante.'
      }
    ]
  },
  {
    id: 'superlatives',
    level: 'A2',
    order: 6,
    title: 'Superlative adjectives',
    summary: 'El más, el mejor: the tallest, the most interesting, the best.',
    lessonIds: ['gra-036', 'gra-037', 'gra-038', 'gra-039'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Adjetivos cortos: the + -est',
            affirmative: 'tall → the tallest',
            negative: 'fast → the fastest',
            question: 'old → the oldest'
          },
          {
            subject: 'Termina en -y: -y → -iest',
            affirmative: 'happy → the happiest',
            negative: 'easy → the easiest',
            question: 'busy → the busiest'
          },
          {
            subject: 'Adjetivos largos: the most + adjetivo',
            affirmative: 'expensive → the most expensive',
            negative: 'difficult → the most difficult',
            question: 'interesting → the most interesting'
          },
          {
            subject: 'Irregulares',
            affirmative: 'good → the best',
            negative: 'bad → the worst',
            question: 'far → the farthest'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el superlativo para destacar a uno por encima de todos los demás del grupo: "She is the tallest student in the class". Casi siempre lleva el artículo "the" delante.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'Mount Everest is the highest mountain in the world.',
          'This is the most expensive restaurant in town.',
          'He is the best player on the team.',
          'July is the hottest month here.',
          'That was the worst day of my life.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Después de un superlativo solemos usar "in" para lugares y grupos ("the best in the world", "the tallest in the class"), no "of": "the tallest of the class" suena raro.'
      }
    ]
  },
  {
    id: 'future-going-to',
    level: 'A2',
    order: 7,
    title: 'Future with "going to"',
    summary: 'Hablar de planes y predicciones basadas en evidencia.',
    lessonIds: ['gra-040', 'gra-041', 'gra-042', 'gra-043'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I → am going to + verbo',
            affirmative: 'I am going to study tonight.',
            negative: 'I am not going to study tonight.',
            question: 'Am I going to study tonight?'
          },
          {
            subject: 'He / She / It → is going to',
            affirmative: 'She is going to travel.',
            negative: 'She isn\'t going to travel.',
            question: 'Is she going to travel?'
          },
          {
            subject: 'You / We / They → are going to',
            affirmative: 'They are going to move.',
            negative: 'They aren\'t going to move.',
            question: 'Are they going to move?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos "going to" para dos cosas: (1) planes ya decididos antes del momento de hablar — "I am going to visit my parents next weekend"; (2) predicciones basadas en evidencia presente — "Look at those clouds! It is going to rain".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'We are going to have a meeting tomorrow.',
          'She is going to be a doctor.',
          'They aren\'t going to come to the party.',
          'Are you going to buy that car?',
          'It\'s 9:55 — the class is going to start.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'No confundas "going to" con el verbo "go": "I am going to the store" (movimiento físico) ≠ "I am going to study" (futuro). Cuando "going to" va seguido de un verbo en infinitivo, es futuro.'
      }
    ]
  },

  /* =============================================================
   * Nivel B1 — Intermediate
   * ============================================================= */
  {
    id: 'present-perfect',
    level: 'B1',
    order: 1,
    title: 'Present perfect simple',
    summary: 'Acciones del pasado con conexión al presente: have/has + participio.',
    lessonIds: ['gra-044', 'gra-045', 'gra-046', 'gra-047'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'I / You / We / They → have + p.p.',
            affirmative: 'I have lived here for ten years.',
            negative: 'I haven\'t lived here for long.',
            question: 'Have you lived here long?'
          },
          {
            subject: 'He / She / It → has + p.p.',
            affirmative: 'She has visited Paris.',
            negative: 'She hasn\'t visited Paris.',
            question: 'Has she visited Paris?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'El present perfect describe: (1) experiencias de vida sin importar cuándo — "I have been to Japan"; (2) acciones que empezaron en el pasado y siguen ahora — "She has worked here since 2020"; (3) acciones recientes con efecto en el presente — "I have lost my keys" (y todavía no las encuentro). Marcadores típicos: ever, never, already, yet, just, for, since.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'Have you ever tried sushi?',
          'I have just finished my homework.',
          'They haven\'t arrived yet.',
          'She has worked here since January.',
          'We have known each other for ten years.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Usa "for" con un periodo de tiempo (for two years, for a week) y "since" con un punto en el tiempo (since 2020, since Monday). No mezcles: "since two years" es incorrecto.'
      }
    ]
  },
  {
    id: 'present-perfect-vs-past',
    level: 'B1',
    order: 2,
    title: 'Present perfect vs past simple',
    summary: 'Cuándo usar "I have done" y cuándo "I did".',
    lessonIds: ['gra-048', 'gra-049', 'gra-050', 'gra-051'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Present perfect (sin tiempo definido)',
            affirmative: 'I have visited Paris.',
            negative: 'I haven\'t visited Paris.',
            question: 'Have you visited Paris?'
          },
          {
            subject: 'Past simple (con tiempo definido)',
            affirmative: 'I visited Paris in 2019.',
            negative: 'I didn\'t visit Paris last year.',
            question: 'When did you visit Paris?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Si el momento NO está especificado o el periodo NO ha terminado, usa present perfect ("I have seen that film"). Si el momento SÍ está especificado o el periodo ya terminó, usa past simple ("I saw it last week"). Marcadores que exigen past simple: yesterday, last week, in 2010, ago, when.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I have read that book. (no importa cuándo)',
          'I read that book last month. (cuándo: last month)',
          'She has lived in Bogotá. (en algún momento)',
          'She lived in Bogotá in 2018. (momento específico)',
          'Have you ever flown in a plane? — Yes, I flew last year.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Una pregunta de cabecera: ¿la acción tiene una fecha o tiempo terminado? Sí → past simple. No → present perfect. "Yesterday" siempre es past simple, jamás present perfect.'
      }
    ]
  },
  {
    id: 'first-conditional',
    level: 'B1',
    order: 3,
    title: 'First conditional',
    summary: 'Hablar de situaciones futuras posibles: if + present, will + base.',
    lessonIds: ['gra-052', 'gra-053', 'gra-054', 'gra-055'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Estructura',
            affirmative: 'If + present simple, will + base',
            negative: 'If you study, you will pass.',
            question: 'If it rains, we will stay home.'
          },
          {
            subject: 'Orden invertido',
            affirmative: 'will + base + if + present',
            negative: 'You will pass if you study.',
            question: 'We will stay home if it rains.'
          },
          {
            subject: 'En negativa',
            affirmative: 'If you don\'t hurry, you\'ll miss the bus.',
            negative: 'If she doesn\'t come, we\'ll start without her.',
            question: 'What will happen if it doesn\'t rain?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el first conditional para situaciones futuras que son reales y posibles: una condición (if-clause) y un resultado probable (main clause). La cláusula con "if" va en presente simple aunque hablemos del futuro; la otra lleva "will".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'If I have time, I will call you.',
          'If she doesn\'t study, she won\'t pass the exam.',
          'We will go to the beach if the weather is good.',
          'If you mix red and blue, you get purple. (zero conditional, hecho)',
          'If it rains tomorrow, we will cancel the picnic.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Error frecuente: "If I will see her, I will tell her". El "will" NO va en la cláusula con "if". Forma correcta: "If I see her, I will tell her".'
      }
    ]
  },
  {
    id: 'modals-obligation',
    level: 'B1',
    order: 4,
    title: 'Must / Have to / Should',
    summary: 'Obligación, necesidad y consejo: tres modales con matices distintos.',
    lessonIds: ['gra-056', 'gra-057', 'gra-058', 'gra-059'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'must / mustn\'t',
            affirmative: 'You must wear a helmet.',
            negative: 'You mustn\'t smoke here.',
            question: 'Must I leave now?'
          },
          {
            subject: 'have to / don\'t have to',
            affirmative: 'I have to work tomorrow.',
            negative: 'I don\'t have to work on Sundays.',
            question: 'Do you have to work tomorrow?'
          },
          {
            subject: 'should / shouldn\'t',
            affirmative: 'You should rest more.',
            negative: 'You shouldn\'t eat so much sugar.',
            question: 'Should I tell her the truth?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: '"Must" = obligación interna o muy fuerte (yo decido o es regla). "Have to" = obligación externa (alguien o las normas me obligan). "Should" = consejo o recomendación. Atención al matiz: "mustn\'t" = está prohibido; "don\'t have to" = no es necesario (puedes hacerlo o no).'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'You mustn\'t use your phone on the plane. (prohibido)',
          'You don\'t have to come if you don\'t want. (opcional)',
          'I have to wear a uniform at work. (la empresa lo exige)',
          'You should drink more water. (consejo)',
          'Students must submit the assignment by Friday.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'En pasado y futuro, "must" no funciona: usa "had to" / "will have to". Decimos "I had to leave early" y nunca "I musted leave".'
      }
    ]
  },
  {
    id: 'will-vs-going-to',
    level: 'B1',
    order: 5,
    title: 'Will vs going to',
    summary: 'Decisiones espontáneas y predicciones (will) vs planes y evidencia (going to).',
    lessonIds: ['gra-060', 'gra-061', 'gra-062', 'gra-063'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'will + verbo base',
            affirmative: 'I will help you.',
            negative: 'I won\'t help you.',
            question: 'Will you help me?'
          },
          {
            subject: 'be going to + verbo base',
            affirmative: 'I am going to study tonight.',
            negative: 'I\'m not going to study.',
            question: 'Are you going to study?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usa "will" para: (1) decisiones tomadas en el momento de hablar — "OK, I\'ll have the chicken"; (2) promesas y ofrecimientos — "I will help you"; (3) predicciones basadas en opinión — "I think it will rain". Usa "going to" para: (1) planes decididos previamente — "I am going to visit my mother"; (2) predicciones basadas en evidencia visible — "Look at the sky, it\'s going to rain".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          '"The phone is ringing." — "I\'ll get it." (decisión espontánea)',
          'I\'m going to get a haircut on Saturday. (plan)',
          'I think she will win the election. (opinión)',
          'Watch out! You\'re going to fall! (evidencia)',
          'I promise I won\'t tell anyone.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Para predicciones meteorológicas con evidencia (nubes, viento), prefiere "going to". Para predicciones de opinión sin evidencia clara, "will" es más natural.'
      }
    ]
  },
  {
    id: 'used-to',
    level: 'B1',
    order: 6,
    title: 'Used to',
    summary: 'Hábitos y estados del pasado que ya no existen.',
    lessonIds: ['gra-064', 'gra-065', 'gra-066', 'gra-067'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Afirmativa: used to + base',
            affirmative: 'I used to smoke.',
            negative: 'She used to live in London.',
            question: 'They used to play together.'
          },
          {
            subject: 'Negativa: didn\'t use to',
            affirmative: 'I didn\'t use to like coffee.',
            negative: 'He didn\'t use to study much.',
            question: 'We didn\'t use to argue.'
          },
          {
            subject: 'Pregunta: did + use to',
            affirmative: 'Did you use to smoke?',
            negative: 'Did she use to live in London?',
            question: 'Did they use to play together?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos "used to" para hablar de hábitos o estados pasados que ya no son ciertos en el presente. Funciona como contraste implícito: "I used to smoke" implica "ahora no fumo". Solo existe en pasado — para hábitos presentes usa el present simple con "usually".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I used to play soccer when I was young.',
          'She didn\'t use to like vegetables, but now she does.',
          'Did you use to live in this neighborhood?',
          'There used to be a movie theater on this street.',
          'We used to visit our grandparents every summer.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'En negativa y pregunta, la "d" desaparece: "didn\'t USE to" (no "didn\'t USED to"). Es el error más común con esta estructura.'
      }
    ]
  },
  {
    id: 'relative-clauses',
    level: 'B1',
    order: 7,
    title: 'Defining relative clauses',
    summary: 'Conectar oraciones con who, which, that para dar información esencial.',
    lessonIds: ['gra-068', 'gra-069', 'gra-070', 'gra-071'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'who → personas',
            affirmative: 'The man who called you is my brother.',
            negative: 'I know the woman who lives next door.',
            question: 'Is she the teacher who teaches English?'
          },
          {
            subject: 'which → cosas / animales',
            affirmative: 'The book which I bought was expensive.',
            negative: 'The car which she drives is new.',
            question: 'Where is the key which opens this door?'
          },
          {
            subject: 'that → personas o cosas',
            affirmative: 'The friend that helped me is here.',
            negative: 'The phone that I lost was new.',
            question: 'This is the song that I love.'
          },
          {
            subject: 'where → lugares',
            affirmative: 'This is the house where I grew up.',
            negative: 'I miss the city where we met.',
            question: 'Is this the restaurant where we ate?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Las relative clauses definidas dan información esencial sobre el sustantivo: sin esa información, no sabríamos de cuál hablamos. NO van entre comas. "Who" para personas, "which" para cosas, "that" sirve para ambos en cláusulas definidas.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'The doctor who treated me was very kind.',
          'I love the cake which you made yesterday.',
          'That\'s the man that I told you about.',
          'The hotel where we stayed was beautiful.',
          'Do you remember the song that we danced to?'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Cuando el pronombre relativo es OBJETO de la cláusula, podemos omitirlo: "The book (which/that) I bought" — todas son correctas. Pero si es SUJETO, no se omite: "The man who called" (no se puede quitar "who").'
      }
    ]
  },

  /* =============================================================
   * Nivel B2 — Upper-intermediate
   * ============================================================= */
  {
    id: 'past-perfect',
    level: 'B2',
    order: 1,
    title: 'Past perfect simple',
    summary: 'El pasado del pasado: had + participio.',
    lessonIds: ['gra-072', 'gra-073', 'gra-074', 'gra-075'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Todas las personas: had + p.p.',
            affirmative: 'I had finished before she arrived.',
            negative: 'I hadn\'t finished when she arrived.',
            question: 'Had you finished by then?'
          },
          {
            subject: 'Combinado con past simple',
            affirmative: 'When I got home, she had already left.',
            negative: 'She hadn\'t eaten before the meeting started.',
            question: 'Had he called before you left?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el past perfect para describir una acción que ocurrió ANTES de otra acción en el pasado. Si tenemos dos eventos pasados, el más antiguo va en past perfect y el más reciente en past simple. Marcadores típicos: already, just, never, by the time, before, after, when.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'When we arrived, the movie had already started.',
          'She had never seen the ocean before that trip.',
          'By the time he called, I had finished my work.',
          'I realized I had forgotten my wallet.',
          'They had been friends for years before they got married.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Si los eventos suceden en el orden natural y eso queda claro por el contexto, NO necesitas past perfect: "She got up, had breakfast and left" — todo en past simple basta.'
      }
    ]
  },
  {
    id: 'second-conditional',
    level: 'B2',
    order: 2,
    title: 'Second conditional',
    summary: 'Situaciones hipotéticas o imaginarias: if + past, would + base.',
    lessonIds: ['gra-076', 'gra-077', 'gra-078', 'gra-079'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Estructura',
            affirmative: 'If + past simple, would + base',
            negative: 'If I had money, I would travel.',
            question: 'If I were you, I would tell her.'
          },
          {
            subject: 'En pregunta',
            affirmative: 'What would you do if you won the lottery?',
            negative: 'Where would she live if she could choose?',
            question: 'How would you react if I told you?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el second conditional para situaciones imaginarias, irreales o muy improbables en el presente o futuro. La cláusula con "if" va en past simple aunque hablemos del presente; la otra lleva "would". Es muy útil para dar consejos: "If I were you...".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'If I had a million dollars, I would buy a house.',
          'She would be happier if she changed jobs.',
          'If we lived closer, we would visit more often.',
          'What would you do if you saw a ghost?',
          'I wouldn\'t do that if I were you.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'En segundas condicionales, con "I" y "he/she/it" se prefiere "were" en lugar de "was" en estilo cuidado: "If I WERE rich..." es más correcto que "If I was rich...", aunque ambos se oyen en habla informal.'
      }
    ]
  },
  {
    id: 'third-conditional',
    level: 'B2',
    order: 3,
    title: 'Third conditional',
    summary: 'Lamentos y arrepentimientos: cómo habría sido el pasado.',
    lessonIds: ['gra-080', 'gra-081', 'gra-082', 'gra-083'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Estructura',
            affirmative: 'If + had + p.p., would have + p.p.',
            negative: 'If I had studied, I would have passed.',
            question: 'If she had called, I would have answered.'
          },
          {
            subject: 'Negativa',
            affirmative: 'If I hadn\'t been late, I wouldn\'t have missed it.',
            negative: 'If she hadn\'t helped, we wouldn\'t have finished.',
            question: 'If they hadn\'t left, would they have seen us?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos el third conditional para hablar de situaciones imaginarias en el pasado: cosas que NO pasaron y especulamos sobre cómo habrían sido. Suele expresar arrepentimiento o crítica: "If I had known, I would have helped" implica que no lo supe y no ayudé.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'If I had studied harder, I would have got a better grade.',
          'She wouldn\'t have missed the train if she had left earlier.',
          'If you had told me, I would have helped you.',
          'What would you have done if you had been there?',
          'They would have won if they had practiced more.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Es la condicional más larga y compleja en español también. Truco: si en español dirías "habría hecho... si hubiera...", en inglés es third conditional ("would have done... if I had...").'
      }
    ]
  },
  {
    id: 'passive-voice',
    level: 'B2',
    order: 4,
    title: 'Passive voice (present and past)',
    summary: 'Cuando el foco está en la acción, no en quien la hace.',
    lessonIds: ['gra-084', 'gra-085', 'gra-086', 'gra-087'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'Present passive: am/is/are + p.p.',
            affirmative: 'English is spoken here.',
            negative: 'These cars aren\'t made in Japan.',
            question: 'Is the report written every week?'
          },
          {
            subject: 'Past passive: was/were + p.p.',
            affirmative: 'The book was written in 1990.',
            negative: 'The doors weren\'t locked.',
            question: 'Was the package delivered?'
          },
          {
            subject: 'Con agente: by + autor',
            affirmative: 'The novel was written by García Márquez.',
            negative: 'It wasn\'t written by him.',
            question: 'Was it written by him?'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos la voz pasiva cuando: (1) el agente es desconocido o no importa — "My bike was stolen"; (2) queremos enfatizar la acción o el objeto — "The Mona Lisa was painted by Leonardo"; (3) es típico en estilo formal y noticias — "Three people were arrested last night".'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'The bridge was built in 1985.',
          'Coffee is grown in Colombia.',
          'My phone was stolen yesterday.',
          'Are these products tested before sale?',
          'The letters were sent by my grandmother.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Solo los verbos transitivos (los que llevan objeto directo) pueden ir en pasiva. "He died" no se puede pasivar; "He killed someone" sí ("Someone was killed").'
      }
    ]
  },
  {
    id: 'reported-speech',
    level: 'B2',
    order: 5,
    title: 'Reported speech',
    summary: 'Cómo contar lo que alguien dijo: cambios de tiempo verbal y pronombres.',
    lessonIds: ['gra-088', 'gra-089', 'gra-090', 'gra-091'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'present → past',
            affirmative: 'Direct: "I am tired."',
            negative: 'Reported: She said she was tired.',
            question: 'present continuous → past continuous'
          },
          {
            subject: 'past simple → past perfect',
            affirmative: 'Direct: "I saw him yesterday."',
            negative: 'Reported: He said he had seen him the day before.',
            question: 'present perfect → past perfect'
          },
          {
            subject: 'will → would',
            affirmative: 'Direct: "I will help you."',
            negative: 'Reported: She said she would help me.',
            question: 'can → could / must → had to'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Cuando reportamos lo que alguien dijo, normalmente "retrocedemos" un tiempo verbal: presente → pasado, pasado → past perfect, will → would. También cambian pronombres ("I" → "he/she") y referencias temporales ("yesterday" → "the day before", "tomorrow" → "the next day", "here" → "there").'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'He said (that) he was hungry.',
          'She told me she had finished the project.',
          'They said they would call us later.',
          'Maria said she didn\'t want to go.',
          'My boss told me I had to work late that day.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: '"Say" no lleva objeto directo de persona ("She said TO ME..."), "tell" sí ("She told me..."). Y si lo reportado sigue siendo cierto en el momento de hablar, NO siempre hay que retroceder el tiempo: "She said she lives in Madrid" es válido si todavía vive ahí.'
      }
    ]
  },
  {
    id: 'modals-deduction',
    level: 'B2',
    order: 6,
    title: 'Modals of deduction',
    summary: 'Especular y deducir: must, might, can\'t.',
    lessonIds: ['gra-092', 'gra-093', 'gra-094', 'gra-095'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'must → casi seguro que SÍ',
            affirmative: 'She must be tired.',
            negative: 'It must be expensive.',
            question: 'They must know the answer.'
          },
          {
            subject: 'might / may / could → quizás',
            affirmative: 'He might be at home.',
            negative: 'She may not come.',
            question: 'It could rain later.'
          },
          {
            subject: 'can\'t → casi seguro que NO',
            affirmative: 'That can\'t be true.',
            negative: 'She can\'t be his mother.',
            question: 'It can\'t be that easy.'
          },
          {
            subject: 'En el pasado: modal + have + p.p.',
            affirmative: 'She must have left.',
            negative: 'He might have forgotten.',
            question: 'They can\'t have arrived already.'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: 'Usamos modales de deducción para expresar grados de certeza basados en la evidencia. "Must" = seguro al 95% que sí; "might/may/could" = posibilidad media; "can\'t" = seguro al 95% que no. Para deducciones del pasado, añadimos "have + participio" después del modal.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'The lights are on. They must be home.',
          'I don\'t know where my keys are. They might be in the kitchen.',
          'You can\'t be serious!',
          'He didn\'t answer his phone. He must have been busy.',
          'She might have missed the bus.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Para negar una deducción de "must" no usamos "mustn\'t" (eso significa prohibición). El opuesto lógico de "must be" es "can\'t be": "He must be the manager" / "He can\'t be the manager".'
      }
    ]
  },
  {
    id: 'wish-if-only',
    level: 'B2',
    order: 7,
    title: 'Wish / If only',
    summary: 'Expresar deseos imposibles o lamentos en presente y pasado.',
    lessonIds: ['gra-096', 'gra-097', 'gra-098', 'gra-099'],
    sections: [
      {
        kind: 'forms',
        title: 'Form',
        rows: [
          {
            subject: 'wish + past simple → presente',
            affirmative: 'I wish I had more time.',
            negative: 'I wish I knew the answer.',
            question: 'I wish she was here.'
          },
          {
            subject: 'wish + past perfect → pasado',
            affirmative: 'I wish I had studied harder.',
            negative: 'I wish I hadn\'t said that.',
            question: 'She wishes she had told the truth.'
          },
          {
            subject: 'wish + would → cambio en otros',
            affirmative: 'I wish you would listen to me.',
            negative: 'I wish it would stop raining.',
            question: 'I wish they wouldn\'t shout.'
          }
        ]
      },
      {
        kind: 'use',
        title: 'Use',
        body: '"Wish" expresa deseos contrarios a la realidad. Para situaciones IMPOSIBLES en el presente, usamos pasado simple: "I wish I had a car" (no lo tengo). Para arrepentimientos del PASADO, past perfect: "I wish I had studied" (no estudié). Para criticar comportamientos AJENOS, "would": "I wish he would call". "If only" se usa de la misma forma con un matiz más enfático.'
      },
      {
        kind: 'examples',
        title: 'Examples',
        items: [
          'I wish I could speak Japanese.',
          'She wishes she lived closer to her family.',
          'I wish I hadn\'t eaten so much.',
          'If only I had known earlier!',
          'I wish you wouldn\'t interrupt me.'
        ]
      },
      {
        kind: 'note',
        title: 'Tip',
        body: 'Después de "wish" no se usa "would" para uno mismo: "I wish I would..." suena raro. Para tu propio caso usa pasado simple: "I wish I exercised more" (no "I wish I would exercise more").'
      }
    ]
  }
];
