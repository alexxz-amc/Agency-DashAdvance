# DashAdvance — Web

Web institucional de **DashAdvance**, agencia digital especializada en rent a cars de Gran Canaria.

Sitio estático en HTML, CSS y JavaScript vanilla. Sin build, sin dependencias.

---

## Estructura

```
index.html      — Página principal con todas las secciones
styles.css      — Hoja de estilos completa
script.js       — Header sticky, FAQ, scroll reveal, WhatsApp float
favicon.svg     — Favicon del sitio
```

---

## Cómo ver la web en local

Abre `index.html` directamente en el navegador, o usa un servidor local:

```bash
python3 -m http.server 8000
```

Y visita http://localhost:8000

---

## Despliegue en GitHub Pages

1. Sube los archivos al repositorio (raíz del repo).
2. **Settings → Pages**.
3. Source: `Deploy from a branch`, branch: `main`, carpeta: `/ (root)`.
4. Save. En 1-2 minutos tendrás la URL pública.

---

## Antes de publicar — placeholders pendientes

Hay marcadores que deben sustituirse antes de ir a producción. Buscar y reemplazar en `index.html`:

| Placeholder | Qué poner |
|-------------|-----------|
| `[Nombre 1]` y `[Nombre 2]` | Nombres reales de los socios |
| `N1`, `N2` (en `<div class="avatar">` y `<div class="portrait-circle">`) | Iniciales reales o sustituir por `<img>` con foto |
| `href="#"` en botones de WhatsApp | `https://wa.me/34XXXXXXXXX` con número real |
| `href="#"` en botones "Reservar llamada" / "Solicitar auditoría" | URL de Calendly o formulario |
| `hola@dashadvance.es` | Email real cuando esté configurado |

---

## Personalización

Toda la paleta y tipografía vive en `:root` dentro de `styles.css`:

```css
:root {
  --ink: #0A0A0B;          /* Fondo principal */
  --accent: #F4B400;        /* Amarillo DashAdvance */
  --accent-blue: #3B5BA9;   /* Azul secundario */
  --display: 'Instrument Serif', serif;
  --sans: 'Inter Tight', sans-serif;
}
```

---

© 2026 DashAdvance · Todos los derechos reservados.
