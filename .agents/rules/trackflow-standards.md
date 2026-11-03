---
description: "Reglas obligatorias de TrackFlow para cambios en uis/ y src/."
applyTo: "uis/**,src/**"
---

# Estandares TrackFlow

## Alcance obligatorio

Siempre activa para archivos bajo `uis/` y `src/`. `AGENTS.md` obliga a leer este archivo; no depender del reconocimiento automatico del frontmatter por cada cliente.

## Rutas oficiales y ausencia de duplicados

- Respetar `README.es.md`, `uis/README.es.md`, `services/README.es.md` y el README local. Proyectos frontend en `./uis/`, web publica en `./uis/website/`, app interna en `./uis/backoffice/` y backend en `./services/`. `/services` se refiere a la carpeta del monorepo.
- Prohibido crear arboles de aplicacion paralelos o duplicados fuera de esas rutas: no `apps/`, `frontend/`, `backend/`, apps raiz ni nuevas apps hermanas por hito. Ampliar modulos de la app propietaria. El `app/` interno de Next.js es valido; no confundirlo con una nueva raiz de producto.
- El tracker en `uis/talent-pipeline-tracker/` es legado existente, no una plantilla de ubicacion futura. Conservarlo sin clonarlo o moverlo; requerir confirmacion para integrarlo en backoffice o inicializar este si no existe. No iniciar nueva funcionalidad de producto interno fuera de backoffice.
- `src/` mantiene utilidades logisticas del Hito 2; no alojar alli nuevas apps frontend/backend. No crear repositorios Git anidados ni modificar configuracion de despliegue para eludir este mapa.

## Tipado y convenciones

- TypeScript estricto, sin `any`, `@ts-ignore` ni casts que oculten contratos incorrectos. Usar `unknown` y narrowing para datos no verificados.
- PascalCase para tipos, interfaces y componentes; camelCase para variables, funciones y hooks. Hooks con prefijo `use` y archivos de componentes consistentes con su exportacion.
- Separar modelos, transporte, hooks y presentacion. Respetar `src/types/models.ts` y las responsabilidades existentes de `src/utils/`.
- Usar `const` por defecto y `let` solo cuando el algoritmo lo requiera. No mutar entradas ni estado React. Una acumulacion local no observable no es una mutacion de parametros.

## Frontend People & Talent

- En el frontend People & Talent, usar Next.js App Router, React, TypeScript y hooks nativos: mantenimiento del tracker existente o desarrollo en backoffice tras autorizacion. Prohibidos gestores globales externos como Redux, Zustand, Jotai, MobX o Recoil.
- Mantener componentes servidor por defecto y limites cliente minimos para estado/eventos.
- Toda llamada asincrona debe ofrecer estados de carga, exito y error, sin errores silenciosos; manejar listas vacias y cancelacion o respuestas obsoletas cuando proceda.
- Mostrar identidad TrackFlow, candidaturas, puesto, entrevistas y notas internas; no presentar una interfaz generica.
- Estados: `received` -> Recibida; `in_progress` -> En proceso; `selected` -> Seleccionada; `discarded` -> Descartada.
- Etapas: `pending` -> Pendiente de revision; `review` -> En revision; `personal_interview` -> Entrevista personal; `technical_interview` -> Entrevista tecnica; `offer_presented` -> Oferta presentada. En la UI real, conservar las tildes de las etiquetas del briefing.
- Los codigos API se conservan en payloads y valores internos, nunca como etiquetas visibles. Notas solo en el detalle; no registrar datos personales en logs ni fixtures reales.

## Contexto operativo del Hito 4

- Personas esta liderada por Rafael Sanz desde Zaragoza y sirve a empleados de Estados Unidos y Espana; Ana Whitfield es responsable de Operaciones de Almacen y stakeholder del proceso de seleccion del Hito 3, no responsable general de Personas.
- Incorporacion, accesos, politicas e indicadores por pais son objetivos futuros hasta que exista implementacion validada. No mostrarlos como servicios disponibles ni inventar endpoints para ellos.
- Usar documentacion oficial para respuestas de RR. HH.; no deducir derechos, beneficios o reglas laborales de un pais a partir del otro. Espanol es el idioma base, ingles opcional.

## Compatibilidad del monorepo

No trasladar vocabulario de reclutamiento a la web publica ni a los modelos de inventario, envios y transportistas de `src/`. Cada hito conserva su briefing y contratos. Tailwind es stack solicitado para la evolucion del frontend, no una dependencia que el agente pueda instalar sin confirmacion.

Antes de entregar, seguir `AGENTS.md` y la skill `validate-build` para las apps afectadas. No modificar superficies protegidas sin permiso.
