# Progreso de TrackFlow

Actualizado: 2026-11-03.

## Estado actual

- Hito 2 completado en la rama historica: modelos y utilidades logisticas TypeScript; sus fuentes no estan en el worktree actual. Las ejecuciones de aquella rama registraron 7 pruebas aprobadas, sin evidencia de ejecucion en esta rama.
- Hito 3 implementado en la rama historica con Next.js App Router, React, TypeScript y cliente tipado. En el worktree actual, `uis/talent-pipeline-tracker/` contiene solo `.next/`, `.test-build/`, `node_modules/` y `tsconfig.tsbuildinfo`; no estan los fuentes, README, manifiesto ni contrato API. No se pueden volver a validar ni recuperar contratos desde estos artefactos.
- Infraestructura de IA en curso: banco de memoria, protocolo raiz, reglas y skill `validate-build` creados; base documental completada y comprobada, sin agentes en runtime ni automatizacion CI.
- Sincronizacion con Hito 4: registrados Rafael Sanz y el equipo Personas, la operacion en dos paises y los objetivos de incorporacion, accesos, politicas e indicadores; estas capacidades futuras no se declaran implementadas.
- Tailwind solicitado, pero no declarado como dependencia del tracker actual. No se ha migrado CSS ni instalado paquetes en esta tarea.
- Mapa oficial incorporado: frontends en `./uis/`, web publica en `./uis/website/`, producto interno futuro en `./uis/backoffice/` y backend en `./services/`. El tracker actual es una ubicacion heredada, no una ruta autorizada para nuevas apps o expansion de producto futuro.
- Auditoria de briefings: Hito 1 identificado en `CONTEXT.es.md`; el archivo historico `Hito1_trackflow-BRIEFING.es.md` corresponde por contenido a Hito 5. Hito 2 y Hito 3 se revisaron desde la rama anterior, no desde esta entrega.
- Validacion local del Hito 1: la web esta desplegada en Docker en `http://localhost:8080`; landing, formulario, CSS y JS dieron HTTP 200, `/application` redirige correctamente y las rutas inexistentes dan 404. La validacion JS sintactica y una prueba aislada de formulario con DOM simulado pasaron; no es una prueba de navegador ni existe backend conectado.
- Hay cambios locales no stageados en `infra/website/nginx.conf` y `uis/website/{README.md,index.html,validation.js}`. Son trabajo del sitio publico y deben mantenerse fuera del stage de `feature/agent-memory-bank` salvo que se acuerde otro alcance.

## Proximos pasos

- Verificar el listado stageado con `git diff --cached --name-only` y ejecutar el protocolo de cuatro pasos antes del commit. El commit, push y PR siguen pendientes.
- Aplicar `validate-build` antes de futuras entregas que modifiquen codigo de `uis/`; primero recuperar o implementar una app en la ruta oficial autorizada con sus manifiestos y contrato aprobados.
- Confirmar con el equipo si procede adoptar Tailwind antes de tocar configuracion protegida.
- Revisar los cambios con el usuario antes de commit, push o merge; esta tarea no autoriza esas operaciones.
- Ampliar la infraestructura de IA solo con alcance y contrato confirmados; estos archivos no implementan agentes en runtime, CI ni hooks ejecutables.
- Aclarar la discrepancia Thomas Harry / Thomas Espinoza del briefing antes de publicar contenido que nombre al CEO. Mantener el documento fuente intacto.
- Definir con el responsable de dominio como modelar transferencias de inventario: Hito 2 declara `MovementType = Transfer`, pero `InventoryMovement` solo incluye una propiedad `warehouse`, sin origen ni destino. No cambiar el briefing fuente sin autorizacion.
- Recuperar desde una fuente aprobada la especificacion API de Hito 3 antes de continuar con el formulario o el cliente del tracker; no inventar campos ni endpoints.
- Obtener la URL oficial de la politica de privacidad antes de reemplazar el enlace placeholder del formulario; no redactar ni publicar una politica legal sin fuente aprobada.
- Confirmar contratos, permisos y fuentes oficiales antes de desarrollar las capacidades de Personas adicionales del Hito 4.
- Solicitar aprobacion de un plan de integracion del tracker en `./uis/backoffice/`; no moverlo, clonarlo ni inicializar otra app sin confirmacion. Comprobar existencia y README de backoffice antes de planificar su implementacion; el mapa no acredita que ya este creado.

## Registro de esta entrega

Se han creado los documentos solicitados sin modificar aplicacion, dependencias, endpoints ni variables de entorno. El briefing local del Hito 4 permanece intacto y no debe incluirse automaticamente en ningun commit.

Validacion documental: comprobacion Node temporal finalizada con codigo 0. Confirma los seis archivos no vacios, cuatro pasos exactos del protocolo, referencias al banco, enlaces locales existentes, alcance `uis/` y `src/`, y metadatos/criterios de la skill. No se ejecutaron builds ni pruebas de aplicaciones en esta tarea documental; no hay evidencia nueva sobre su funcionamiento. No se hizo commit ni push.

Revision de alineacion con Hito 4: seis documentos actualizados preservando el protocolo existente y separando contexto corporativo, tracker actual y evolucion prevista. Se anadio evidencia independiente a la skill y proteccion de fuentes oficiales. Validacion Node de esta revision: codigo 0; seis documentos no vacios, bloques Markdown cerrados, enlaces locales existentes, cuatro pasos ordenados, referencias de inicio, alcance de reglas y metadatos/criterios/evidencia de la skill comprobados. Se verifico tambien la presencia de responsables, contexto binacional y discrepancia de CEO. No se ejecutaron pruebas de aplicacion ni se modifico el briefing fuente.

Revision de rutas oficiales: actualizados los seis documentos contra los READMEs de raiz, uis y services. Se prohiben arboles paralelos y duplicados, se distingue legado de producto futuro y se exige aprobacion para inicializaciones o migraciones. No se movieron apps ni se cambiaron contratos, dependencias o variables de entorno. Validacion Node de esta revision: codigo 0; comprobados mapa oficial y prohibiciones en los seis archivos, enlaces existentes, bloques Markdown cerrados, cuatro pasos ordenados, referencias de inicio y metadatos/inputs/criterios/evidencia de la skill. No se ejecutaron builds de aplicaciones al tratarse de cambios documentales. No se hizo commit ni push.

Revision de referencias y alcance de rama: `BRIEFING.md` se incorpora como copia byte a byte del briefing Hito 4 para que la PR aislada contenga el contexto solicitado. La fuente original `Hito_4_trackflow-BRIEFING.es.md`, el briefing Hito 3 y el README del tracker son fuentes locales no incluidas; no se crean enlaces rotos hacia ellas. El tracker heredado permanece sin seguimiento en el worktree y fuera del stage de esta entrega.

Seguimiento de auditoria: `CONTEXT.es.md` confirma el contenido de Hito 1 y reemplaza la referencia por nombre mal etiquetada. Permanecen dos decisiones de negocio pendientes (identidad del CEO y representacion de transferencias) y una dependencia documental pendiente (contrato API Hito 3); ninguna se resolvio por suposicion ni se modifico el briefing protegido.

Verificacion de entrega ejecutada: comprobacion Node con codigo 0 para los seis documentos, enlaces, cuatro pasos, alcance, metadatos/inputs/criterios/evidencia de la skill y rama objetivo. `git check-ignore --no-index` confirma exclusiones de `.env.local` en raiz, website y un servicio de ejemplo. La inspeccion de nombres con `git ls-files` confirma un archivo de entorno local rastreado: `uis/website/.env.local`. No se inspecciono su contenido; no se puede afirmar ausencia de secretos en commits anteriores. Los tres commits de diferencia con `origin/main` se comprobaron tras `git fetch origin --prune`. No se ejecutaron builds de aplicaciones en esta revision documental.

Preparacion de rama final: `feature/agent-memory-bank` creada desde `origin/main` (ahead 0, behind 0 antes del stage). Se preservo localmente `uis/website/.env.local`, sin leerlo, y queda ignorado y fuera del indice en esta rama. Stage selectivo limitado a `.gitignore`, `AGENTS.md`, `BRIEFING.md`, `.agents/rules/trackflow-standards.md`, `.agents/skills/validate-build/SKILL.md` y los tres archivos de `memory-bank/`. `Hito_4_trackflow-BRIEFING.es.md` y `uis/talent-pipeline-tracker/` quedan sin stage. No se ha hecho commit, push ni abierto PR.

Verificacion de fuentes de Hito 3: el tracker fuente y su README/API no existen en el worktree; solo hay artefactos de build/dependencias locales. Se comprobo el listado, sin leer `.next/` ni `node_modules/`, y se actualizo el contexto para no presentarlos como codigo disponible. No se borraron artefactos ni se consulto la API.

Sincronizacion de briefing para la entrega: `BRIEFING.md` creado y comprobado con `cmp -s` como identico a `Hito_4_trackflow-BRIEFING.es.md`. Se debe incluir solo la copia `BRIEFING.md`; la fuente original permanece sin stage. `uis/website/.env.local` continua ignorado y sin rastrear en esta rama.

Verificacion de esta continuacion: auditoria Node con codigo 0 para enlaces de los siete documentos staged, copia exacta de briefing, cuatro pasos ordenados, skill e indice de ocho archivos sin sensibles; `git diff --cached --check` limpio, type diagnostics sin errores y rama alineada con `origin/main` (0/0). No se ejecutaron pruebas de aplicacion. No se hizo commit, push ni PR.

Auditoria del banco solicitada: existen `projectbrief.md`, `techContext.md` y `progress.md`; negocio/People & Talent, arquitectura, restricciones y rutas oficiales estan documentados. Se actualizo este progreso para incluir evidencia reciente del sitio publico y delimitar sus cambios locales no stageados. Validacion del banco: pendiente de ejecutar para esta revision.
