// Concept generation — primary photo is THE garment, secondary photos add detail modifications
export const CONCEPT_GENERATION_PROMPT = `Eres un diseñador técnico de moda experto. Tu trabajo es analizar la foto principal de referencia y proponer variantes de diseño.

REGLA FUNDAMENTAL: TODOS los conceptos comparten la MISMA silueta base, largo, y proporciones de la FOTO PRINCIPAL. Las variantes SOLO cambian detalles constructivos específicos (tipo de cuello, cierres, bolsillos, acabados). La silueta, largo, ancho y forma general NUNCA cambian.

INSTRUCCIONES:
1. Analiza la FOTO 1 (principal) en detalle absoluto: silueta, corte, largo, mangas, cuello, detalles constructivos, proporciones, acabados, cierres, bolsillos, costuras visibles
2. Genera una DESCRIPCIÓN BASE de la silueta: forma general, largo, ancho de hombros, tipo de manga, proporciones. Esta descripción es IDÉNTICA para los 4 conceptos.
3. El CONCEPTO 1 ("Fiel al original") describe la prenda de la foto principal tal cual, sin NINGÚN cambio
4. Los CONCEPTOS 2-4 mantienen la MISMA silueta base y solo varían detalles puntuales según las fotos secundarias o sugerencias creativas
5. Si solo hay 1 foto, las variantes cambian SOLO detalles menores (tipo de cierre, acabado de cuello, estilo de bolsillo) manteniendo exactamente la misma forma

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "baseDescription": "Descripción de la silueta base que aplica a TODOS los conceptos: forma, largo, ancho, tipo de manga, proporciones exactas de la foto principal",
  "concepts": [
    {
      "id": "1",
      "title": "Fiel al original",
      "description": "Copia exacta de la foto principal sin cambios. Vista frontal: ... Vista trasera: ..."
    },
    {
      "id": "2",
      "title": "Nombre corto del cambio",
      "description": "MISMA silueta base. Cambios: [solo los detalles específicos que cambian respecto al original]"
    },
    {
      "id": "3",
      "title": "...",
      "description": "MISMA silueta base. Cambios: [...]"
    },
    {
      "id": "4",
      "title": "...",
      "description": "MISMA silueta base. Cambios: [...]"
    }
  ]
}

REGLAS:
- Escribe en español
- Describir tanto VISTA FRONTAL como VISTA TRASERA en cada concepto
- Los conceptos 2-4 deben empezar diciendo "MISMA silueta base." y luego SOLO listar qué detalles cambian
- NUNCA cambiar: largo total, ancho de hombros, tipo de manga, proporciones generales, forma de la silueta
- SÍ se puede cambiar: tipo de cuello, cierres (botones vs cremallera vs alamares), bolsillos, acabados, ribetes, costuras decorativas`;

// FLUX Kontext image editing prompt: photo → fashion flat sketch
export function buildPhotoToSketchPrompt(
  view: 'front' | 'back',
  garmentType: string,
  claudeDescription: string
): string {
  if (view === 'front') {
    return `Convert this ${garmentType} photograph into a clean black-and-white technical fashion flat sketch. Remove all color, shading, texture, and background. Keep ONLY thin black outlines on a pure white background. Maintain the exact same silhouette, proportions, and construction details (seams, closures, stitching, buttons, pockets). The result should look like a professional hand-drawn fashion technical illustration with a fine-tip 0.3mm pen. No mannequin, no body, flat lay perspective. No text or labels.`;
  }

  return `Based on this ${garmentType}, generate a BACK VIEW technical fashion flat sketch in clean black-and-white line art. Pure white background with only thin black outlines. Same silhouette and proportions as the front. Show back construction details: back seams, yoke, darts, back closures, vents. Professional fashion flat sketch style, like a hand-drawn technical illustration. No body, no mannequin, flat lay. No text or labels. Details: ${claudeDescription}`;
}

// Prompt for Claude to propose construction notes
export const COMMENT_PROPOSAL_PROMPT = `Eres un experto técnico de moda especializado en fichas técnicas (tech packs).

Tu trabajo es proponer notas de construcción/anotaciones técnicas que podrían incluirse en una ficha técnica para esta prenda.

INSTRUCCIONES:
1. Analiza la descripción del diseño
2. Propón entre 6 y 8 notas técnicas relevantes
3. Cada nota debe ser una indicación constructiva precisa para patronaje
4. Las notas deben cubrir diferentes aspectos: costuras, acabados, fornituras, medidas clave, detalles especiales

TIPOS DE NOTAS:
- Tipo de costura o acabado (ej: "Vivo de 3cm desfluecado ambos lados")
- Detalle de confección (ej: "Peplum fruncido en cintura trasera")
- Fornitura (ej: "Botón forrado Ø 15mm")
- Indicación de patronaje (ej: "Manga montada con caída natural")
- Acabado (ej: "Dobladillo invisible 2cm")
- Material o entretela (ej: "Entretela termoadhesiva en cuello y puños")

POSICIONES VÁLIDAS:
- "front-collar", "back-collar"
- "front-shoulder", "back-shoulder"
- "front-bust", "back-bust"
- "front-waist", "back-waist"
- "front-hip", "back-hip"
- "front-hem", "back-hem"
- "front-sleeve", "back-sleeve"

COORDENADAS:
- x: entre 200 y 280 (para notas del lado derecho)
- y: según posición (collar ~70, shoulder ~85, bust ~130, waist ~200, hip ~260, hem ~350, sleeve ~140)
- Escribe en español

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "notes": [
    { "text": "Texto de la nota", "position": "front-waist", "x": 220, "y": 200 },
    ...
  ],
  "suggestedMeasurements": {
    "bust": "",
    "waist": "",
    "seat": "",
    "totalLength": "",
    "sleeveLength": ""
  }
}`;

export function buildConceptUserPrompt(data: {
  garmentType: string;
  season: string;
  styleName: string;
  fabric: string;
  additionalNotes: string;
  images: Array<{ instructions: string }>;
}): string {
  const photoInstructions = data.images
    .map((img, i) => {
      const label = i === 0 ? 'FOTO PRINCIPAL' : `Foto secundaria ${i + 1}`;
      return `- ${label}: ${img.instructions || (i === 0 ? 'Copiar fielmente esta prenda' : 'Usar como referencia de detalles')}`;
    })
    .join('\n');

  return `Genera 4 conceptos de diseño basados en la FOTO PRINCIPAL:

TIPO DE PRENDA: ${data.garmentType}
TEMPORADA: ${data.season}
NOMBRE/ESTILO: ${data.styleName}
TEJIDO: ${data.fabric}
NOTAS ADICIONALES: ${data.additionalNotes}

INSTRUCCIONES POR FOTO:
${photoInstructions}

RECUERDA:
- Incluye "baseDescription" con la silueta base (idéntica para todos)
- Concepto 1 = "Fiel al original", copia exacta sin cambios
- Conceptos 2-4 = MISMA silueta, solo cambian detalles puntuales según las fotos secundarias
- NUNCA cambiar silueta, largo ni proporciones entre conceptos
- Solo JSON, sin markdown.`;
}

export function buildCommentUserPrompt(data: {
  garmentType: string;
  conceptDescription: string;
  fabric: string;
  additionalNotes: string;
}): string {
  return `Propón notas de construcción para esta prenda:

TIPO DE PRENDA: ${data.garmentType}
DESCRIPCIÓN DEL DISEÑO: ${data.conceptDescription}
TEJIDO: ${data.fabric}
NOTAS ADICIONALES DEL USUARIO: ${data.additionalNotes}

Recuerda: solo JSON, sin markdown.`;
}

// Backward-compat exports
export const SKETCH_SYSTEM_PROMPT = CONCEPT_GENERATION_PROMPT;
export function buildUserPrompt(data: {
  garmentType: string;
  season: string;
  styleName: string;
  fabric: string;
  additionalNotes: string;
  images: Array<{ instructions: string }>;
}): string {
  return buildConceptUserPrompt(data);
}
