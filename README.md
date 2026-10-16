# 🌍 WWide Traveler — Countries List

Proyecto con el que aprendí **JavaScript**: una web estática que lista todos los
países del mundo consultando la API de REST Countries, con tarjetas que se
expanden para mostrar los detalles de cada país (capital, moneda, idiomas,
región, código telefónico y zona horaria).

Incluye además un **registro de usuario** con validación en vivo de los campos,
feedback visual (verde/rojo), notificaciones toast y SweetAlert, y persistencia
en `localStorage`.

> Proyecto nacido como entrega del curso de Desarrollo Web (CoderHouse).

---

## ✨ ¿Qué hace?

- **Listado de países** obtenido en vivo desde REST Countries (API v5), con
  paginación automática para cubrir el dataset completo.
- **Tarjetas con detalle desplegable**: hacé clic en *Details* para ver bandera,
  capital, monedas, idiomas, región, calling code y zonas horarias.
- **Navbar lateral** que se abre y cierra con animación.
- **Registro de cuenta** (`signup`) con validación campo por campo:
  - Usuario: 4–16 caracteres, sin símbolos.
  - Email con formato válido.
  - Contraseña con confirmación (deben coincidir).
  - Checkbox de términos obligatorio.
  - Los inputs se pintan de **verde o rojo** según el estado.
- **Persistencia local**: el usuario creado se guarda en `localStorage` y la
  interfaz se actualiza al recargar.
- **Feedback**: avisos con **Toastify** (al enfocar un campo, explica la regla) y
  **SweetAlert2** (al crear la cuenta).

---

## 🧱 Stack técnico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la página |
| JavaScript (ES6+) | Fetch a la API, validaciones, manipulación del DOM |
| SCSS | Estilos modulares (`scss/base` y `scss/components`) |
| Bootstrap 5.3 | Grid, utilidades y componentes (vía CDN) |
| REST Countries API v5 | Datos de los países |
| SweetAlert2 | Diálogos de confirmación (vía CDN) |
| Toastify | Notificaciones toast (vía CDN) |
| localStorage | Persistencia del usuario registrado |

No hay build step: el navegador lee `index.html` directo.

---

## ⚠️ Nota importante: la API cambió y requiere key

La versión original de este proyecto usaba `restcountries.com/v2/all`, que fue
**deprecada**: hoy responde con un error sin datos, por lo que la página dejaba
de cargar países.

El código fue **migrado a la API v5** (`api.restcountries.com`), que:

- exige una **API key** en el header `Authorization: Bearer <key>`;
- devuelve los países en `data.objects[]` (no en un array suelto);
- renombra y anida los campos (`names.common`, `capitals[].name`,
  `currencies[]`, `flag.url_svg`, `calling_codes[]`);
- pagina de a 100 países como máximo en el plan gratuito.

### Cómo conseguir y cargar tu key

1. Creá una cuenta gratuita en <https://restcountries.com/sign-up>.
2. Copiá tu key.
3. Pegala en `index.html`, en el bloque que está justo antes de los scripts:

```html
<script>
  window.COUNTRIES_API_KEY = "pegá_tu_key_acá";
</script>
```

> Para llamarla desde el navegador, la key debe tener permitido el origen desde
> donde cargás la página (agregalo en la sección *API Keys* de tu cuenta).
> Si corre desde `file://` o `localhost`, agregá ese origen.

---

## 📁 Estructura

```
Countries-List/
├── index.html              # Página única
├── js/
│   ├── main.js             # Fetch de países + tarjetas + paginación (API v5)
│   ├── sideNav.js          # Apertura/cierre del navbar lateral
│   └── signup.js           # Validación del registro + localStorage
├── scss/                   # Fuentes SCSS
│   ├── base/_general.scss  # Reset y layout base
│   └── components/         # Estilos del navbar, main y formulario
├── css/
│   ├── style.css           # CSS compilado (el que usa el HTML)
│   └── style.css.map
└── assets/                 # Imágenes de ejemplo e íconos del navbar
```

---

## 🚀 Clonar y preparar

Requisitos: **git** y un navegador. Nada más.

```bash
# 1. Clonar
git clone https://github.com/EzequieLakodey/Countries-List.git
cd Countries-List

# 2. Cargar tu API key en index.html (ver sección anterior)

# 3. Abrir
xdg-open index.html        # Linux
# open index.html          # macOS
```

Como la API key debe estar permitida para tu origen, lo más cómodo es servir la
página en lugar de abrir el archivo suelto:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

### Editar los estilos (SCSS → CSS)

El HTML usa `css/style.css`, que está compilado. Si tocás el SCSS, recompilalo:

```bash
npm install -g sass
sass scss/style.scss css/style.css
sass --watch scss/style.scss css/style.css
```

---

## 🗺️ Roadmap / ideas futuras

- [ ] Paginación o scroll infinito visible en la UI (hoy se cargan solos los
      países al fondo).
- [ ] Buscador de países por nombre.
- [ ] Mover la API key a un `.env` o a un backend/proxy para no exponerla.
- [ ] Login real (hoy solo registro con `localStorage`).
- [ ] Filtros por región/continente.

---

## 📄 Licencia

Sin licencia definida todavía. Uso educativo / portfolio personal.
