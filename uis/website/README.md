# TrackFlow — Sitio Web Público

Este directorio contiene el **sitio web corporativo** de **TrackFlow**, operador logístico con presencia en Estados Unidos y España.

## Estructura de archivos

```
uis/website/
├── index.html         # Landing page principal
├── application.html   # Formulario de solicitud de información
├── styles.css         # Estilos complementarios a Tailwind CSS
├── validation.js      # Validación completa del formulario
└── README.md          # Esta documentación
```

## Tecnologías utilizadas

| Tecnología                | Propósito                                               |
| ------------------------- | ------------------------------------------------------- |
| **HTML5**                 | Estructura semántica con Schema.org, Open Graph y ARIA  |
| **Tailwind CSS** (CDN v3) | Framework de utilidades CSS responsive                  |
| **CSS**                   | Ajustes complementarios (estados de error, animaciones) |
| **JavaScript** (vanilla)  | Validación del formulario en tiempo real                |

## Cómo visualizar el sitio

Dado que es HTML plano sin servidor, puedes abrir los archivos directamente en el navegador o servirlos con un entorno local:

```bash
# Opción 1: Python (recomendada)
python3 -m http.server 8000 -d /ruta/a/uis/website

# Opción 2: VS Code Live Server
# Instala la extensión "Live Server" y haz clic derecho en index.html → "Open with Live Server"
```

Abre [http://localhost:8000](http://localhost:8000) para ver la landing page y navega a `application.html` desde el botón "Solicitar información".

## Funcionalidades

### Landing page (`index.html`)

- **Header** con navegación responsive, logo y enlace al formulario
- **Hero** con propuesta de valor y CTA
- **Servicios** (3 columnas): Gestión de Almacenes, Última Milla, Logística Inversa
- **Cobertura** (2 columnas): Estados Unidos y España
- **Por qué TrackFlow** (4 beneficios en grid)
- **Contacto** con email y teléfonos
- **Footer** profesional con navegación y LinkedIn
- Menú móvil con toggle para dispositivos pequeños
- Datos estructurados Schema.org (JSON-LD) para SEO
- Atributos `data-i18n` preparados para internacionalización futura

### Formulario (`application.html`)

- **Fieldset 1 — Datos de la empresa:** razón social, CIF/NIF, email, teléfono, web, país de operación
- **Fieldset 2 — Datos del producto:** tipo de producto, volumen mensual estimado, servicios de interés (checkboxes)
- **Fieldset 3 — Información adicional:** texto libre y aceptación de privacidad
- Botón de envío y botón de limpiar formulario
- Enlace de vuelta a la landing page

### Validación (`validation.js`)

- Validación por campo al perder el foco (`blur`)
- Validación en tiempo real tras el primer intento (`input` / `change`)
- Mensajes de error específicos y estilizados para cada campo
- Prevención del envío si hay errores
- Simulación de éxito con toast notification
- Soporte para CIF/NIF/nie español, email (RFC 5322), teléfono internacional y URL
- Foco automático en el primer campo erróneo

## Accesibilidad

- Etiquetas `<label>` asociadas a cada input
- Atributos `aria-label`, `aria-labelledby`, `aria-current`, `role`, `aria-expanded`
- Roles semánticos: `banner`, `navigation`, `main`, `contentinfo`, `alert`
- Estados de foco visibles con `focus:ring-*`
- Contraste suficiente entre texto y fondo
- `prefers-reduced-motion` para usuarios que prefieren menos animaciones
- Estilos de impresión

## SEO

- Meta tags (`description`, `keywords`, `og:*`)
- Datos estructurados Schema.org `Organization` con dirección y contacto
- Encabezados jerárquicos (`h1` → `h2` → `h3`)
- Atributos `lang` en el idioma base (español)
- Interfaz disponible en español; no muestra un selector de idioma sin traducciones implementadas

## Próximos pasos (mejora continua)

- [ ] Implementar lógica de cambio de idioma (ES/EN)
- [ ] Conectar formulario a un backend (FastAPI en `services/`)
- [ ] Añadir página "Gracias" post-envío
- [ ] Integrar analytics (GA4)
- [ ] Añadir más páginas: "Sobre nosotros", "Casos de éxito"
