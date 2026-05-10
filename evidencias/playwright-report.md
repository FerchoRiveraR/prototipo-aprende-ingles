# Reporte de validación automatizada (Playwright)

Generado el 2026-05-10T06:45:20.831Z
URL probada: `http://localhost:8080`
Resultado: **23/23 validaciones OK**

## Validaciones

| # | Validación | Resultado | Detalle |
|---|------------|-----------|---------|
| 1 | GET / responde 200 | ✅ | HTTP 200 |
| 2 | Service Worker registrado y activo | ✅ |  |
| 3 | IndexedDB.lessons tiene >= 25 ejercicios | ✅ | count=31 |
| 4 | IndexedDB.topics tiene >= 12 temas | ✅ | count=13 |
| 5 | IndexedDB.progress = lessons (1:1) | ✅ | progress=31 lessons=31 |
| 6 | IndexedDB.settings tiene perfil | ✅ | count=1 |
| 7 | Sin lecciones huérfanas (topicId apunta a topic existente) | ✅ | huérfanas=0 |
| 8 | Sin referencias rotas (topic.lessonIds → lesson real) | ✅ | OK |
| 9 | Índice "Aprender" muestra al menos 12 tarjetas | ✅ | cards=13 |
| 10 | Topic "Verb to be" muestra 3 tarjetas por sujeto | ✅ | cards=3 |
| 11 | Topic incluye sección "Use" | ✅ |  |
| 12 | Topic incluye sección "Examples" | ✅ |  |
| 13 | Práctica filtrada muestra ejercicio de verb-to-be | ✅ | pregunta="I ___ a student." |
| 14 | Puntos > 0 tras respuesta correcta | ✅ | points=10 |
| 15 | totalCorrect = 1 | ✅ | totalCorrect=1 |
| 16 | Al menos un logro desbloqueado | ✅ | unlocked=1 |
| 17 | manifest.webmanifest sirve 200 | ✅ |  |
| 18 | Manifest tiene start_url y display | ✅ |  |
| 19 | sw.js sirve 200 | ✅ |  |
| 20 | Contexto puesto en modo offline | ✅ |  |
| 21 | Banner "sin conexión" visible | ✅ |  |
| 22 | App recarga completamente sin internet | ✅ |  |
| 23 | Vista de lección renderiza offline | ✅ |  |

## Capturas generadas

- 01-dashboard-inicial.png
- 02-leccion-pregunta.png
- 03-leccion-correcta.png
- 04-leccion-incorrecta.png
- 05-dashboard-progreso.png
- 06-perfil-logros.png
- 07-aprender-indice.png
- 08-topic-verb-to-be.png
- 09-practica-filtrada.png
- 11-banner-sin-conexion.png
- 14-network-offline.png
- 15-app-funcionando-offline.png
