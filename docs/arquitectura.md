# Arquitectura del prototipo

Este documento describe la arquitectura del prototipo de bajo nivel construido para la Etapa 4 del curso *Proyecto de Ingeniería I*. La arquitectura es una **representación fiel** del diseño consolidado por el Grupo 57 en la Etapa 3: *Arquitectura Offline-First centrada en el Cliente*.

## 1. Vista general

El sistema se ejecuta íntegramente en el dispositivo del estudiante como una **Progressive Web App (PWA)**. La conectividad a internet es opcional y solo se utiliza, cuando está disponible, para sincronizar progreso al servidor remoto (no implementado en el MVP). Esta decisión arquitectónica responde directamente a la causa raíz identificada en la Etapa 2: el 79,8 % de las instituciones rurales de Colombia carecen de conexión estable a internet (DANE, 2023).

## 2. Diagrama de capas

```
┌─────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN — PWA Shell                       │
│  HTML5 + CSS3 + JavaScript Vanilla                      │
│  Vistas: Dashboard · Lección · Perfil                   │
│  Archivos: index.html · css/styles.css · js/app.js      │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│  CAPA DE LÓGICA DE NEGOCIO                              │
│  ┌─────────────────────────┐  ┌──────────────────────┐  │
│  │ Motor de Aprendizaje    │  │ Motor de             │  │
│  │ Adaptativo (Leitner)    │  │ Gamificación         │  │
│  │ 5 cajas + repetición    │  │ Puntos · Niveles ·   │  │
│  │ espaciada local         │  │ Rachas · Logros      │  │
│  │ leitner.js              │  │ gamification.js      │  │
│  └─────────────────────────┘  └──────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│  CAPA DE DATOS — IndexedDB vanilla                      │
│  Wrapper async/await en db.js                           │
│  Stores: lessons · progress · settings · achievements   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│  CAPA DE INFRAESTRUCTURA OFFLINE                        │
│  Service Worker (sw.js) + Cache API                     │
│  Estrategia: cache-first · Precarga del App Shell       │
└────────────────────────────┬────────────────────────────┘
                             │ (online opcional)
┌────────────────────────────┴────────────────────────────┐
│  CAPA DE SINCRONIZACIÓN — preparada, opcional           │
│  Detector de conectividad (navigator.onLine + events)   │
│  Background Sync API → Servidor remoto (no requerido)   │
└─────────────────────────────────────────────────────────┘
```

## 3. Componentes y responsabilidades

### 3.1 PWA Shell
- **Archivos:** `index.html`, `manifest.webmanifest`, `css/styles.css`, `js/app.js`.
- Estructura mobile-first con `max-width` de 480 px y navegación inferior de tres botones.
- Manifest declara la app como instalable, con tema `#00897B` y modo `standalone`.
- `app.js` actúa como orquestador: enruta entre vistas, escucha eventos `online`/`offline` y llama a los motores.

### 3.2 Motor de Aprendizaje Adaptativo (componente innovador)
- **Archivo:** `js/leitner.js`.
- Implementa el sistema Leitner de 5 cajas con intervalos `[0, 2, 4, 7, 14]` días.
- `selectNextLesson()` elige el ejercicio vencido en la caja más baja (más necesitado de refuerzo).
- `processAnswer(id, correct)` mueve el ejercicio: respuesta correcta → caja siguiente (máximo 5); incorrecta → caja 1.
- 100 % cliente: no requiere servidor para calcular intervalos.

### 3.3 Motor de Gamificación
- **Archivo:** `js/gamification.js`.
- Otorga 10 puntos por respuesta correcta, +5 desde la segunda correcta consecutiva.
- Sube de nivel cada 100 puntos.
- Calcula racha diaria por `dayStamp` UTC (ayer → +1, otro día → reset a 1).
- 5 logros desbloqueables persistidos en `achievements`.

### 3.4 Capa de datos
- **Archivo:** `js/db.js` + datos semilla `js/seed-data.js`.
- IndexedDB con cuatro stores y dos índices secundarios (`category`, `nextReview`).
- Wrapper async/await que oculta la API basada en eventos.
- Sembrado idempotente: solo carga ejercicios la primera vez.

### 3.5 Service Worker
- **Archivo:** `sw.js`.
- Listener `install` precarga el App Shell completo.
- Listener `activate` limpia cachés de versiones anteriores.
- Listener `fetch` aplica estrategia **cache-first** con fallback a `index.html` para navegaciones offline.
- Versionado mediante `CACHE_VERSION` para invalidar cachés en futuras actualizaciones.

## 4. Flujo de información (modelo caja negra)

```
ENTRADAS
   ↓
1. Estudiante interactúa con la PWA (selecciona respuesta).
   ↓
2. app.js captura el evento y consulta Leitner.processAnswer.
   ↓
PROCESOS
   ↓
3. Leitner determina la nueva caja y el próximo intervalo de revisión.
4. Gamification calcula puntos, nivel, racha y verifica logros.
5. Cada motor persiste su resultado en IndexedDB vía db.js.
   ↓
SALIDAS
   ↓
6. UI actualiza el feedback inmediato (correcto/incorrecto + explicación).
7. Header refleja stats actualizadas (puntos, racha, nivel).
8. Próximo ejercicio se carga al pulsar "Siguiente ejercicio".
```

## 5. Tecnologías utilizadas

| Capa                | Tecnología                          | Versión / Estándar           |
|---------------------|-------------------------------------|------------------------------|
| Frontend            | HTML5 + CSS3 + JavaScript Vanilla   | ES2017+ (async/await)        |
| Empaquetado PWA     | Web App Manifest                    | W3C Web App Manifest         |
| Offline             | Service Worker + Cache API          | Service Worker spec, Caches  |
| Almacenamiento      | IndexedDB                           | IndexedDB API 2.0            |
| Iconografía         | SVG                                 | SVG 1.1                      |

## 6. Indicadores de desempeño previstos

Los siguientes indicadores fueron definidos en el documento de Etapa 3 y se mantienen como objetivos para validar la arquitectura una vez desplegada con usuarios reales:

| Indicador                  | Meta             |
|----------------------------|------------------|
| Tasa de completitud        | > 70 % en 30 días |
| Precisión en ejercicios    | > 65 % por sesión |
| Tiempo promedio de sesión  | > 15 min/día      |
| Tasa de retención          | > 50 % a 30 días  |
| Sincronización exitosa     | > 95 %            |
| Satisfacción del usuario   | > 4.0 / 5.0       |

## 7. Limitaciones reconocidas

- **Sin sincronización con servidor remoto:** el MVP no implementa el endpoint REST opcional; los datos viven solo en el dispositivo.
- **Sin asistente IA conversacional:** queda fuera de alcance del prototipo de bajo nivel.
- **Sin autenticación:** se asume un único perfil por dispositivo.
- **Conjunto de ejercicios reducido:** solo 10 lecciones seed, suficientes para demostrar el ciclo completo del sistema Leitner.
