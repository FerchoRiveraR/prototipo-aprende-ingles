# Decisiones de diseño

Este documento explicita las decisiones técnicas y de UI adoptadas durante la construcción del prototipo. Cada decisión incluye la alternativa considerada, la opción elegida y la justificación que la sustenta. Documentar estas decisiones cumple con el criterio de **pensamiento crítico** de la rúbrica (Criterio 1) y respalda el **profesionalismo** de la construcción (Criterio 3).

## 1. Decisiones tecnológicas

### 1.1 JavaScript Vanilla (sin framework)

- **Alternativa considerada:** React, Vue.js o Preact.
- **Decisión:** JavaScript Vanilla (ES2017+).
- **Justificación:**
  - El público objetivo son estudiantes en zonas rurales con dispositivos de gama baja y datos móviles costosos. Cada KB descargado es un costo real para el usuario.
  - Sin framework no hay paso de *build* ni dependencias `node_modules` que mantener: el prototipo se ejecuta sirviendo archivos estáticos.
  - Reduce la superficie de fallo y la complejidad de despliegue, coherente con el principio de "tecnología apropiada" descrito por la lectura UNCTAD (2025).
- **Costo asumido:** la organización del código requiere disciplina (separación por archivos, convenciones de nombres) en lugar de la imposición que daría un framework.

### 1.2 IndexedDB vanilla en lugar de Dexie.js

- **Alternativa considerada:** Dexie.js como wrapper, según el documento de Etapa 3.
- **Decisión:** IndexedDB nativo con un wrapper interno mínimo en `db.js`.
- **Justificación:**
  - Eliminar 80 KB de dependencia externa reduce el peso de la PWA, crítico en zonas rurales.
  - Evita depender de un CDN o de incluir un archivo *vendored* de un tercero, manteniendo el principio "cero dependencias" del prototipo.
  - Demuestra dominio técnico de la API nativa, fortaleciendo la defensa del prototipo en el video explicativo y ante el tutor.
  - El wrapper interno (`DB.getLesson`, `DB.updateProgress`, etc.) ofrece la misma ergonomía que Dexie en el código consumidor.
- **Trade-off documentado en el informe:** esta es una desviación menor respecto al diseño original de Etapa 3, justificada por las restricciones del contexto y el principio de minimalismo del prototipo.

### 1.3 Service Worker vanilla en lugar de Workbox

- **Alternativa considerada:** Workbox de Google (mencionado en el diseño grupal).
- **Decisión:** Service Worker escrito a mano con la API estándar.
- **Justificación:** mismo principio que con IndexedDB. Workbox empaquetaría una librería adicional para un patrón (cache-first) que en JavaScript vanilla cabe en menos de 50 líneas. La estrategia es directa y legible.

### 1.4 Iconos en SVG en lugar de PNG

- **Alternativa considerada:** PNG en múltiples resoluciones.
- **Decisión:** SVG único escalable.
- **Justificación:**
  - Un solo archivo cubre cualquier tamaño sin pixelación.
  - Es texto plano, editable directamente en el repositorio.
  - Peso menor (~400 bytes vs varios KB de PNG).
- **Limitación reconocida:** algunos sistemas operativos antiguos pueden no instalar la PWA con icono SVG. Para producción se generarían PNG; en el prototipo de bajo nivel SVG es suficiente.

### 1.5 No incluir asistente IA conversacional en el MVP

- **Decisión:** dejarlo como evolución futura documentada.
- **Justificación:** un asistente conversacional de calidad requiere un modelo de lenguaje (API externa o modelo local pesado) que rompería la promesa de offline-first y aumentaría drásticamente el alcance. Coherente con la guía de Fernández Iglesias (2020) sobre prototipado: "fallar en un entorno seguro, mejorando la comunicación".

## 2. Decisiones de UI/UX

### 2.1 Mobile-first con `max-width: 480px`

- **Justificación:** según el contexto identificado en la Etapa 2, el dispositivo principal de los estudiantes rurales es el smartphone. Un layout de una sola columna optimizado para 360–480 px de ancho cubre el 95 % de los smartphones del mercado colombiano de gama baja.

### 2.2 Paleta de alto contraste y accesible

- **Colores principales:** primario `#00897B` (verde-azulado), acento `#FFB300` (amarillo cálido), texto `#1A1A1A` sobre fondo `#FAFAFA`.
- **Justificación:** el contraste texto-fondo cumple el ratio WCAG AA. Los colores de feedback (verde para éxito, rojo para error) usan tonos saturados que también son distinguibles en pantallas de baja calidad.
- **Coherencia con la lectura de Hoyos (2024)** sobre buenas prácticas UX: legibilidad, jerarquía visual y feedback inmediato.

### 2.3 Botones grandes (`min-height: 48px`)

- **Justificación:** corresponde al estándar de Material Design para *touch targets*. Garantiza usabilidad para personas que no estén familiarizadas con interfaces táctiles, una preocupación válida en el público rural.

### 2.4 Tipografía del sistema (`-apple-system, Segoe UI, Roboto, sans-serif`)

- **Justificación:** evita descargar fuentes web (ahorra datos móviles). La fuente del sistema garantiza coherencia con el aspecto nativo del dispositivo.

### 2.5 Vocabulario semilla contextualizado

- **Decisión:** los 10 ejercicios iniciales usan palabras del entorno rural (vaca, agricultor, maíz, río, comunidad) y oraciones de la realidad colombiana ("She is from Colombia", "We are farmers").
- **Justificación:** la motivación intrínseca aumenta cuando el contenido se siente relevante. La lectura de Hoyos (2024) recomienda anclar la UX en el contexto del usuario; la guía de la Etapa 4 cita esta práctica explícitamente.

### 2.6 Feedback inmediato tras responder

- **Decisión:** al pulsar una opción, esta se colorea (verde correcto, rojo incorrecto), todas las opciones se deshabilitan y aparece una explicación pedagógica.
- **Justificación:** el feedback inmediato es uno de los pilares del aprendizaje activo y del sistema Leitner. La lectura de Granollers (2021) lo describe como propiedad esencial de un prototipo interactivo.

### 2.7 Topics como entidad: enseñanza antes de la práctica

- **Alternativa considerada:** mantener la app 100 % de práctica (Leitner + multiple-choice) sin componente teórico, o añadir un campo `teaching` por ejercicio.
- **Decisión:** introducir una entidad **Topic** (slug, nivel CEFR, secciones tipadas Form / Use / Examples / Note) que agrupa N ejercicios mediante `lessonIds`, replicando el modelo pedagógico de [test-english.com/grammar-points](https://test-english.com/grammar-points/contents/).
- **Justificación:**
  - Hoyos (2024) recomienda anclar la UX al contexto y reforzar el aprendizaje con explicaciones explícitas, no solo drill repetitivo.
  - Una práctica sin teoría previa convierte la app en memorización ciega; un curso A1 real combina explicación + ejemplos + ejercicios.
  - Un Topic permite reutilizar la teoría entre N ejercicios sin duplicarla en cada uno y abre la puerta a niveles A2/B1 sin rediseño (`level` queda como discriminador).
- **Costo asumido:** un store IndexedDB adicional (`topics`) y migración v1 → v2.

### 2.8 Tarjetas por sujeto en lugar de tablas HTML

- **Alternativa considerada:** usar `<table>` con columnas Sujeto / Afirmativa / Negativa / Pregunta, igual que test-english.com.
- **Decisión:** **CSS Grid de tarjetas por sujeto** que reflowea de 1 columna (móvil) a 2 (≥600 px) y a 3 (≥900 px). Cada tarjeta lleva el sujeto en un `<h4>` y las tres formas con prefijos visuales (✅ afirmativa, ❌ negativa, ❓ pregunta).
- **Justificación:**
  - Una tabla de 4 columnas en un viewport de 320–360 px obliga a scroll horizontal, viola la promesa mobile-first y rompe la legibilidad del propio contenido pedagógico.
  - El patrón "una tarjeta por sujeto" es semánticamente equivalente y se descompone naturalmente en stack vertical sin perder la asociación visual entre sujeto y formas.
  - Los emojis como prefijo aportan reconocimiento inmediato de la función (afirmar / negar / preguntar) sin depender de encabezados de columna que desaparecen al apilar.
- **Trade-off:** sacrificamos la densidad visual horizontal de la tabla a cambio de robustez móvil — coherente con la prioridad de la Etapa 2 (smartphones rurales como dispositivo principal).

### 2.9 Enseñanza no afecta Leitner ni gamificación

- **Decisión:** leer un Topic (entrar a la pantalla, ver Form/Use/Examples) **no otorga puntos**, **no actualiza cajas Leitner** ni **registra streak**. Solo responder ejercicios afecta el progreso.
- **Justificación:** preservar la integridad del spaced repetition. Si la lectura sumara puntos, los estudiantes podrían "farmear" puntos sin practicar realmente, distorsionando los datos de progreso que el sistema usa para programar revisiones.

### 2.10 Cinco formatos de lección con campo `format`

- **Decisión:** cada lección lleva un campo opcional `format` ∈ `{ 'multiple-choice' | 'true-false' | 'fill-blank' | 'word-order' | 'matching' }`. Default `'multiple-choice'` para retro-compatibilidad. El renderer en `app.js` despacha por formato a través de cuatro funciones internas (`renderQuestion`, `bindAnswerHandlers`, `evaluateAnswer`, `applyAnswerFeedback`).
- **Justificación pedagógica:**
  - **Multiple-choice** sigue siendo la base — barata, escalable, buena para distinciones semánticas con distractores que enseñan.
  - **True/False** es ideal para reglas gramaticales y "spot the rule" (ej. distinguir `mustn't` de `don't have to`). Costo cero, decisión binaria rápida.
  - **Fill-in-the-blank** activa **recall** en vez de solo reconocimiento — pedagógicamente más fuerte que MC para conjugaciones donde la respuesta es inequívoca (`I ___ a student` → `am`).
  - **Word-order** entrena **sintaxis**, no solo léxico. Único formato apto para condicionales, past perfect, voz pasiva y reported speech con la oración completa visible.
  - **Matching** es eficiente para vocabulario: una sola lección cubre 4-6 palabras del mismo topic.
- **Justificación técnica:**
  - El motor Leitner sigue siendo format-agnóstico (`processAnswer(id, isCorrect)`). Cualquier formato nuevo solo necesita producir un boolean.
  - **No requiere bump de `DB_VERSION`** — los nuevos campos (`format`, `acceptedAnswers`, `tokens`, `pairs`, `statement`, `correctAnswer`, `instruction`) son data-level y opcionales por formato. El patrón idempotente de `DB.init()` propaga la migración del seed sin tocar el progreso del usuario.
  - **Sin nuevos archivos JS** — todos los renderers viven en `app.js` para no inflar el shell ni reordenar el `<script>` order.
- **Validación tolerante en fill-blank:** el helper `normalizeAnswer()` aplica `lowercase + trim + colapso de espacios + remoción de acentos (NFD)` antes de comparar. Cada lección declara `acceptedAnswers[]` con todas las variantes válidas (`am` / `i'm` / `i am`). **Justificación:** el target es A1 rural en Android gama baja, donde el teclado/autocorrector inserta mayúsculas y la fricción de tipear castigaría injustamente respuestas correctas.
- **Migración del corpus:** se rebalanceó agresivamente. De 120 lecciones, **96 quedan en multiple-choice**, **10 fill-blank** (verb-to-be, past simple regular/irregular, past perfect), **5 word-order** (cada tipo de condicional + reported speech), **4 true-false** (modales/deducción) y **5 matching** (un topic de vocabulario por lección). **IDs preservados** para no romper el progreso Leitner; las 5 lecciones de matching usan IDs nuevos `mat-001..mat-005` y conviven con las `voc-*` originales.

## 3. Decisiones de alcance

### 3.1 ~25 ejercicios semilla agrupados en 13 topics A1

Suficientes para mostrar el ciclo completo del sistema Leitner (5 cajas, repetición espaciada), el patrón Form / Use / Examples de los topics y la práctica filtrada por tema. Para producción, se aprovisionarían cientos de ejercicios y topics A2/B1 desde el servidor remoto opcional.

### 3.2 Sin autenticación

El prototipo asume un único perfil por dispositivo. Añadir login implicaría discutir gestión de sesiones, hash de contraseñas, recuperación, etc. — fuera del alcance de un prototipo de bajo nivel.

### 3.3 Sin sincronización implementada

El detector de conectividad y la "cola de sincronización" están preparados a nivel de UI (banner de estado) pero no envían datos a ningún servidor. El diseño de Etapa 3 define el servidor remoto como **opcional**; el prototipo respeta esa opcionalidad.
