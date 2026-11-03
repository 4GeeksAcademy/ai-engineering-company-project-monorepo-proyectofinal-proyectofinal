# Contexto tecnico

## Stack y arquitectura

- El briefing del Hito 4 define necesidades de negocio, no versiones de frameworks ni nuevos endpoints. El stack que sigue describe decisiones existentes del proyecto; contrastar siempre los manifiestos antes de afirmar versiones o dependencias instaladas.
- Frontend People & Talent historico: `uis/talent-pipeline-tracker/` fue implementado con Next.js App Router, React y TypeScript estricto en una rama anterior. Este worktree no contiene su codigo ni manifiesto, solo artefactos generados; la ruta es legado, no destino autorizado para nuevas apps. Producto futuro debe ir a `./uis/backoffice/` tras aprobacion.
- Estructura: `app/`, `components/`, `hooks/`, `types/` y `lib/`.
- Estado acotado a componentes y hooks nativos de React (`useState`, `useEffect` y otros hooks cuando proceda). Prohibidos Redux, Zustand, Jotai, MobX, Recoil y otros gestores externos de estado global.
- Contratos API en `types/`, transporte HTTP en `lib/` y presentacion en componentes. Conservar Server Components por defecto; usar limites cliente para interaccion y hooks.
- Tailwind CSS forma parte del stack solicitado. El tracker actual no lo declara en su manifiesto y utiliza CSS propio; su adopcion requiere confirmacion para modificar dependencias. No afirmar que esta instalado.
- El Hito 2 implemento utilidades logisticas TypeScript en `src/types/` y `src/utils/` en la rama historica. Esos fuentes no estan presentes en este worktree; no afirmar que se compilan aqui ni reconstruirlos sin el alcance correspondiente.

## Mapa obligatorio de la capa de aplicacion

Todas las rutas siguientes son relativas a la raiz del monorepo. La notacion `/services` del encargo significa `./services/`, no un directorio absoluto del sistema operativo.

| Responsabilidad         | Ruta oficial        | Regla                                                                                                                                    |
| ----------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Proyectos frontend      | `./uis/`            | Contenedor de interfaces; no crear frontends fuera de esta capa.                                                                         |
| Web corporativa publica | `./uis/website/`    | Ampliar la aplicacion publica existente, no duplicarla.                                                                                  |
| Aplicacion interna      | `./uis/backoffice/` | Destino de producto futuro de People & Talent, incorporacion, operaciones y administracion; organizar funciones dentro de una misma app. |
| Servicios backend       | `./services/`       | APIs y workers; seguir el backend centralizado y routers por dominio recomendados por el README raiz, sin inventar servicios duplicados. |

Fuentes: [README raiz](../README.es.md), [README de uis](../uis/README.es.md) y [README de services](../services/README.es.md). Leer ademas el README local de la app o servicio antes de editar. La politica especifica de esta entrega restringe nuevas apps a estas rutas oficiales, aunque la guia general muestre otros ejemplos.

Prohibido crear arboles paralelos o duplicados como `apps/`, `frontend/`, `backend/`, un `app/` de producto en la raiz o una nueva app hermana por hito. `app/` dentro de una aplicacion Next.js oficial sigue siendo valido. Tampoco alojar nuevos frontends/backend en `src/`, `memory-bank/`, `.agents/` o `agents/`; estos ultimos conservan sus responsabilidades documentadas de utilidades, instrucciones y agentes IA.

El tracker heredado se conserva sin moverlo ni clonarlo. No iniciar nuevo producto interno alli: proponer su integracion en `./uis/backoffice/` y obtener confirmacion explicita antes de crear scaffolds, mover archivos, cambiar imports, dependencias, despliegues o rutas API. Si backoffice aun no existe, informar del pendiente y pedir autorizacion para su inicializacion; no darlo por implementado.

## Contrato y seguridad

El README historico del tracker documentaba la API `https://playground.4geeks.com/tracker/api/v1` y la variable `NEXT_PUBLIC_TRACKER_API_URL`, pero el cliente, sus tipos y la especificacion API no estan en este worktree. No asumir que el servicio o contrato sigue disponible ni enviarle solicitudes; recuperar la fuente aprobada antes de continuar. Toda variable `NEXT_PUBLIC_*` es visible en el navegador: nunca usarla para secretos.

Respetar metodos, rutas, campos y valores del contrato existente. Mantener los codigos de estado/etapa en el transporte y mostrar sus etiquetas espanolas. Las notas internas aparecen unicamente en el detalle. No leer, imprimir, versionar ni enviar credenciales o datos personales reales para probar.

## Restricciones y validacion

- Cero `any`; usar tipos explicitos y `unknown` con comprobaciones en fronteras no confiables.
- Toda operacion asincrona debe representar carga, exito y error; lista vacia es un exito sin resultados. Renderizar feedback accesible y permitir recuperacion de errores.
- No mutar parametros ni estado React. En `src/`, preservar funciones puras y reglas del briefing logistico.
- No introducir nuevas librerias ni cambiar contratos para silenciar errores.
- El chequeo `tsc --noEmit` debe terminar con codigo 0 en cada proyecto afectado; un typecheck raiz no valida automaticamente el frontend anidado.

Cuando los manifiestos correspondientes esten presentes en la rama de trabajo, ejecutar desde la raiz del monorepo:

```bash
npm run typecheck
npm test
npm --prefix uis/talent-pipeline-tracker run typecheck
npm --prefix uis/talent-pipeline-tracker test
npm --prefix uis/talent-pipeline-tracker run build
```

Los comandos listados son referencias de la implementacion historica del Hito 2 y el tracker; en esta rama no estan sus manifiestos ni fuentes, por lo que no son ejecutables aqui. Para backoffice, consultar su manifiesto cuando exista y usar sus scripts reales; no copiar comandos ni crear un manifiesto duplicado para hacerlos pasar. Consultar los manifiestos actuales antes de ejecutar; registrar por separado comandos ejecutados, resultados y bloqueos.

## Limites de las futuras integraciones

La API del tracker cubre candidaturas y notas; no asumir que cubre incorporacion, vacaciones, indicadores o solicitudes de acceso del Hito 4. Esas capacidades requieren contratos y permisos confirmados. Un futuro agente de RR. HH. debe basarse en documentacion oficial aprobada, distinguir pais y no inventar obligaciones laborales. El banco de memoria no almacena expedientes, CVs, notas reales ni secretos.
