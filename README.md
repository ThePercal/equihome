# Equihome

Web corporativa y comercial multipágina en español, con catálogo de Equi 60, ficha, configurador de Equi 60, calculadora independiente y preparación de solicitudes.

## Ejecutar

### Con Live Server en VS Code

Abre `index.html` de la carpeta `Web_EquiHome` con Live Server. La entrada conduce a `equihome/dist/`; también funciona si abres la carpeta `equihome` y su `index.html`. Los estilos, imágenes, fuentes, enlaces, galerías y cálculos resuelven sus rutas dentro de esa carpeta.

Después de modificar el código fuente, ejecuta la compilación indicada abajo. Live Server muestra los archivos ya generados de `dist/`; no compila `src/` por sí solo. El servidor de desarrollo de Node sí recompila automáticamente.

### Con Node.js

Necesita Node.js 22 o posterior. No hay dependencias que instalar.

```sh
cd equihome
npm run dev
```

Abre `http://127.0.0.1:4173`. Los cambios en `src/` y `public/` reconstruyen la web; recarga el navegador para verlos.

```sh
npm test         # pruebas de precios y combinaciones
npm run build   # genera dist/
npm run check   # valida páginas, enlaces, anclas y recursos
```

En esta máquina el Node de Homebrew no arranca por una librería `llhttp` ausente. Se ha utilizado el Node 24 ya incluido en ChatGPT, sin modificar la instalación del sistema:

```sh
/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node scripts/dev.mjs
/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node --test tests/*.test.mjs
```

También puedes servir `dist/` con cualquier servidor estático que resuelva carpetas a `index.html` y use `404.html` para URLs inexistentes. No abras los HTML con `file://`: los módulos y el catálogo necesitan HTTP.

## Estructura

```text
src/
  components/       # estructura, marca, tarjetas, formularios, esquemas
  pages/            # inicio, catálogo, fichas, herramientas y contenido
  data/catalog.json # modelos, precios, suplementos y configuración
  lib/pricing.mjs   # cálculo puro compartido con los tests
  app.js            # menú, galerías, estimaciones y formularios
  styles/main.css   # identidad visual y adaptación responsive
public/
  images/           # visualizaciones WebP de 640, 1280 y 1920 px
  fonts/            # Manrope local y licencia OFL
scripts/            # compilación, servidor de desarrollo y verificación
tests/              # casos de cálculo
docs/               # decisiones, imágenes, backend y verificación
dist/               # web generada lista para alojamiento estático
.openai/hosting.json # identidad del sitio y configuración de despliegue
```

## Cambiar modelos y precios

Edita `src/data/catalog.json` y vuelve a compilar. `models` contiene nombre, superficie, distribución, imagen y precio base. Un precio desconocido debe ser `null`, nunca cero. Los suplementos viven en `finishes`, `equipment` y `extras`. El cálculo está en `src/lib/pricing.mjs`.

El precio de 36.000 € de Equi 60 procede del encargo y es una hipótesis comercial. Los suplementos son valores ilustrativos editables, también pendientes de validación. Las superficies personalizadas necesitan estudio y no se extrapolan por €/m². El subtotal de vivienda nunca se presenta como coste total del proyecto. Transporte, instalación e IVA permanecen sin determinar.

La presentación de Equi 60 está en `src/pages/catalog.mjs`, la portada en `src/pages/home.mjs` y su esquema conceptual en `src/components/floorplan.mjs`. El catálogo actual tiene un solo modelo.

## Cambiar imágenes

Sustituye los archivos de `public/images/` manteniendo el nombre y las tres variantes de tamaño, o actualiza `image` en el catálogo. El componente `picture()` de `src/components/shared.mjs` genera `srcset` y carga diferida. La portada usa carga prioritaria. Consulta `docs/IMAGENES.md` para la procedencia y los prompts.

Las imágenes generadas son ilustrativas; los esquemas SVG no son planos técnicos. Sustitúyelos por fotografías y planos propios validados cuando estén disponibles.

## Formularios y backend

Por defecto `contactEndpoint` es `null`. No se envía información, ni se simula una recepción. El usuario valida y descarga un archivo de texto en su dispositivo. La configuración seleccionada pasa a contacto mediante parámetros sin datos personales.

Para activar solicitudes reales necesitas un backend de recepción y la información legal corporativa completa. El contrato de integración está en `docs/BACKEND.md`. No basta con cambiar el texto del botón.

## SEO, accesibilidad y privacidad

HTML completo generado para cada URL, títulos y descripciones propios, Open Graph, canonical, sitemap, robots, 404, etiquetas semánticas, enlace de salto, foco visible, controles nativos, errores accesibles y reducción de movimiento. `siteUrl` define el dominio canónico. La tipografía y las imágenes se sirven localmente, sin llamadas externas de analítica ni cookies del frontend.

El aviso legal y la privacidad están preparados como estructura pendiente de validación. No se han inventado CIF, domicilio, teléfono, equipo, proyectos ejecutados, certificaciones ni testimonios.

Las decisiones y el alcance de las pruebas se documentan en `docs/DECISIONES.md` y `docs/VERIFICACION.md`.
