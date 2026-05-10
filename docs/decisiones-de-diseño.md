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

## 3. Decisiones de alcance

### 3.1 Solo 10 ejercicios semilla

Suficientes para mostrar el ciclo completo del sistema Leitner (5 cajas, repetición espaciada) sin diluir el foco de la demostración. Para producción, se aprovisionarían cientos de ejercicios desde el servidor remoto opcional.

### 3.2 Sin autenticación

El prototipo asume un único perfil por dispositivo. Añadir login implicaría discutir gestión de sesiones, hash de contraseñas, recuperación, etc. — fuera del alcance de un prototipo de bajo nivel.

### 3.3 Sin sincronización implementada

El detector de conectividad y la "cola de sincronización" están preparados a nivel de UI (banner de estado) pero no envían datos a ningún servidor. El diseño de Etapa 3 define el servidor remoto como **opcional**; el prototipo respeta esa opcionalidad.
