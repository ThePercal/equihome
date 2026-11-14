# Decisiones de implementación

- **Proyecto inicial:** la carpeta estaba vacía, sin framework, dependencias ni funciones que conservar. El código se ha organizado en `equihome/`.
- **Arquitectura:** generador estático en Node.js y módulos ES del navegador. HTML real por ruta para accesibilidad, SEO y navegación sin un router cliente. No requiere bibliotecas de producción ni instalación de paquetes.
- **Interactividad:** mejora progresiva para menú móvil, galería, cálculo y formularios. Sin JavaScript se puede leer el catálogo y el contenido; las herramientas explican que lo necesitan.
- **Precios:** JSON centralizado y función pura de estimación compartida por configurador y calculadora. `null` significa desconocido. No hay IVA, logística ni costes de obra inventados. La superficie personalizada invalida el subtotal, sin extrapolaciones.
- **Alcance comercial:** Equi 60 configurable; Equi 85 con ficha y calculadora, pero sin precio base. Equipamiento, materiales y distribuciones se describen como propuestas, no características ya homologadas.
- **Formularios:** validación accesible y descarga honesta. Integración HTTP preparada, pero desactivada hasta contar con recepción real y datos legales completos. No se guardan datos en localStorage, cookies ni servidor.
- **Diseño:** blanco cálido, verde bosque, Manrope local y acentos tipográficos Georgia. Composición editorial, imágenes protagonistas y ausencia de efectos decorativos invasivos.
- **Recursos:** imágenes generadas para el proyecto, optimizadas a WebP con variantes responsive. Logotipo y esquemas SVG propios. Licencia OFL de Manrope incluida.
- **Publicación:** sitio privado en Sites, con archivos estáticos en `dist/`. La publicación privada permite revisión sin presentar esta versión como una oferta comercial pública validada.
- **Entorno:** el Node de Homebrew está roto por una librería de sistema ausente. Para construir y probar se ha usado el Node 24 existente en ChatGPT, sin alterar Homebrew ni el sistema.
