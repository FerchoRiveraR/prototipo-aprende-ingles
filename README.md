# Aprende Inglés — PWA Offline-First

Plataforma educativa **Progressive Web App (PWA)** para aprender inglés (nivel A1) con funcionamiento **100 % offline** después de la primera carga, pensada para estudiantes en contextos con conectividad limitada o intermitente (p. ej. zonas rurales de Colombia, donde una alta proporción de las instituciones educativas carecen de internet estable).

## 🌐 Demo en vivo

**https://ferchoriverar.github.io/prototipo-aprende-ingles/**

Recomendado en Chrome (desktop o Android). La app puede instalarse desde el navegador con "Instalar" o "Añadir a pantalla de inicio" y, una vez instalada, funciona sin conexión a internet.

## ✨ Características

- **Offline-first**: Service Worker con estrategia cache-first cachea el shell completo en la primera visita; toda la lógica de aprendizaje corre en el cliente.
- **Aprendizaje adaptativo**: motor de **repetición espaciada** basado en el sistema **Leitner de 5 cajas**, implementado puramente en el navegador.
- **Gamificación**: puntos, niveles, racha diaria y logros para sostener la motivación sin necesidad de servidor.
- **Persistencia local**: progreso, lecciones y configuración guardados en **IndexedDB** (vía Dexie.js).
- **Instalable como app**: manifest PWA con íconos SVG, tema y modo standalone.
- **Detector de conectividad**: banner de estado y cola de sincronización lista para Background Sync (preparada como interfaz; el backend remoto queda fuera del MVP).

## 🏗️ Arquitectura

Toda la aplicación se ejecuta en el dispositivo del usuario. El servidor solo se usa para servir los archivos estáticos iniciales; tras esa primera carga la app es completamente autónoma.

```
┌──────────────────────────────────────────────────┐
│  PRESENTACIÓN — PWA Shell                        │
│  HTML5 + CSS3 + JavaScript Vanilla               │
│  Vistas: Dashboard · Lección · Perfil            │
├──────────────────────────────────────────────────┤
│  LÓGICA — Motores en el cliente                  │
│  • Leitner (repetición espaciada, 5 cajas)       │
│  • Gamificación (puntos, niveles, racha, logros) │
├──────────────────────────────────────────────────┤
│  PERSISTENCIA — IndexedDB (Dexie.js)             │
│  Lecciones · Progreso · Configuración            │
├──────────────────────────────────────────────────┤
│  PLATAFORMA — Service Worker + Cache API         │
│  Estrategia cache-first · Manifest PWA           │
└──────────────────────────────────────────────────┘
```

Más detalle en [`docs/arquitectura.md`](docs/arquitectura.md), [`docs/decisiones-de-diseño.md`](docs/decisiones-de-diseño.md) y [`docs/desafios-y-soluciones.md`](docs/desafios-y-soluciones.md).

## 📁 Estructura del repositorio

```
prototipo-aprende-ingles/
├── README.md
├── src/                            ← código publicado en GitHub Pages
│   ├── index.html                  ← PWA shell
│   ├── manifest.webmanifest        ← manifiesto PWA
│   ├── sw.js                       ← Service Worker (cache-first)
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js                  ← bootstrap, router, listeners
│   │   ├── db.js                   ← capa Dexie / IndexedDB
│   │   ├── leitner.js              ← motor de repetición espaciada
│   │   ├── gamification.js         ← motor de gamificación
│   │   └── seed-data.js            ← 10 ejercicios A1 (vocabulario + gramática)
│   ├── pages/                      ← vistas (dashboard, lesson, profile)
│   └── assets/icons/               ← íconos PWA (SVG)
├── docs/                           ← documentación técnica (arquitectura, decisiones)
├── tests/                          ← validaciones automatizadas
└── .github/workflows/deploy-pages.yml  ← despliegue automático a GitHub Pages
```

## 🚀 Ejecutar localmente

El Service Worker requiere un servidor HTTP (no funciona sobre `file://`). Cualquier servidor estático sirve:

```bash
# Opción A — Python 3 (sin dependencias)
cd src && python3 -m http.server 8080

# Opción B — Node.js
npx http-server src -p 8080

# Opción C — PHP
cd src && php -S localhost:8080
```

Luego abrir `http://localhost:8080`.

### Verificar el modo offline

1. Cargar la app en el navegador (la primera visita instala el Service Worker).
2. DevTools (F12) → **Application → Service Workers**: debe aparecer `sw.js` como *activated and running*.
3. **Application → IndexedDB**: la base `LeitnerEnglishDB` debe contener los ejercicios seed.
4. **Network → Offline** (o apagar el WiFi) y recargar: la app debe seguir funcionando completa.

## 🧰 Stack técnico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| UI | HTML5 + CSS3 + JS Vanilla | Cero dependencias pesadas; máxima compatibilidad con dispositivos de gama baja |
| PWA | Web App Manifest + Service Worker API | Instalable; control fino del caché |
| Offline | Cache API (Service Worker artesanal) | Estrategia cache-first sin Workbox, para mantener bundle mínimo |
| Datos | IndexedDB + [Dexie.js](https://dexie.org/) | Wrapper async de IndexedDB con buena DX |
| Aprendizaje | Sistema Leitner (5 cajas) | Algoritmo educativo clásico, ejecutable 100 % en cliente |
| Despliegue | GitHub Pages + GitHub Actions | Workflow `deploy-pages.yml` publica `src/` en cada push a `main` |

## 🔒 Privacidad y ética

- **Datos en el dispositivo**: todo el progreso del estudiante se guarda únicamente en su navegador (IndexedDB). No hay envío de datos a servidores externos.
- **Sin tracking**: no se incluyen analíticas ni pixeles de terceros.
- **Acceso equitativo**: la arquitectura offline-first remueve la conectividad como barrera de acceso a la educación.

## 🔭 Limitaciones del MVP

- Set inicial de **10 ejercicios** (5 vocabulario + 5 gramática), suficiente para demostrar el ciclo Leitner completo.
- Sin autenticación ni sincronización con backend remoto (la cola de sincronización está preparada como interfaz, pero no apunta a ningún servidor).
- Sin asistente conversacional de IA (queda como evolución futura).
- Tests funcionales automatizados (Playwright) cubren los flujos críticos; no hay aún pipeline de CI/CD ejecutándolos.

---

**Autor:** Luis Fernando Rivera Ramírez
**Contexto:** Construido como prototipo en el marco del programa de Ingeniería de Sistemas — UNAD (2026).
