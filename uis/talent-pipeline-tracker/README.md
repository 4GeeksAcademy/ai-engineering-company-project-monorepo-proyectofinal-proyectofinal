# Talent Pipeline Tracker

Aplicación interna de People & Talent de TrackFlow para gestionar candidaturas de Asistente de Dirección en Zaragoza. Está implementada con Next.js App Router, React y TypeScript estricto; el estado vive en componentes y hooks nativos, sin gestor global.

## Estructura

```text
app/                  # App Router, layout, metadata y estilos globales
components/           # Pipeline, tabla, diálogos de detalle y formulario
hooks/                # useCandidates para filtros, paginación y carga
lib/                  # Cliente HTTP tipado de Talent Tracker API
types/                # Contratos API, estados y etapas
tests/                # Pruebas node:test con fetch simulado
```

## Ejecutar

```bash
cd uis/talent-pipeline-tracker
npm install
npm run dev
```

Abre <http://localhost:3000/>.

Comprobaciones disponibles:

```bash
npm run typecheck
npm test
npm run build
```

## API

La URL por defecto es `https://playground.4geeks.com/tracker/api/v1`. Para cambiarla, define `NEXT_PUBLIC_TRACKER_API_URL` en `.env.local` usando `.env.example` como referencia. No se requieren tokens ni credenciales.

- Listado, búsqueda y filtros: `GET /records` con `status`, `stage`, `search`, `page` y `limit`.
- Alta: `POST /records`; edición del perfil: `PUT /records/{id}`.
- Cambio de estado/etapa: `PATCH /records/{id}`.
- Detalle y notas privadas: `GET/POST /records/{id}/notes`; eliminación `DELETE /records/{id}/notes/{note_id}`.

Los tipos de [`types/api.ts`](types/api.ts) reflejan `RecordCreate`, `RecordOut`, `RecordPatch` y notas. La UI presenta etiquetas en español; los valores crudos se mantienen solo como valores de formulario/API. Las notas se cargan únicamente dentro del diálogo de detalle.
