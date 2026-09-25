# 🧩 Sistema de Prompt Maestro — Creación de Páginas Web

> **Instrucción:** Este documento es un sistema modular. Para cada proyecto nuevo,
> copiá el **BLOQUE BASE** + la **PLANTILLA del rubro** que corresponda, completá
> los campos `[COMPLETAR]` y pegalo al inicio de tu conversación con la IA.

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PARTE 1: BLOQUE BASE (copiar SIEMPRE)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
============================================================
BLOQUE BASE — REGLAS UNIVERSALES PARA TODA PÁGINA WEB
============================================================

Este bloque define las reglas obligatorias de diseño, responsividad,
accesibilidad, arquitectura, SEO y tono que deben aplicarse en TODOS
los proyectos web, independientemente del rubro.

La IA debe seguir estas reglas al pie de la letra.
Si alguna regla del bloque base entra en conflicto con la plantilla
del rubro, la plantilla del rubro tiene prioridad.


== DATOS DEL PROYECTO ==

- Nombre: [COMPLETAR]
- Descripción: [COMPLETAR]
- Público objetivo: [COMPLETAR]
- Ubicación / País: [COMPLETAR]
- Stack: React o Next.js + Tailwind CSS v4
- Idioma del contenido: español rioplatense


== REGLA #1: VIEWPORT Y ANTI-OVERFLOW (CRÍTICA) ==

Esta regla es OBLIGATORIA. Ningún elemento de la página puede salirse
de la pantalla visible ni generar scroll horizontal no deseado.

Aplicar siempre:

1. En el CSS global o layout raíz:

   html, body {
     overflow-x: hidden;
     max-width: 100vw;
   }

2. Todos los contenedores principales deben usar:

   max-width: 100%;
   overflow: hidden; /* o overflow: auto si necesita scroll interno */

3. Las imágenes SIEMPRE deben tener:

   max-width: 100%;
   height: auto;
   object-fit: cover; /* o contain según el caso */

4. Los botones y CTAs nunca deben tener un ancho fijo en píxeles
   que pueda exceder el ancho de pantalla. Usar:

   width: 100%; /* en mobile */
   max-width: [valor]; /* en desktop */
   o usar clases de Tailwind como w-full sm:w-auto

5. Todo texto largo debe tener:

   overflow-wrap: break-word;
   word-break: break-word;

6. Los contenedores flex y grid deben usar:

   min-width: 0; /* para evitar que hijos desborden */

7. En mobile, ningún elemento debe tener:
   - padding horizontal mayor a 1rem (16px) por lado.
   - margin negativo que empuje contenido fuera del viewport.
   - position: absolute o fixed que lo posicione fuera de pantalla.

8. Probar mentalmente cada sección en estos anchos:
   - 320px (móvil pequeño)
   - 375px (móvil estándar)
   - 768px (tablet)
   - 1024px (laptop)
   - 1440px (desktop)

9. Si se usa una grilla de productos o tarjetas, en 320px debe
   colapsar a una sola columna. No forzar dos columnas si no caben.

10. Los modales, drawers y menús deben respetar el viewport:
    max-height: 100vh o 100dvh.
    max-width: 100vw.
    Si el contenido excede, usar scroll interno.

NO generar un layout que se vea bien solo en 1440px y se rompa en
pantallas más chicas. Mobile-first significa construir primero para
320–375px y expandir hacia arriba.


== REGLA #2: DISEÑO RESPONSIVO (MOBILE-FIRST) ==

Priorizá mobile-first en toda la construcción.

En pantallas pequeñas (< 640px):

- Menú hamburguesa accesible (con aria-expanded y cierre con Escape).
- Grilla de productos: 1 columna en 320px, 2 columnas desde 400px.
- Botones con área táctil mínima de 44 × 44 px.
- Textos legibles: mínimo 16px para cuerpo, mínimo 14px para labels.
- Filtros y ordenamiento en drawer o modal, no inline.
- CTAs principales visibles sin necesidad de hacer scroll largo.
- Barras fijas (sticky headers, botones flotantes) NO deben tapar
  contenido importante ni otros botones.
- Imágenes hero: reducir altura, asegurar que el texto sea legible.
- Formularios: campos a ancho completo, labels siempre visibles.

En tablet (640px – 1024px):

- Grilla de 2–3 columnas.
- Sidebar opcional.
- Navegación puede ser visible o hamburguesa según la cantidad de ítems.

En desktop (> 1024px):

- Grilla de 3–4 columnas para productos.
- Navegación completa visible en el header.
- Sidebar de filtros visible.
- Contenido principal con max-width (1280px o 1440px) centrado.
- Hover states activos.


== REGLA #3: ACCESIBILIDAD (WCAG 2.2 NIVEL AA) ==

Obligatorio en toda la interfaz:

- HTML semántico: <header>, <nav>, <main>, <section>, <footer>, <article>.
- lang="es" en el <html>.
- Jerarquía correcta de headings: un solo H1 por página, sin saltar niveles.
- Texto alternativo descriptivo en TODAS las imágenes (no "imagen1.jpg").
- Botones y enlaces nativos, NO divs con onClick.
- Estados de foco visibles (:focus-visible con outline claro).
- Navegación completa con teclado (Tab, Enter, Escape, flechas).
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
- Labels visibles en TODOS los campos de formulario (no solo placeholder).
- aria-label en íconos sin texto visible.
- aria-live para cambios dinámicos (toasts, contadores, resultados de filtro).
- No depender exclusivamente del color para comunicar estados.
- Targets táctiles de al menos 44 × 44 px.
- Modales y drawers: cerrar con Escape, trampa de foco controlada, restaurar foco al cerrar.
- prefers-reduced-motion: reducir o desactivar animaciones.
- Contenido legible con zoom al 200%.
- Enlace "Saltar al contenido principal" al inicio si la navegación es larga.
- Tablas y listas: usar elementos semánticos, no simular con divs.


== REGLA #4: MICROINTERACCIONES Y MOTION ==

Usar animaciones sutiles y funcionales, nunca decorativas.

- Hover suave en tarjetas y botones (opacity, translateY leve, sombra).
- Cambio de imagen en hover si existe segunda imagen.
- Escala muy leve al presionar botones (scale 0.98, no más).
- Entrada suave de drawers, modales y toasts.
- Toast de confirmación al agregar producto / enviar formulario.
- Skeletons o shimmer para estados de carga.
- Transiciones entre estados (vacío, cargando, error, éxito).

Valores obligatorios:

- ease-out para entradas.
- Duración: 150–250ms para interacciones comunes.
- Máximo 300ms para controles frecuentes (botones, filtros).
- Respetar prefers-reduced-motion: media query obligatorio.

Prohibido:

- Rebotes exagerados.
- Animaciones de más de 500ms en controles de uso frecuente.
- Elementos que "flotan" sin propósito.
- Parallax agresivo que dificulte la lectura.
- Animaciones que se activan en loop infinito.


== REGLA #5: ARQUITECTURA TÉCNICA ==

Stack obligatorio:

- React o Next.js.
- Tailwind CSS v4.
- Componentes reutilizables y modulares.
- Datos separados de la interfaz (archivos JSON, objetos de config).
- Variables de diseño mediante tokens CSS / theme config de Tailwind.
- Estado local para filtros, carrito, menú mobile, formularios.

Design tokens obligatorios:

- Colores (primario, secundario, acento, fondo, texto, error, éxito).
- Tipografía (familias, tamaños, pesos, line-heights).
- Espaciado (escala consistente: 4, 8, 12, 16, 24, 32, 48, 64, 96).
- Border-radius (valores consistentes, no diferentes en cada componente).
- Sombras (escala de 3 niveles: sm, md, lg).
- Transiciones (duración y easing estándar).
- Estados: hover, focus, active, disabled, loading, error, success, empty.

No hardcodear estilos diferentes para cada componente cuando pueden
resolverse con tokens compartidos.

Código organizado, limpio, mantenible y preparado para conectar
posteriormente con APIs, CMS o plataformas de backend.


== REGLA #6: SEO BÁSICO ==

Incluir siempre:

- <title> descriptivo y único por página.
- <meta name="description"> con texto natural y útil.
- Un solo H1 por página.
- URLs amigables y legibles (/productos, /nosotros, no /page?id=3).
- alt descriptivo en imágenes (no vacío ni genérico).
- Open Graph básico (og:title, og:description, og:image).
- Datos estructurados (schema.org) cuando corresponda:
  - Product para ecommerce.
  - LocalBusiness para negocios locales.
  - Organization para agencias/empresas.
- Contenido en español rioplatense, natural y legible.
- No sobreoptimizar con keywords forzadas.


== REGLA #7: TONO DE COMUNICACIÓN ==

Escribir en español rioplatense.

Tono general:

- Cercano y natural.
- Directo y claro.
- Profesional sin ser corporativo.
- Confiable.
- Sin exageraciones.
- Sin abuso de signos de exclamación.
- Sin falsa urgencia ("¡Solo quedan 2!" si no es real).
- Sin frases vacías ("una experiencia única", "llevamos al siguiente nivel").
- Sin datos, reseñas, cifras o testimonios inventados.

Si no hay testimonios reales, NO inventarlos. Reemplazar por:
FAQ, beneficios, proceso de trabajo, o dejar la sección preparada.

Si no hay fotografías reales, usar placeholders CLARAMENTE MARCADOS
como "[IMAGEN PENDIENTE DE AGREGAR]" y no generar imágenes ficticias
presentadas como reales.


== REGLA #8: FORMULARIOS ==

Todo formulario debe incluir:

- Labels visibles (NO depender solo del placeholder).
- Placeholders útiles como guía, no como reemplazo del label.
- Validación inline con mensajes de error claros y específicos.
- Estado de campo vacío / requerido.
- Estado de dato inválido (email mal formado, etc.).
- Estado de envío exitoso con mensaje de confirmación.
- Estado de error de envío con opción de reintentar.
- Botón de envío deshabilitado durante el envío (prevenir doble submit).
- Indicación visual del campo que tiene error.

Los mensajes de error deben explicar QUÉ está mal y CÓMO corregirlo.
Ejemplo correcto: "Ingresá un email válido, como nombre@ejemplo.com"
Ejemplo incorrecto: "Error en el campo"


== REGLA #9: ESTADOS DE LA INTERFAZ ==

Toda vista que muestre datos debe contemplar estos 5 estados:

1. CARGANDO: Skeleton o shimmer, nunca pantalla en blanco.
2. VACÍO: Mensaje claro + acción sugerida ("No hay productos. Explorá el catálogo").
3. ÉXITO: Datos mostrados correctamente.
4. ERROR: Mensaje descriptivo + opción de reintentar.
5. SIN RESULTADOS (filtros): "No encontramos productos con esos filtros" + botón para limpiar.

Los toasts de confirmación deben desaparecer solos después de 3–5 segundos
pero también poder cerrarse manualmente.


== REGLA #10: PALETA Y TIPOGRAFÍA (SI NO SE PROPORCIONAN) ==

Si el usuario no especifica colores ni tipografía, la IA debe:

1. Proponer una paleta inicial coherente con el rubro.
2. Usar máximo 2 familias tipográficas:
   - Display: con personalidad, para títulos.
   - Sans serif: legible, para cuerpo, navegación, botones, precios.
3. No usar SOLAMENTE Inter u otra tipografía genérica sin carácter.
4. Evitar gradientes genéricos, sombras excesivas y bordes
   redondeados iguales en todos los elementos.
5. La paleta debe tener suficiente contraste (verificar WCAG AA).


== INSTRUCCIONES ESPECIALES PARA LA IA ==

Al generar código para cualquier proyecto basado en este documento:

1.  NUNCA generar un layout que se desborde de la pantalla.
    Verificar overflow en 320px antes de dar el código por terminado.

2.  Seguir el stack definido (React/Next.js + Tailwind v4).
    No proponer alternativas sin pedir confirmación.

3.  Separar datos de la interfaz. Los productos, servicios y textos
    deben estar en archivos/objetos de configuración, no hardcodeados
    dentro de los componentes JSX.

4.  Mobile-first REAL. Escribir primero los estilos base para mobile
    y usar breakpoints para ampliar, no al revés.

5.  Componentes reutilizables. Si un patrón se repite (cards, botones,
    inputs), crear un componente genérico con props.

6.  No inventar datos. Si no hay testimonios, clientes, precios,
    métricas o fotografías reales, usar placeholders editables
    y dejar comentarios indicando qué debe reemplazarse.

7.  Comentarios en español para facilitar la comprensión.

8.  Accesibilidad no negociable. Cada componente debe ser navigable
    con teclado, tener contraste suficiente y usar HTML semántico.

9.  Probar mentalmente cada sección en viewport de 320px, 375px,
    768px, 1024px y 1440px antes de finalizar.

10. No usar posicionamiento absoluto o fijo que empuje elementos
    fuera del viewport. Si es necesario un fixed/absolute, contenerlo
    dentro de un parent con overflow controlado.

11. Los CTAs principales deben ser visibles y accesibles
    sin necesidad de scroll excesivo en mobile.

12. Todo color de fondo + texto debe pasar contraste 4.5:1 mínimo.

13. Antes de agregar un paquete o librería nueva, explicar por qué
    es necesaria y pedir confirmación.

14. Generar el código completo, funcional y listo para ejecutar.
    No dejar secciones incompletas con "// TODO" salvo los
    placeholders de datos reales.

15. Al finalizar, incluir un breve listado de supuestos realizados
    y una checklist de accesibilidad, responsive, UX, SEO y conversión.

============================================================
FIN DEL BLOQUE BASE
============================================================
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PARTE 2: PLANTILLAS POR RUBRO (copiar UNA según el proyecto)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🛍️ PLANTILLA A: Tienda Online / Ecommerce

> **Cuándo usarla:** Tiendas de ropa, accesorios, electrónica, artesanías,
> o cualquier negocio que venda productos físicos o digitales online.

```
============================================================
PLANTILLA DE RUBRO: TIENDA ONLINE
============================================================
(Pegar DESPUÉS del Bloque Base)

== DATOS ESPECÍFICOS ==

- Nombre de la marca: [COMPLETAR]
- Tipo de productos: [COMPLETAR: ropa, accesorios, electrónica, etc.]
- Público objetivo: [COMPLETAR]
- Moneda y país: [COMPLETAR]
- Envío gratis desde: $[COMPLETAR] (o "no aplica")

== DIRECCIÓN VISUAL ==

Estética: urbana, contemporánea, aspiracional, premium pero accesible.
Inspiración: editorial, streetwear, moda independiente.
Protagonismo para las fotografías de producto.
No utilizar un diseño genérico de ecommerce.

Paleta:
- Principal: [COLOR o "proponer"]
- Secundario: [COLOR o "proponer"]
- Fondo: [COLOR o "proponer"]
- Texto: [COLOR o "proponer"]
- Acento (botones/promos): [COLOR o "proponer"]

Si no se proporcionan, usar: negro carbón, marfil, gris piedra,
acento terracota/verde oliva/azul profundo.

== ESTRUCTURA DE LA HOMEPAGE ==

1.  Barra de anuncio (envíos, cuotas, envío gratis).
2.  Header sticky (logo, nav, búsqueda, cuenta, favoritos, carrito).
3.  Hero editorial con CTA "Comprar colección" + "Ver novedades".
4.  Categorías destacadas (3–5 tarjetas visuales).
5.  Productos destacados (grilla 4–8 con card completa).
6.  Propuesta de valor (4 beneficios con íconos).
7.  Sección editorial de marca (historia + imagen asimétrica).
8.  Testimonios (solo reales) o contenido alternativo.
9.  Newsletter (con validación de estados).
10. Footer completo.

== PÁGINAS ADICIONALES ==

- Catálogo: grilla + filtros (categoría, talle, color, precio, orden).
- Detalle de producto: galería, selectores, talle, color, cantidad,
  CTA agregar/comprar, info envíos, tabla medidas, relacionados.
- Carrito: lateral o página, subtotal, envío, cupón, progreso envío gratis.

== PRODUCTO CARD DEBE INCLUIR ==

- Imagen principal (+ segunda en hover si existe).
- Nombre del producto.
- Precio actual.
- Precio anterior SOLO si hay rebaja real.
- Descuento SOLO si es real.
- Swatches de color accesibles.
- Etiquetas ("Nuevo", "Más vendido") SOLO si son datos reales.
- Botón agregar al carrito.
- Botón favoritos.
- Todo visible y tocable en mobile.

== EJEMPLO DE PRODUCTOS (DEMOSTRATIVOS) ==

- Casaca Essential Black
- Campera Utility Olive
- Buzo Heavyweight Cream
- Remera Boxy Logo
- Pantalón Relaxed Cargo

(Indicar que son datos de ejemplo reemplazables)

============================================================
```

---

## 🥐 PLANTILLA B: Gastronomía (Panadería / Café / Restaurante)

> **Cuándo usarla:** Panaderías, cafeterías, restaurantes, heladerías,
> vinotecas, catering, o cualquier negocio gastronómico.

```
============================================================
PLANTILLA DE RUBRO: GASTRONOMÍA
============================================================
(Pegar DESPUÉS del Bloque Base)

== DATOS ESPECÍFICOS ==

- Nombre del negocio: [COMPLETAR]
- Tipo de negocio: [panadería / café / restaurante / etc.]
- Productos principales: [COMPLETAR]
- Público objetivo: [COMPLETAR]
- Ciudad / Ubicación: [COMPLETAR]
- Horarios: [COMPLETAR o "pendiente"]
- WhatsApp: [COMPLETAR o "pendiente"]
- ¿Ofrece envíos?: [sí/no/zona limitada]
- ¿Tiene pedidos por encargo?: [sí/no]

== DIRECCIÓN VISUAL ==

Estética: cálida, artesanal, contemporánea, apetitosa, confiable.
Sensación de producto recién hecho, cercanía de barrio.
Inspiración: panaderías modernas, marcas gastronómicas cuidadas.
Protagonismo para fotografías reales de productos terminados.

Paleta:
- Principal: [COLOR o "proponer"]
- Secundario: [COLOR o "proponer"]
- Fondo: [COLOR o "proponer"]
- Texto: [COLOR o "proponer"]
- Acento: [COLOR o "proponer"]

Si no se proporcionan, usar: crema/marfil (fondo), marrón cacao (principal),
terracota/caramelo (acento), verde oliva suave (secundario).

== ESTRUCTURA DE LA HOMEPAGE ==

1.  Barra de info (horarios, envíos, pedidos, retiro).
2.  Header sticky (logo, nav, búsqueda, carrito, CTA "Hacer pedido").
3.  Hero apetitoso con CTA "Ver productos" + "Cómo encontrarnos".
4.  Categorías (4–6: panes, facturas, tortas, pastelería, café, especiales).
5.  Productos destacados (grilla 6–10, con unidad de venta).
6.  Propuesta de valor (elaboración diaria, ingredientes, pedidos fáciles).
7.  Nuestra historia (texto cálido + imagen editorial del local/equipo).
8.  Proceso de elaboración (3–4 pasos visuales).
9.  Tortas y pedidos especiales (con CTA de consulta).
10. Menú de café (o sección alternativa según el negocio).
11. Reseñas (solo reales) o contenido alternativo.
12. Galería / Instagram.
13. Newsletter.
14. Info del local (dirección, horarios, mapa, WhatsApp).
15. Footer completo.

== PÁGINAS ADICIONALES ==

- Catálogo: grilla + filtros (categoría, tipo, precio, disponibilidad).
- Detalle: galería, ingredientes, alérgenos, conservación, cantidad,
  variantes, fecha de retiro, observaciones, CTA agregar/consultar WhatsApp.
- Carrito/Pedido: retiro o envío, fecha, franja horaria, observaciones.
- Formulario de pedidos especiales (tortas, eventos, catering).

== PRODUCTO CARD DEBE INCLUIR ==

- Imagen.
- Nombre.
- Descripción breve.
- Precio + unidad de venta (unidad, docena, kilo, porción, caja).
- Disponibilidad o "por encargo".
- Etiquetas SOLO si son reales ("Sin TACC", "Nuevo", "Favorito").
- CTA agregar o consultar.

== REGLA ESPECIAL: ALÉRGENOS ==

La información de alérgenos debe mostrarse de forma visible y accesible.
No depender de un tooltip. No inventar información nutricional ni
certificaciones si no fueron proporcionadas.

== EJEMPLO DE PRODUCTOS (DEMOSTRATIVOS) ==

- Pan de campo
- Focaccia de romero
- Croissant de manteca
- Medialuna clásica
- Budín de limón
- Torta de chocolate
- Cheesecake de frutos rojos
- Caja de desayuno

============================================================
```

---

## 📣 PLANTILLA C: Agencia / Servicios Profesionales

> **Cuándo usarla:** Agencias de marketing, estudios de diseño, consultoras,
> profesionales independientes, empresas de servicios B2B.

```
============================================================
PLANTILLA DE RUBRO: AGENCIA / SERVICIOS PROFESIONALES
============================================================
(Pegar DESPUÉS del Bloque Base)

== DATOS ESPECÍFICOS ==

- Nombre: [COMPLETAR]
- Tipo: [agencia de marketing / estudio de diseño / consultora / etc.]
- Servicios principales: [COMPLETAR]
- Lema: [COMPLETAR o "proponer"]
- Ubicación: [COMPLETAR]
- Instagram: [COMPLETAR]
- WhatsApp: [COMPLETAR]
- Pertenece a: [grupo empresario / independiente]

== DIRECCIÓN VISUAL ==

Estética: moderna, estratégica, creativa, digital, profesional.
Dinámica pero no infantil. Cercana y orientada a resultados.
Personalidad visual fuerte y reconocible.
No diseñar una agencia genérica con gradientes y frases vacías.

Paleta:
- Principal: [COLOR o "proponer"]
- Secundario: [COLOR o "proponer"]
- Fondo: [COLOR o "proponer"]
- Texto: [COLOR o "proponer"]
- Acento: [COLOR o "proponer"]
- CTA WhatsApp: verde WhatsApp o variante con buen contraste.

Si no se proporcionan, usar: negro carbón/azul noche, blanco/gris claro,
un eléctrico (verde lima/violeta/naranja), un secundario suave.

== ESTRUCTURA DE LA HOMEPAGE ==

1.  Barra de contacto (descripción + WhatsApp).
2.  Header sticky (logo, nav, CTA "Hablemos de tu negocio", WhatsApp).
3.  Hero de impacto con propuesta clara + CTA principal + secundario.
4.  Franja de propuesta de valor sintética.
5.  Sección de problema (situaciones comunes del cliente).
6.  Servicios principales (tarjetas o bloques, cada uno con CTA propio).
7.  Ecosistema digital (diagrama/flujo de cómo se conecta todo).
8.  Principios de trabajo ("No hacemos humo" o equivalente).
9.  Sección destacada del servicio principal (ej: páginas web).
10. Cómo trabajamos (proceso en 4 pasos).
11. Para quién trabajamos (tipos de clientes).
12. Quiénes somos (historia, equipo, identidad de marca).
13. Portfolio (real o preparado para agregar).
14. Testimonios (solo reales) o contenido alternativo.
15. FAQ (8–10 preguntas editables).
16. CTA final de alto impacto.
17. Contacto (formulario + WhatsApp + Instagram + mapa).
18. Footer completo.

== FORMULARIO DE CONTACTO DEBE INCLUIR ==

- Nombre.
- Nombre del negocio.
- Rubro.
- WhatsApp o teléfono.
- Email.
- Servicio de interés (con opciones predefinidas + "no estoy seguro").
- Situación actual.
- Objetivo principal.
- Presupuesto aproximado (opcional).
- Mensaje adicional.
- Validación completa + estados de éxito/error.

== REGLA ESPECIAL: ECOSISTEMA DIGITAL ==

Si la agencia trabaja con un modelo de conexión entre canales
(contenido → redes → web → WhatsApp → consulta → venta),
crear un diagrama visual responsive.
- En desktop: puede ser horizontal o en zigzag.
- En mobile: SIEMPRE vertical con bloques apilados.
- Debe ser comprensible, no decorativo.
- Describir correctamente para lectores de pantalla.

== REGLA ESPECIAL: PORTFOLIO ==

Si no hay proyectos reales disponibles:
- NO inventar clientes, resultados, métricas ni capturas.
- Mostrar la sección como "Proyectos en construcción".
- Dejar la estructura preparada para agregar casos reales.

============================================================
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PARTE 3: GUÍA RÁPIDA DE USO
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 ¿Cómo uso este sistema?

### Para cada proyecto nuevo:

1. **Copiá el BLOQUE BASE** completo (Parte 1)
2. **Elegí la PLANTILLA** que corresponda al rubro (A, B o C)
3. **Pegá ambos** al inicio de tu conversación con la IA
4. **Completá los campos** marcados con `[COMPLETAR]`
5. Listo — la IA seguirá todas las reglas automáticamente

### Ejemplo de armado:

```
[BLOQUE BASE]
+
[PLANTILLA A: Tienda Online]
+
Datos completados:
- Nombre: Urban Wear
- Productos: camperas, buzos, remeras
- Público: hombres 20-35, urbano
- País: Argentina
- Paleta: negro, marfil, verde oliva
```

### ¿Y si mi proyecto no encaja en ninguna plantilla?

Usá solo el **Bloque Base** y describí tu proyecto con detalle.
El bloque base cubre todas las reglas técnicas universales.
La IA adaptará el diseño a tu descripción.

### ¿Puedo mezclar plantillas?

Sí. Por ejemplo, una panadería que también vende por delivery puede
combinar elementos de la Plantilla B (gastronomía) con el carrito
de la Plantilla A (ecommerce).

---

## 📊 Resumen comparativo de las plantillas

| Aspecto | 🛍️ Tienda | 🥐 Gastro | 📣 Agencia |
|---------|----------|---------|----------|
| **Objetivo principal** | Vender productos | Mostrar + pedidos | Generar consultas |
| **CTA clave** | Agregar al carrito | Hacer pedido / WhatsApp | Hablemos / WhatsApp |
| **Carrito** | Completo con checkout | Pedido con fecha/hora | No aplica |
| **Filtros** | Categoría, talle, color, precio | Categoría, tipo, precio | No aplica |
| **Formulario especial** | No | Pedidos especiales (tortas) | Diagnóstico / consulta |
| **Mapa / ubicación** | Opcional | Obligatorio | Recomendado |
| **WhatsApp prominente** | Opcional | Sí | Sí (principal) |
| **Portfolio** | No | No | Sí |
| **Ecosistema visual** | No | No | Sí (diagrama de flujo) |
| **Alérgenos** | No | Sí (obligatorio) | No |

---

> **Última actualización:** Septiembre 2026
> **Basado en:** Prompts probados exitosamente para tienda de ropa, panadería y agencia de marketing digital (GenZ).
