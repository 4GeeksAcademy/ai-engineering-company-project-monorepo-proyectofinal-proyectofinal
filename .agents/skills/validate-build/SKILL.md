---
name: validate-build
description: "Verificar compilacion y tipado de frontends TrackFlow en uis/ antes de entregar o preparar un commit; revisar restricciones de estado y estados asincronos."
---

# Validar build y tipos

## Objetivo unico

Determinar, con evidencia reproducible, si los modulos frontend modificados estan listos para entrega respecto de compilacion y tipado, sin modificar dependencias ni contratos.

## Inputs

- Requerido: lista de rutas de modulos modificados bajo `uis/`, relativas a la raiz (por ejemplo, `uis/talent-pipeline-tracker/components/CandidatePipeline.tsx`).
- Opcional: comandos de validacion documentados por el proyecto y restricciones de ejecucion del usuario.
- Derivar las apps propietarias desde esas rutas y sus manifiestos; no asumir que el typecheck raiz cubre una app anidada. Si no existen rutas o scripts verificables, informar del bloqueo.
- Para nueva funcionalidad interna, la ruta propietaria es `./uis/backoffice/`; `./uis/talent-pipeline-tracker/` solo identifica mantenimiento de la implementacion heredada. No crear ni copiar una app para resolver un input inexistente.

## Procedimiento

1. Leer el banco de memoria, `AGENTS.md`, `.agents/rules/trackflow-standards.md`, los READMEs de raiz, `uis/`, `services/` y las instrucciones locales aplicables. Identificar las apps afectadas sin leer secretos ni instalar paquetes. Contrastar rutas de producto: `./uis/website/`, `./uis/backoffice/`, `./services/`; frontends bajo `./uis/`, nunca en arboles paralelos. Para el tracker heredado, comprobar que el cambio es mantenimiento o migracion expresamente autorizada; si no, reportar bloqueo sin mover ni duplicar codigo.
2. Revisar manifiestos y scripts. Para el tracker, ejecutar desde la raiz `npm --prefix uis/talent-pipeline-tracker run typecheck`, `npm --prefix uis/talent-pipeline-tracker test` y `npm --prefix uis/talent-pipeline-tracker run build`. Registrar cada codigo de salida. Si cambia tambien `src/`, ejecutar adicionalmente `npm run typecheck` y `npm test` en la raiz. Para otra app, usar sus comandos documentados; no inventar un build para HTML estatico.
3. Revisar declaraciones/imports del frontend afectado: cero `any`, sin evasiones del compilador, sin Redux, Zustand, Jotai, MobX, Recoil u otro gestor global externo. Confirmar hooks nativos y estado acotado; `npm ls --depth=0` en la app ayuda a verificar dependencias, pero no sustituye inspeccionar imports.
4. Revisar cada flujo asincrono modificado: carga visible, exito con datos o vacio, error visible y recuperable. Comprobar que no se mantienen datos obsoletos tras fallos o respuestas fuera de orden; probar con mocks cuando existan pruebas. No consultar ni modificar candidaturas reales para este chequeo.
5. Emitir informe: apps, comandos/codigos, restricciones inspeccionadas, evidencia de los tres estados y bloqueos. Actualizar el progreso conforme a `AGENTS.md` cuando corresponda; no hacer commit o push sin autorizacion.

## Criterios de aceptacion

- Typecheck (`tsc --noEmit` mediante script o equivalente documentado) termina con codigo **0** en todas las apps afectadas.
- Build y pruebas existentes terminan con codigo **0**; si no existen o el entorno los bloquea, la entrega queda parcialmente verificada, no aprobada por completo.
- No hay tipos `any` ni gestores externos prohibidos en el codigo frontend afectado o sus dependencias declaradas.
- Cada flujo asincrono modificado muestra los tres estados: **carga, exito y error**, con evidencia de revision o prueba; lista vacia no se confunde con error.
- No se modifican archivos sensibles, configuracion protegida ni API compartida para conseguir un resultado satisfactorio.
- Todas las rutas de producto nuevas respetan `./uis/website/`, `./uis/backoffice/` o `./services/` y sus READMEs. No hay scaffolds ni arboles paralelos duplicados. Documentar la ubicacion heredada si solo se valida mantenimiento del tracker; cualquier migracion requiere autorizacion verificable.

## Evidencia independiente

Entregar una tabla con las columnas `App/ruta`, `Comando o flujo`, `Resultado esperado`, `Resultado observado` y `Evidencia`. Para comandos, incluir codigo de salida; para restricciones, identificar manifiesto e imports inspeccionados; para estados asincronos, indicar componente/hook y prueba o rama de render de carga, exito y error. Un tercero debe poder repetir los comandos desde la raiz y localizar esas ramas sin datos personales ni secretos.

Clasificar cada criterio como `cumple`, `falla`, `bloqueado` o `no aplica` con justificacion. Una revision visual de codigo no equivale a una prueba de navegador; un build correcto no demuestra que la API funciona. La skill valida codigo de aplicaciones, no la configuracion documental de agentes: para cambios exclusivamente Markdown, verificar rutas, referencias y metadatos sin ejecutar builds ajenos al cambio.

Si falla un criterio, informar el error exacto y el alcance sin ampliar cambios automaticamente. Maximo dos intentos de correccion autorizada; no encadenar bucles de build y reparacion. Esta skill es un procedimiento guiado, no un hook ni una garantia de CI.
