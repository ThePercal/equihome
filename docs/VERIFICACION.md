# Verificación de entrega

Fecha de revisión: 15 de noviembre de 2026.

## Comprobaciones automáticas

- Compilación de 13 páginas HTML, incluida la 404.
- 323 enlaces, anclas y referencias a recursos locales comprobados.
- Un H1 y metadatos básicos por página.
- Ocho pruebas superadas: cinco de cálculo (incluidas 48 combinaciones) y tres de rutas portables.
- Casos de superficie fuera de rango o vacía, identificadores desconocidos, extras repetidos, modelo sin precio y superficie personalizada.
- IVA, transporte, instalación y total completo permanecen sin valor cuando no se pueden determinar.

## Comprobaciones en navegador

- Portada revisada a 1440 × 1000 y 390 × 844; ficha y preguntas frecuentes revisadas a 768 × 1024.
- Todas las rutas, incluida una URL inexistente, abiertas a ancho móvil sin desbordamiento horizontal.
- Menú móvil: apertura, cierre con Escape y estado accesible.
- Configurador: acabado Bosque, equipamiento Confort y todos los extras producen un subtotal de 47.300 € (hipótesis).
- Configuración trasladada a contacto, con desglose conservado.
- Cambio del modelo en contacto retira la configuración incompatible.
- Calculadora: superficie personalizada de 75 m² y valores inválidos muestran el estado correspondiente; restablecer devuelve la selección inicial.
- Formulario vacío señala los cuatro campos requeridos. Datos ficticios `Prueba Equihome` y `prueba@example.com` usados para probar descarga local.
- Solicitud descargada y aviso explícito de no envío. Archivo de prueba generado en Descargas por el navegador.
- Galería exterior/interior y controles de preguntas frecuentes comprobados.
- Sin errores ni advertencias de consola observados en los recorridos probados.
- Capturas de escritorio y móvil guardadas en esta carpeta.

## Corrección de apertura en Chrome / Live Server

Se reprodujeron dos fallos en Chrome: la raíz de Live Server mostraba el directorio en vez de la web y `/equihome/dist/` solicitaba estilos e imágenes en la raíz equivocada. Se añadieron entradas `index.html` en la carpeta de trabajo y en `equihome`, y se adaptaron HTML, CSS y JavaScript para resolver recursos y navegación dentro de la ubicación de la web.

Verificado en el Chrome del usuario, desde `http://127.0.0.1:5500/`: portada con estilos, fuente e imagen, navegación a ficha, cambio de imagen, configurador con subtotal de 42.000 € para Bosque + terraza, traslado de configuración a contacto y validación del formulario. Sin errores de consola observados. Captura: `chrome-corregido.jpg`.

Los tests de rutas cubren la raíz del dominio y `/equihome/dist/`, incluidos enlaces anidados, consultas, anclas y `srcset`. La 404 de producción conserva rutas absolutas porque puede servirse bajo cualquier URL inexistente; la respuesta 404 de Live Server la gestiona esa extensión.

## Rediseño visual y catálogo único

Reorganizadas todas las páginas sin añadir funciones: portada, catálogo, ficha, herramientas, páginas corporativas, contacto y legales. Nueva jerarquía tipográfica, espaciado, paleta y distribución adaptable. El catálogo, las opciones y los recursos publicados contienen únicamente Equi 60.

Revisado el rediseño en Chrome a 320, 390, 768, 1024 y 1440 píxeles. Ningún desbordamiento horizontal en los recorridos probados. Formulario de contacto priorizado en móvil; configurador comprobado con Bosque y terraza: 42.000 €. La ruta retirada devuelve 404 y la búsqueda de referencias al modelo retirado no encuentra coincidencias en el código ni en la publicación generada. Capturas: `redisenio-escritorio.jpg` y `redisenio-movil.jpg`.

## Límites y activación pendiente

No existe un backend real de solicitudes, por lo que no se ha probado recepción, correo o CRM. La integración está preparada y documentada; no se presenta como activa. Tampoco se han validado importes comerciales, prestaciones constructivas, datos fiscales o textos legales definitivos.

Las comprobaciones de accesibilidad son funcionales y estructurales; no equivalen a una auditoría WCAG completa ni a pruebas con todos los lectores de pantalla. Las pruebas se han realizado en Chrome y en el navegador integrado, no en una matriz completa de dispositivos físicos.

## Versión inglesa — 18 de noviembre de 2026

- 26 páginas: 13 españolas y sus 13 equivalentes inglesas, incluida la 404.
- Traducción de contenido, navegación, plano SVG, nombres accesibles, metadatos, formularios, mensajes, catálogo y archivos descargables.
- Selector ES/EN que conserva página, ancla y opciones de configuración válidas; sin cookies ni datos personales en los enlaces.
- EUR y cálculos idénticos en ambos idiomas; 48 combinaciones contrastadas con el catálogo español. Superficies personalizadas siguen sin precio calculado.
- Compilación con detección de traducciones estáticas ausentes; 702 enlaces y recursos comprobados; 15 tests superados.
- Revisión de las 13 páginas inglesas a 320 px: sin desbordamientos ni enlaces de contenido que regresen por error al español.
- Cambio EN → ES → EN con Bosque/Forest y terraza: subtotal conservado de 42.000 € / €42,000.
- Validación de campos vacíos en inglés y descarga de estimación y solicitud con texto inglés, usando datos ficticios de prueba. Los archivos se inspeccionaron; no hubo envío a ningún backend.
- Menú y galería ingleses verificados. Esta revisión se hizo en el navegador integrado; la conexión de Chrome no estaba disponible en esta sesión.
