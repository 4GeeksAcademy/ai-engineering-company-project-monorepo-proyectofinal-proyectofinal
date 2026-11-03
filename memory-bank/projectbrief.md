# TrackFlow: People & Talent

## Negocio y alcance

TrackFlow es una empresa de logistica de ultima milla y gestion de almacenes con operaciones en Los Angeles y Zaragoza. People & Talent es su plataforma interna de gestion de personas, no un producto logistico para clientes externos.

Fundada en 2009, cuenta con aproximadamente 130 empleados y 9 millones de euros de facturacion anual. TrackFlow Tech, liderada por el CTO Andres Kim desde Zaragoza, construye los sistemas que deben unificar la operacion binacional. El area Personas esta dirigida por Rafael Sanz y su equipo de tres personas en Zaragoza, bajo los marcos laborales de Estados Unidos y Espana.

El Talent Pipeline Tracker centraliza el ciclo de vida del reclutamiento: recepcion de candidaturas, revision, entrevistas, oferta y decision de seleccion. El proceso inicial corresponde al puesto de Asistente de Direccion en Zaragoza.

## Problema

Las hojas de calculo compartidas, correos y notas dispersas dificultan conocer el estado de cada candidatura y provocan perdida o sobrescritura de informacion. El equipo necesita una fuente compartida para perfiles, estados, etapas y notas de entrevistas.

El Hito 4 amplia el problema: la incorporacion depende de explicaciones informales y PDFs diferentes por pais, no se comprueba la comprension del negocio, los accesos tardan dias y las consultas sobre politicas se responden de forma inconsistente. No existen indicadores consolidados de plantilla, rotacion o tiempo de contratacion por pais.

## Objetivos

- Listar candidaturas con nombre, puesto, estado y etapa.
- Buscar por nombre o email y filtrar sin recargar la pagina.
- Registrar y editar perfiles conforme al contrato real de la API.
- Cambiar estado y etapa desde el detalle y gestionar alli las notas internas.
- Mantener etiquetas en espanol, errores comprensibles y proteccion de datos personales.

## Evolucion prevista segun el Hito 4

- Estructurar la incorporacion corporativa con contenidos de empresa, operacion, puesto y lineamientos internos, comprobaciones de comprension y seguimiento del progreso.
- Automatizar solicitudes de acceso y ofrecer un portal de vacaciones y politicas.
- Consolidar indicadores de Personas por pais y un agente interno de RR. HH. basado en documentacion oficial.
- Mantener espanol como idioma base; ingles es opcional, no un requisito ya implementado.

Estos objetivos son necesidades del briefing, no funcionalidades acreditadas del tracker actual. No inventar politicas laborales, permisos, respuestas de RR. HH. ni contratos API para implementarlos.

## Fuentes de verdad consultadas

- [Contexto Hito 1](../CONTEXT.es.md): briefing del sitio web publico, disponible en la rama base.
- [Briefing Hito 4](../BRIEFING.md): copia del briefing corporativo sincronizada para esta entrega.
- Los briefings Hito 2 y Hito 3 se consultaron en `feature/domain-models`; no forman parte de esta rama documental.
- El README y el codigo heredado de `uis/talent-pipeline-tracker/` se consultaron en la rama historica, pero no estan disponibles en este worktree.

El archivo historico `Hito1_trackflow-BRIEFING.es.md` encontrado en la rama anterior tiene titulo y alcance de Hito 5 (backend de inventario), no es el briefing del Hito 1. No renombrarlo ni presentarlo como tal.

Los hitos previos siguen formando parte del monorepo. No reemplazar las entidades logisticas del Hito 2 por entidades de reclutamiento ni reinterpretar contratos existentes.

La plataforma interna futura se integra en `./uis/backoffice/`, no en una app paralela por hito. La web publica permanece en `./uis/website/` y los servicios backend en `./services/`; todos los proyectos frontend pertenecen a `./uis/`. La implementacion historica en `uis/talent-pipeline-tracker/` se conserva como referencia si se recupera, pero su codigo no esta presente en este worktree; integrarla requiere autorizacion y nunca debe duplicarse. El mapa y las prohibiciones operativas se detallan en [techContext.md](techContext.md).

El Hito 4 identifica al CEO como Thomas Harry al inicio y Thomas Espinoza mas adelante. Registrar esta discrepancia y solicitar aclaracion antes de usar su nombre en contenido nuevo; no resolverla por suposicion. Ante discrepancias de alcance, el Hito 4 gobierna el contexto de empresa y el Hito 3 conserva el contrato funcional del tracker existente.
