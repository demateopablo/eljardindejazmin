# Prompt para Claude Code — Web "El Jardín de Jazmín"

> Completá los [PLACEHOLDERS] antes de pegarlo. Después corré `claude` en una carpeta
> nueva y pegale este brief entero como primer mensaje.

---

Quiero que armes desde cero un sitio web para un emprendimiento de velas aromáticas
y aromaterapia artesanal. Estas son todas las especificaciones:

## 1. Sobre el negocio

- **Nombre de marca:** El Jardín de Jazmín
- **Rubro:** Aromaterapia artesanal — velas de diseño, difusores de caña, wax melts,
  jabones artesanales
- **Ubicación:** Tres Arroyos, Buenos Aires, Argentina (negocio local, venta directa,
  sin envíos a otras provincias por ahora)
- **Historia de marca:** el nombre está inspirado en Jazmín (hija de la dueña).
  Frase ancla: "Calidez y aromas para tu hogar" / "Inspirado en Jazmín, creado con
  amor de mamá". La dueña es docente y emprendedora — el negocio es un proyecto
  personal y familiar, no una fábrica industrial: el copy tiene que sonar cálido,
  cercano y hecho a mano, nunca corporativo.
- **Instagram:** @eljardindejazmin.deco (85 seguidores, 39 publicaciones — cuenta
  chica y en crecimiento, no le metas métricas de "miles de clientes" ni nada que
  suene inflado)
- **Canal de venta real:** Instagram + WhatsApp. NO hay carrito de compra ni pagos
  online. El sitio es una vidriera/catálogo, no un e-commerce.

## 2. Identidad visual (basada en el logo y las fotos que te voy a pasar)

- **Logo:** tipografía script/caligráfica en verde oliva/salvia para "El jardín de
  Jazmín", con una rama de jazmín dibujada a mano arriba, en línea fina. Subtítulo
  en versalitas: "AROMATERAPIA ARTESANAL — VELAS AROMÁTICAS · DECO". Hay dos
  versiones: fondo transparente y fondo crema con textura de papel.
- **Paleta de colores:**
  - Verde salvia/oliva (del logo) como color de marca principal
  - Crema/hueso como fondo base (nada de blanco puro, que se vea cálido)
  - Acentos suaves en rosa palo / durazno / dorado apagado (aparecen en las
    etiquetas y en algunos productos)
- **Tipografía:** una script elegante para títulos/logo (tipo Playfair Display
  Italic, Cormorant, o similar a Google Fonts) + una sans-serif limpia y liviana
  para el cuerpo de texto (tipo Poppins, Jost o Nunito Sans)
- **Estilo fotográfico:** luz natural, fondos de pasto/jardín al aire libre y
  también escenas hogareñas cálidas (libro, mate/té, manta tejida, chimenea).
  Composición minimalista, mucho espacio en blanco/crema alrededor del producto.
  El sitio tiene que respirar ese mismo aire: cálido, casero, femenino, sin
  saturar de elementos.
- **Motivo gráfico recurrente:** líneas finas tipo botánico/floral (ramitas,
  hojas) como el del logo, usadas con moderación como separadores o acentos.

Vas a encontrar los archivos de logo y fotos de producto en `./assets/` — te los
copio yo a esa carpeta antes de que arranques (`logo-transparente.png`,
`logo-fondo-crema.png`, y fotos de producto sueltas). Usalos tal cual están,
no los recrees ni inventes un logo nuevo.

## 3. Estructura del sitio (una sola página, scroll largo, mobile-first)

1. **Hero:** logo + tagline + dos botones: "Ver catálogo" (scroll interno) y
   "Escribinos por WhatsApp" (link a `https://wa.me/5492983664228`)
2. **Nuestra historia:** 2-3 párrafos cortos con la historia de la marca
3. **Catálogo**, organizado en categorías con tabs o secciones:
   - Velas aromáticas (en vaso, en copa, moldeadas tipo arco/cubo)
   - Difusores de aroma (cañitas)
   - Wax melts
   - Jabones artesanales
   Cada producto: foto, nombre, aroma/variante, precio (dejá `$[PRECIO]` como
   placeholder si no tenés la lista todavía), botón "Consultar por WhatsApp"
   que abra un mensaje prearmado tipo "Hola! Quiero consultar por [nombre
   producto]"
4. **Cómo comprar:** el emprendimiento funciona desde casa, no hay local físico
   con atención al público — NO mostrar dirección exacta en ningún lado del
   sitio. Poner solo: "Tres Arroyos" como zona, un texto tipo "Entregas y
   retiros a coordinar por WhatsApp" y los horarios de contacto 8hs a 21hs. Nada
   de mapa con marcador puntual; si querés algo visual, alcanza con un mapa
   genérico de la ciudad sin pin exacto, o directamente sacarlo.
5. **Seguinos:** íconos/links a Instagram (@eljardindejazmin.deco), Facebook (https://www.facebook.com/eljardindejazmindeco/) y WhatsApp
6. **Footer** simple con el logo chico y el año

## 4. Requisitos técnicos

- Vite + React + TypeScript + Tailwind CSS
- 100% estático, sin backend ni base de datos — se despliega gratis en Vercel
  o Netlify
- Mobile-first de verdad: la mayoría del tráfico va a venir del link en la bio
  de Instagram, abierto desde el celular
- Rápido: imágenes optimizadas/lazy-loaded, sin librerías pesadas de más
- SEO local básico: `<title>` y meta description mencionando "velas aromáticas
  artesanales en Tres Arroyos", Open Graph tags con el logo como imagen (para
  que se vea bien si comparten el link por WhatsApp o Instagram), favicon
  generado a partir del logo
- Botón flotante de WhatsApp visible en todo el scroll (patrón común en sitios
  de emprendimientos locales)
- Si te falta algún dato de copy o precio, dejá un placeholder bien visible en
  vez de inventar información

## 5. Qué NO hacer

- No agregues carrito de compra, pasarela de pago ni login de usuarios
- No inventes testimonios, reseñas ni cantidad de clientes
- No cambies los colores/tipografía del logo ni generes un logo alternativo
- No hagas el copy sonar corporativo — es un emprendimiento chico y familiar
- No muestres ni menciones la dirección exacta en ningún lugar del sitio (es un
  emprendimiento hogareño, no un local): solo la ciudad, y coordinación de
  entrega/retiro por WhatsApp

  ## 6. Hosting y dominio
  
- El sitio se va a subir a vercel con dominio propio eljardindejazmin.com.ar