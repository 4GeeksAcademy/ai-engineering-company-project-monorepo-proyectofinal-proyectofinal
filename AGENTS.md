# Protocolo de agentes de TrackFlow

## Inicio obligatorio

Al iniciar cada sesion, antes de proponer o modificar codigo, leer en este orden:

- `memory-bank/projectbrief.md`
- `memory-bank/techContext.md`
- `memory-bank/progress.md`

Si falta algun archivo, informar del bloqueo; no inventar contexto. Inspeccionar el estado Git sin alterar trabajo existente y leer instrucciones mas especificas del directorio afectado. Para cualquier trabajo en `uis/` o `src/`, cargar obligatoriamente `.agents/rules/trackflow-standards.md`; esta referencia hace efectivo el alcance aunque el cliente no descubra automaticamente `.agents/rules/`.

Usar `.agents/skills/validate-build/SKILL.md` para entregas que afecten compilacion, tipos o comportamiento asincrono de `uis/`. Los protocolos documentales no sustituyen CI ni hooks de ejecucion automatica.

El contexto corporativo se rige por `Hito_4_trackflow-BRIEFING.es.md`; el alcance de candidaturas existente conserva su briefing del Hito 3. Separar decisiones tecnicas del proyecto de requisitos textuales del briefing. Si una fuente se contradice (incluido el nombre del CEO), registrar la discrepancia en el banco y pedir aclaracion antes de propagarla.

## Rutas oficiales obligatorias

Leer `README.es.md`, `uis/README.es.md`, `services/README.es.md` y el README de la app afectada antes de planificar codigo de producto. Los frontends pertenecen a `./uis/`: web publica en `./uis/website/`, producto interno People & Talent en `./uis/backoffice/`; APIs y workers en `./services/` (`/services` relativo al monorepo, nunca a la raiz del sistema).

Prohibido inventar rutas de app paralelas fuera de `./uis/website/`, `./uis/backoffice/` y `./services/`: no crear `apps/`, `frontend/`, `backend/`, apps en la raiz ni clones por hito. Las subcarpetas de una app oficial, incluido su `app/` de Next.js, no son una app paralela. `src/` conserva las utilidades existentes del Hito 2, no es un destino para nuevos frontends/backend.

`uis/talent-pipeline-tracker/` es una implementacion heredada que debe preservarse; no autoriza nuevas apps internas hermanas ni expansion de producto futuro fuera del backoffice. Su integracion, o la inicializacion de backoffice si falta, requiere plan y confirmacion explicita; no mover ni duplicar archivos como parte de una tarea documental.

## Antes de cada commit: exactamente cuatro pasos

Este flujo es obligatorio tanto para el agente como para el desarrollador que prepara o confirma cambios; quien realiza el commit debe comprobar la evidencia de cada paso.

1. **Verificacion de tipado con tsc.** Ejecutar `npm run typecheck` en la raiz cuando se afecte `src/` y `npm --prefix uis/talent-pipeline-tracker run typecheck` cuando se afecte el tracker. Para otra app, resolver su comando de `tsc --noEmit` en su manifiesto. Exigir codigo 0 en todos los proyectos afectados; completar build y pruebas disponibles segun `validate-build` y registrar fallos sin ocultarlos.
2. **Revision de restricciones de estado y tipos.** Comprobar ausencia de `any` y gestores externos de estado global en el frontend, hooks locales, contratos preservados y estados de carga, exito y error en cada operacion asincrona modificada. Verificar no mutacion y reglas logisticas en `src/`. Contrastar rutas nuevas con los READMEs y el mapa oficial: no aprobar apps paralelas; distinguir mantenimiento heredado de nuevo producto para backoffice.
3. **Validacion de exclusion de archivos sensibles.** Revisar `git diff --cached --name-only` sin imprimir contenidos secretos. Confirmar con `git check-ignore` que `.env.local` y variantes locales estan excluidas y que ninguna aparece en el indice. Excluir credenciales, claves privadas, datos personales, `node_modules/`, `.next/` y `dist/`. Si ya estan rastreados, detenerse y pedir confirmacion para corregirlo; `.gitignore` no los elimina del historial. `.env.example` solo puede contener placeholders publicos y debe revisarse antes de incluirlo.
4. **Actualizacion de progress.md.** Actualizar `memory-bank/progress.md` con alcance real, comandos y resultados, bloqueos y siguientes pasos. No declarar pruebas no ejecutadas ni hitos completados sin evidencia. Incluir esa actualizacion en el commit autorizado y revisar que el indice solo contenga el alcance acordado.

Si un paso falla, no realizar el commit. Este protocolo no autoriza por si mismo commit, push, merge ni cambio de rama.

## Entrega del banco de memoria

La rama de trabajo solicitada es `feature/agent-memory-bank` y la base de la PR es `main`. Antes de crearla, comprobar `git status --short`, la diferencia con `origin/main` tras fetch y los archivos sensibles rastreados (solo sus nombres). No heredar commits de otros hitos sin acordar la base con el desarrollador. Preparar archivos mediante una lista explicita, nunca `git add .`; no publicar mientras exista un archivo local de entorno rastreado o no se haya revisado el alcance de la PR. No retirar archivos del indice ni reescribir historial para ocultar secretos sin confirmacion explicita.

## Superficies protegidas

No modificar, crear sustitutos ni eliminar estas superficies sin confirmacion explicita del usuario para ese cambio:

- Dependencias y configuracion base: `package.json`, lockfiles, `tsconfig*.json`, `next.config.*`, configuracion Tailwind/PostCSS, `.devcontainer/`, `infra/`, `docker-compose.yml` y configuracion CI.
- Variables de entorno: `.env`, `.env.*` en cualquier directorio, incluidas plantillas. No leer ni mostrar valores secretos; pedir al usuario que los configure directamente.
- Contratos y rutas API protegidas: `uis/talent-pipeline-tracker/lib/`, `uis/talent-pipeline-tracker/types/api.ts`, `uis/talent-pipeline-tracker/app/api/` y rutas/contratos backend de `services/`. No cambiar URL base, metodos, esquemas, autenticacion ni endpoints sin aprobacion y evidencia del contrato.
- Fuentes de negocio y seguridad: briefings `Hito*BRIEF*.md`, `CONTEXT*.md`, documentos oficiales de politicas laborales, permisos y autenticacion. No alterar una fuente para hacer coincidir la implementacion ni inventar politicas de Personas. Los documentos derivados del banco pueden actualizarse con evidencia y dentro del alcance autorizado.
- Topologia de aplicaciones: no crear rutas de producto fuera de `./uis/website/`, `./uis/backoffice/` y `./services/` sin confirmacion explicita para cambiar esa politica. Reubicaciones, duplicados, scaffolds, repositorios Git anidados y cambios de raiz requieren aprobacion especifica; nunca usarlos como atajo para evitar las rutas oficiales.

No ejecutar escrituras contra la API compartida para validar sin autorizacion explicita. Preferir pruebas con transporte simulado. No revertir cambios ajenos ni incluir archivos de otros hitos por comodidad.
