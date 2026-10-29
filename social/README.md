# Redes sociales — Especialista en Adicciones UY

Contenido para Instagram de [@especialistaenadiccionesuy](https://www.instagram.com/especialistaenadiccionesuy/).
Misma identidad que la web (oscuro + dorado, cerebro line-art, tipografías Fraunces + Inter).

## Qué hay acá

- **`build.js`** — genera un HTML por pieza (tamaño exacto) en `pages/`.
- **`out/`** — las imágenes finales en PNG, listas para subir.
- **`CONTENIDO.md`** — textos (captions), hashtags y el calendario de publicación.
- **`calendario.html`** — calendario visual (se publica como página).

## Cómo regenerar las imágenes

```bash
node build.js        # crea los HTML en pages/
```

Luego se renderiza cada HTML a PNG con Chrome headless (tamaño de ventana = tamaño de la pieza):

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --default-background-color=ff0c1210 \
  --window-size=1080,1350 --virtual-time-budget=6000 \
  --screenshot="out/ID.png" "file:///.../pages/ID.html"
```

Feed: **1080×1350** · Historias: **1080×1920**.

## Piezas (36)

- **24 de feed** (incluye el carrusel de 5 slides "4 mitos") — `01`…`23` + `10-c1`…`10-c5`.
- **12 de historias** — `s1`…`s9`.

## Datos fijos

- WhatsApp: **093 633 633** · `wa.me/59893633633`
- Web: **especialistaenadicciones.uy**
- Servicios: psicología individual / familiar / empresas (presencial u online) y psiquiatría (solo online, con receta).
- Embudo: redes → terapia individual → internación en **Creavida** (como escalón de cuidado).
