# PRD — SketchFlow: AI Fashion Tech Pack Generator

## 1. Resumen Ejecutivo

**Producto:** SketchFlow — Web App que genera fichas técnicas de moda (tech packs) a partir de fotos de referencia/inspiración.

**Problema:** Los profesionales de tendencias en moda (no diseñadores) necesitan comunicar ideas de producto al equipo de patronaje. Actualmente esto requiere saber dibujar o depender de un diseñador. El proceso es lento e ineficiente.

**Solución:** Una web app donde la usuaria sube 2-4 fotos de inspiración, indica qué elemento le interesa de cada foto (ej: "el botón de esta", "la hombrera de esta otra"), y la app genera automáticamente un sketch sobre un maniquí técnico + una ficha técnica completa lista para enviar a patronaje.

**Usuaria principal:** Profesional de tendencias/buying en empresa de moda. No es diseñadora. Necesita rapidez y simplicidad.

---

## 2. Output de Referencia — LA FICHA TÉCNICA

> **CRÍTICO:** El output debe replicar EXACTAMENTE el formato de la imagen de referencia adjunta. A continuación se describe con precisión milimétrica el layout.

### 2.1 Layout General de la Ficha (formato vertical A4)

```
┌─────────────────────────────────────────────────────┐
│                                    [Logo/Brand]     │
│                                                     │
│  [BRAND NAME]        [Nombre del diseñador/equipo]  │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │ Date Created:│ Season: FW24 │ Style: SET TWEED │ │
│  ├──────────────┼──────────────┼──────────────────┤ │
│  │ Designer:    │ Ext:         │ Pattern Cutter:  │ │
│  └──────────────┴──────────────┴──────────────────┘ │
│                                                     │
│                                                     │
│   bust ────┐                                        │
│            │    ┌─────────┐    ┌─────────┐          │
│   waist ───┤    │ MANIQUÍ │    │ MANIQUÍ │          │
│            │    │ FRONTAL │    │ TRASERO │          │
│   seat ────┘    │   con   │    │   con   │          │
│                 │ SKETCH  │    │ SKETCH  │          │
│                 │ encima  │    │ encima  │          │
│                 └─────────┘    └─────────┘          │
│                                                     │
│  ┌──────────┐    [NOTAS EN ROJO]                    │
│  │ MUESTRA  │    - "1, 3cm"                         │
│  │ DE TEJIDO│    - "vivo desfluecado"               │
│  │ (imagen) │    - "ambos lados"                    │
│  └──────────┘    - "Peplum" (nota en espalda)       │
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │            ZONA DE COMENTARIOS                  ││
│  │  (medidas, detalles constructivos, tejido)      ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 2.2 Elementos Clave del Output

1. **Header con metadata:** Brand, fecha, temporada, estilo, diseñador, extensión, patronista
2. **Maniquí frontal (izquierda):** Croquis técnico de cuerpo humano de frente con el sketch de la prenda DIBUJADO ENCIMA
3. **Maniquí trasero (derecha):** Mismo croquis de espaldas con el sketch de la parte trasera de la prenda DIBUJADO ENCIMA
4. **Líneas de medidas (izquierda):** bust, waist, seat — con líneas horizontales que conectan al maniquí
5. **Notas manuscritas en rojo:** Anotaciones de detalle (vivos, acabados, peplum, etc.) colocadas junto al sketch
6. **Muestra de tejido (esquina inferior izquierda):** Imagen/swatch del tejido seleccionado
7. **Grid inferior:** Espacio para medidas y comentarios adicionales

### 2.3 El Maniquí — Especificación SVG

> **MUY IMPORTANTE:** El maniquí debe ser un SVG vectorial limpio, estilo croquis de moda técnico (NO fashion illustration estilizada). Proporciones realistas de cuerpo humano, líneas finas en gris claro. El sketch de la prenda se dibuja ENCIMA con líneas más gruesas y negras.

**Maniquí frontal:**
- Cabeza: óvalo simple con línea central vertical
- Cara: ojos, nariz y boca minimalistas (puntos y líneas)
- Cuerpo: proporciones de 8 cabezas aprox
- Brazos: ligeramente separados del cuerpo, uno puede estar extendido mostrando manga
- Piernas: rectas, ligeramente separadas
- Color: gris claro (#CCCCCC) o línea fina gris

**Maniquí trasero:**
- Misma proporción que el frontal
- Sin rasgos faciales, solo óvalo de cabeza con línea central
- Espalda visible

**El sketch de la prenda:**
- Se renderiza ENCIMA del maniquí
- Líneas negras más gruesas
- Incluye detalles constructivos: costuras, botones, pliegues, cierres
- Debe generarse por IA basándose en las fotos de input

---

## 3. Flujo de Usuario (UX Flow)

### Paso 1: Upload de Fotos de Referencia
```
┌─────────────────────────────────────────┐
│                                         │
│   Sube tus fotos de referencia (2-4)    │
│                                         │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │
│   │ +   │  │ +   │  │ +   │  │ +   │  │
│   │Foto │  │Foto │  │Foto │  │Foto │  │
│   │  1  │  │  2  │  │  3  │  │  4  │  │
│   └─────┘  └─────┘  └─────┘  └─────┘  │
│                                         │
└─────────────────────────────────────────┘
```

- Drag & drop o click para subir
- Acepta: JPG, PNG, WEBP
- Máximo 4 fotos
- Mínimo 1 foto
- Preview de cada foto subida

### Paso 2: Instrucciones por Foto
```
┌─────────────────────────────────────────┐
│ Foto 1: [preview]                       │
│ ┌─────────────────────────────────────┐ │
│ │ "Quiero el cuello y las hombreras   │ │
│ │  de esta foto"                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Foto 2: [preview]                       │
│ ┌─────────────────────────────────────┐ │
│ │ "Los botones y el largo de esta"    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Foto 3: [preview]                       │
│ ┌─────────────────────────────────────┐ │
│ │ "El tejido y color de esta"         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

- Cada foto tiene un campo de texto para instrucciones
- Placeholder con ejemplos: "¿Qué te gusta de esta foto?"
- Opción de voice-to-text para dictar (nice to have)

### Paso 3: Detalles Generales
```
┌─────────────────────────────────────────┐
│                                         │
│ Tipo de prenda:  [Dropdown]             │
│   - Top / Blusa / Camisa                │
│   - Chaqueta / Blazer                   │
│   - Vestido                             │
│   - Pantalón                            │
│   - Falda                               │
│   - Set / Conjunto                      │
│   - Abrigo                              │
│   - Otro: [text field]                  │
│                                         │
│ Temporada:  [Dropdown] SS26 / FW26 / .. │
│ Nombre/Estilo: [text field]             │
│ Tejido principal: [text field]          │
│ Notas adicionales: [textarea]           │
│   ej: "peplum en espalda", "vivo de     │
│   3cm desfluecado ambos lados"          │
│                                         │
│         [🎨 GENERAR FICHA TÉCNICA]      │
│                                         │
└─────────────────────────────────────────┘
```

### Paso 4: Output — Ficha Técnica Generada
```
┌─────────────────────────────────────────┐
│                                         │
│  [Preview de la ficha técnica]          │
│  - Formato idéntico a la referencia     │
│  - Maniquí frontal + trasero con sketch │
│  - Header con metadata                  │
│  - Notas en rojo                        │
│  - Espacio para tejido                  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ZONA EDITABLE:                      ││
│  │ - Click en notas para editar texto  ││
│  │ - Click en medidas para rellenar    ││
│  │ - Drag para reposicionar notas      ││
│  └─────────────────────────────────────┘│
│                                         │
│  [📥 Descargar PDF]  [📥 Descargar PNG]│
│  [🔄 Regenerar sketch]                 │
│  [✏️ Editar instrucciones]             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Arquitectura Técnica

### 4.1 Stack Recomendado (Velocidad de desarrollo máxima)

```
Frontend:        Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
Backend/API:     Next.js API Routes (serverless)
AI - Sketch:     Claude claude-sonnet-4-5-20250929 Vision + generación SVG
                 (o Anthropic API para analizar fotos → generar SVG del sketch)
AI - Alternativa: OpenAI DALL-E 3 / Stable Diffusion para sketch rasterizado
Storage:         Vercel Blob / Cloudflare R2 (para imágenes subidas)
Export PDF:      html2canvas + jsPDF (client-side)
                 o Puppeteer (server-side para mejor calidad)
Deploy:          Vercel (deploy en minutos)
Auth:            No auth para MVP (acceso directo)
```

### 4.2 Flujo de Datos

```
[Fotos de referencia (2-4)]
         │
         ▼
[Upload a storage temporal]
         │
         ▼
[Envío a Claude Vision API]
  - Todas las fotos como input
  - Instrucciones por foto
  - Tipo de prenda
  - Notas adicionales
         │
         ▼
[Claude genera:]
  1. Descripción técnica detallada del diseño combinado
  2. SVG del sketch frontal (prenda sobre maniquí)
  3. SVG del sketch trasero (prenda sobre maniquí)
  4. Sugerencias de medidas
  5. Lista de detalles constructivos
         │
         ▼
[Frontend renderiza la ficha técnica]
  - Template HTML/CSS que replica el formato de referencia
  - Inserta los SVGs generados
  - Rellena metadata
  - Muestra notas editables
         │
         ▼
[Exporta como PDF/PNG]
```

### 4.3 Prompt Engineering para Claude Vision

```markdown
## System Prompt para generación de sketch

Eres un diseñador técnico de moda. Tu trabajo es analizar fotos de referencia
y generar un sketch técnico SVG de una prenda que combine los elementos
indicados de cada foto.

### Input que recibirás:
- 2-4 fotos de referencia con instrucciones de qué elemento tomar de cada una
- Tipo de prenda
- Notas adicionales

### Output que debes generar (JSON):
{
  "sketch_frontal_svg": "<svg>...</svg>",  // SVG del sketch frontal
  "sketch_trasero_svg": "<svg>...</svg>",  // SVG del sketch trasero
  "descripcion_tecnica": "...",            // Descripción para patronaje
  "detalles_constructivos": [              // Array de notas
    { "texto": "Vivo de 3cm desfluecado", "posicion": "cintura" },
    { "texto": "Peplum", "posicion": "espalda-bajo" }
  ],
  "medidas_sugeridas": {
    "bust": "—",
    "waist": "—",
    "seat": "—",
    "largo_total": "—",
    "largo_manga": "—"
  },
  "tejido_sugerido": "..."
}

### Reglas para el SVG:
1. El SVG debe tener un viewBox de "0 0 300 500"
2. NO incluir el maniquí — solo la prenda (el maniquí ya está en el template)
3. Usar líneas negras (#000000) con stroke-width de 1.5-2px
4. Incluir detalles constructivos: costuras, botones, pliegues, cierres
5. Estilo: sketch técnico de moda, NO fashion illustration
6. La prenda debe dimensionarse para encajar sobre un maniquí de 300x500
7. Incluir líneas de costura con trazo discontinuo donde aplique
8. Botones como pequeños círculos
9. Pliegues/draping con líneas curvas sutiles
```

### 4.4 Template del Maniquí Base (SVG)

El frontend debe tener 2 SVGs base precargados:

1. **`croquis-frontal.svg`** — Maniquí técnico de frente
   - Líneas finas en gris claro (#CCCCCC)
   - Proporciones realistas (no fashion elongated)
   - Cabeza con rasgos minimalistas
   - Brazos ligeramente separados
   - Línea central vertical de simetría

2. **`croquis-trasero.svg`** — Maniquí técnico de espaldas
   - Mismas proporciones
   - Sin rasgos faciales
   - Cabello indicado con líneas simples

**Composición:** El sketch de la prenda (generado por IA) se superpone al maniquí base usando layering SVG o CSS z-index.

---

## 5. Componentes de la Interfaz

### 5.1 Pantalla Principal — Dashboard
- Header minimalista con logo "SketchFlow"
- Botón grande central: "+ Nueva Ficha Técnica"
- Historial de fichas recientes (grid de thumbnails)

### 5.2 Wizard de Creación (3 pasos en una sola página con scroll)
- **Sección 1:** Upload de fotos (drag & drop grid)
- **Sección 2:** Instrucciones por foto (aparece después del upload)
- **Sección 3:** Detalles generales (tipo, temporada, tejido, notas)
- **CTA fijo en bottom:** "Generar Ficha Técnica"

### 5.3 Vista de Ficha Técnica (Output)
- Preview a pantalla completa de la ficha
- Sidebar derecho con controles:
  - Editar notas (click en texto rojo para editar inline)
  - Rellenar medidas
  - Cambiar tejido
  - Subir swatch de tejido (imagen)
  - Regenerar sketch
- Barra superior: Descargar PDF / PNG / Compartir

### 5.4 Ficha Técnica — Estructura HTML/CSS del Output

```html
<div class="tech-pack" style="width: 210mm; height: 297mm;"> <!-- A4 -->

  <!-- HEADER -->
  <div class="header">
    <div class="brand-name">BRAND NAME</div>
    <div class="designer-names">Nombres</div>
    <table class="metadata-table">
      <tr>
        <td>Date Created: <input/></td>
        <td>Season: <input/></td>
        <td>Style: <input/></td>
      </tr>
      <tr>
        <td>Designer: <input/></td>
        <td>Ext: <input/></td>
        <td>Pattern Cutter: <input/></td>
      </tr>
    </table>
  </div>

  <!-- BODY: SKETCHES -->
  <div class="sketch-area">

    <!-- Medidas izquierda -->
    <div class="measurements-left">
      <div class="measure-line">bust ————</div>
      <div class="measure-line">waist ————</div>
      <div class="measure-line">seat ————</div>
    </div>

    <!-- Maniquí Frontal + Sketch -->
    <div class="croquis-container frontal">
      <svg class="maniqui-base"><!-- croquis frontal gris --></svg>
      <svg class="sketch-overlay"><!-- prenda generada por IA --></svg>
    </div>

    <!-- Maniquí Trasero + Sketch -->
    <div class="croquis-container trasero">
      <svg class="maniqui-base"><!-- croquis trasero gris --></svg>
      <svg class="sketch-overlay"><!-- prenda generada por IA --></svg>
    </div>

  </div>

  <!-- NOTAS EN ROJO (posicionables) -->
  <div class="red-notes">
    <div class="note" style="color: red;" contenteditable>
      Vivo de 3cm desfluecado ambos lados
    </div>
    <!-- más notas... -->
  </div>

  <!-- SWATCH DE TEJIDO -->
  <div class="fabric-swatch">
    <img src="swatch.jpg" />
    <div class="fabric-name">Tweed rojo/negro</div>
  </div>

  <!-- GRID INFERIOR: MEDIDAS Y COMENTARIOS -->
  <div class="bottom-grid">
    <table>
      <tr>
        <td>Medida</td><td>XS</td><td>S</td><td>M</td><td>L</td><td>XL</td>
      </tr>
      <!-- filas editables -->
    </table>
    <div class="comments-area" contenteditable>
      Comentarios adicionales para patronaje...
    </div>
  </div>

</div>
```

---

## 6. API Endpoints

### POST `/api/generate-techpack`
```json
// Request
{
  "images": [
    { "url": "blob://img1.jpg", "instructions": "Quiero el cuello de esta" },
    { "url": "blob://img2.jpg", "instructions": "Los botones de esta" },
    { "url": "blob://img3.jpg", "instructions": "El largo y silueta de esta" }
  ],
  "garment_type": "blazer",
  "season": "FW26",
  "style_name": "Set Tweed",
  "fabric": "Tweed rojo/negro",
  "additional_notes": "Peplum en espalda, vivo de 3cm desfluecado ambos lados"
}

// Response
{
  "sketch_front_svg": "<svg>...</svg>",
  "sketch_back_svg": "<svg>...</svg>",
  "technical_description": "Blazer cruzado con hombrera...",
  "construction_notes": [
    { "text": "Vivo de 3cm desfluecado", "position": "waist-front", "x": 150, "y": 320 },
    { "text": "Peplum", "position": "back-hem", "x": 250, "y": 380 }
  ],
  "suggested_measurements": {
    "bust": "",
    "waist": "",
    "seat": "",
    "total_length": "",
    "sleeve_length": ""
  }
}
```

### POST `/api/upload-image`
- Multipart form upload
- Returns blob URL

### POST `/api/export-pdf`
- Receives rendered HTML
- Returns PDF buffer

---

## 7. Modelo de Datos

```typescript
interface TechPack {
  id: string;
  created_at: Date;
  updated_at: Date;

  // Metadata
  brand_name: string;
  designer_name: string;
  season: string;
  style_name: string;
  pattern_cutter: string;
  extension: string;

  // Input
  reference_images: {
    url: string;
    instructions: string;
  }[];
  garment_type: string;
  fabric: string;
  fabric_swatch_url?: string;
  additional_notes: string;

  // Generated Output
  sketch_front_svg: string;
  sketch_back_svg: string;
  technical_description: string;
  construction_notes: {
    text: string;
    position: string;
    x: number;
    y: number;
    color: string; // default "#FF0000"
  }[];

  // Editable fields
  measurements: {
    bust: string;
    waist: string;
    seat: string;
    total_length: string;
    sleeve_length: string;
    [key: string]: string; // medidas custom
  };
  comments: string;
}
```

---

## 8. MVP Scope — Lo mínimo para que funcione YA

### ✅ MVP v0.1 (1-2 semanas)
- [ ] Upload de 1-4 fotos de referencia
- [ ] Campo de instrucciones por foto
- [ ] Selección de tipo de prenda + temporada + tejido
- [ ] Generación de sketch SVG frontal y trasero via Claude Vision API
- [ ] Renderizado de ficha técnica con template fijo (replicando la referencia)
- [ ] Maniquí base SVG precargado (frontal + trasero)
- [ ] Notas editables inline (contenteditable)
- [ ] Medidas editables
- [ ] Export a PDF
- [ ] Deploy en Vercel

### 🔜 v0.2 (post-MVP)
- [ ] Historial de fichas guardadas (localStorage o Supabase)
- [ ] Regenerar solo el sketch sin perder ediciones
- [ ] Subir imagen de swatch de tejido
- [ ] Librería de tejidos predefinidos con imágenes
- [ ] Drag & drop de notas rojas para reposicionar
- [ ] Tabla de medidas por talla (XS-XL)
- [ ] Compartir ficha por link

### 🚀 v1.0 (futuro)
- [ ] Auth con login
- [ ] Workspace por equipo/marca
- [ ] Templates de ficha por marca
- [ ] Integración con Pinterest (import directo de pins)
- [ ] Voice-to-text para instrucciones
- [ ] Múltiples vistas de prenda (lateral, detalle)
- [ ] Generación de flat sketch (prenda sin maniquí) adicional

---

## 9. Estructura de Archivos del Proyecto

```
sketchflow/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Landing / Dashboard
│   ├── create/
│   │   └── page.tsx            # Wizard de creación
│   ├── techpack/
│   │   └── [id]/
│   │       └── page.tsx        # Vista/edición de ficha
│   └── api/
│       ├── generate/
│       │   └── route.ts        # POST - genera sketch con Claude
│       ├── upload/
│       │   └── route.ts        # POST - sube imagen
│       └── export-pdf/
│           └── route.ts        # POST - exporta PDF
├── components/
│   ├── ui/                     # shadcn components
│   ├── ImageUploader.tsx       # Upload drag & drop
│   ├── PhotoCard.tsx           # Foto + instrucciones
│   ├── GarmentSelector.tsx     # Selector tipo prenda
│   ├── TechPackPreview.tsx     # Preview completo de ficha
│   ├── CroquisFrontal.tsx      # SVG maniquí frontal
│   ├── CroquisTrasero.tsx      # SVG maniquí trasero
│   ├── SketchOverlay.tsx       # SVG sketch sobre maniquí
│   ├── RedNote.tsx             # Nota editable roja
│   ├── MeasurementLines.tsx    # Líneas bust/waist/seat
│   ├── FabricSwatch.tsx        # Preview de tejido
│   └── MetadataHeader.tsx      # Header con tabla de metadata
├── lib/
│   ├── claude.ts               # Cliente Anthropic API
│   ├── prompts.ts              # System prompts para sketch
│   ├── svg-templates.ts        # Maniquís base SVG
│   └── export.ts               # Lógica de export PDF/PNG
├── public/
│   ├── croquis-frontal.svg     # Maniquí base frontal
│   └── croquis-trasero.svg     # Maniquí base trasero
├── .env.local                  # ANTHROPIC_API_KEY
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 10. Variables de Entorno

```env
ANTHROPIC_API_KEY=sk-ant-...
BLOB_READ_WRITE_TOKEN=...      # Vercel Blob (si se usa)
```

---

## 11. Dependencias Clave

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@anthropic-ai/sdk": "latest",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^3.4",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-select": "latest",
    "lucide-react": "latest",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "react-dropzone": "^14.2.3",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

---

## 12. Consideraciones Técnicas Importantes

### 12.1 Generación SVG con Claude
- Claude Vision puede analizar imágenes y generar SVG como texto
- El prompt debe ser MUY específico sobre viewBox, proporciones y estilo
- Incluir ejemplos de SVG de prendas en el prompt para mejor calidad
- Si la calidad del SVG no es suficiente, considerar: Claude genera descripción → otro modelo genera imagen → se vectoriza con Potrace

### 12.2 Composición Maniquí + Sketch
```tsx
// El maniquí y el sketch son SVGs independientes superpuestos
<div className="relative w-[300px] h-[500px]">
  {/* Capa 1: Maniquí base en gris */}
  <CroquisFrontal className="absolute inset-0 opacity-40" />
  {/* Capa 2: Sketch de la prenda encima */}
  <div
    className="absolute inset-0"
    dangerouslySetInnerHTML={{ __html: generatedSketchSVG }}
  />
  {/* Capa 3: Notas rojas */}
  {notes.map(note => (
    <RedNote key={note.id} {...note} />
  ))}
</div>
```

### 12.3 Export PDF
- Usar html2canvas para capturar el div de la ficha como imagen
- Insertar en jsPDF con tamaño A4
- Alternativa server-side con Puppeteer para mayor fidelidad
- Asegurar que los SVG se renderizan correctamente en el PDF

### 12.4 Responsive pero Print-First
- La ficha técnica siempre se renderiza en proporciones A4
- En móvil se muestra escalada con zoom/scroll
- El wizard de creación sí es fully responsive

---

## 13. Criterios de Aceptación del MVP

1. **La usuaria puede subir 2-4 fotos** sin fricción (drag & drop o click)
2. **Puede escribir instrucciones** para cada foto indicando qué elemento quiere
3. **Al pulsar "Generar"**, en menos de 30 segundos aparece la ficha técnica
4. **La ficha replica el formato exacto** de la referencia de Zara Woman
5. **El sketch aparece sobre el maniquí** tanto en vista frontal como trasera
6. **Las notas son editables** haciendo click sobre ellas
7. **Las medidas son rellenables** en los campos correspondientes
8. **Se puede descargar como PDF** en formato A4 listo para imprimir
9. **La ficha es legible** y útil para un equipo de patronaje real
10. **No requiere conocimientos técnicos** — la interfaz es autoexplicativa

---

## 14. Prompt Completo para Claude Code

> Usa este prompt para arrancar el proyecto en Claude Code:

```
Crea un proyecto Next.js 14 con App Router llamado "sketchflow" siguiendo
exactamente el PRD adjunto. El objetivo es una web app que genera fichas
técnicas de moda.

PRIORIDADES:
1. Que funcione el flujo completo: upload fotos → instrucciones → generar → ver ficha → descargar PDF
2. Que el output replique EXACTAMENTE el formato de la ficha de referencia (Zara Woman)
3. Que los SVG de maniquí frontal y trasero estén precargados como componentes React
4. Que la llamada a Claude Vision genere el sketch SVG de la prenda

STACK: Next.js 14, Tailwind, shadcn/ui, Anthropic SDK, html2canvas, jsPDF
DEPLOY: Preparado para Vercel

Empieza creando la estructura de archivos y los componentes base.
Después implementa el flujo de creación y la integración con Claude API.
```
