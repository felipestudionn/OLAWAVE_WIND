// Concept generation — primary photo is THE garment, secondary photos add detail modifications
export const CONCEPT_GENERATION_PROMPT = `Eres un diseñador técnico de moda experto. Tu trabajo es analizar la foto de referencia y describir la prenda con máximo detalle para reproducirla fielmente como un sketch técnico de vista frontal.

INSTRUCCIONES:
1. Analiza la FOTO PRINCIPAL con lupa: silueta exacta, corte, largo, mangas, cuello, cierres, bolsillos, costuras
2. CIERRES: describe tipo exacto (botones, alamares/brandeburgos, cremallera, corchetes, lazos), número exacto, posición exacta, forma del cierre
3. CUELLO: tipo exacto (mao/mandarín, solapa, cuello camisero, etc.), altura, forma, acabado
4. BOLSILLOS: tipo (plastrón, vivo, ojal, parche), posición, tamaño, tapeta si la tiene
5. COSTURAS: pespuntes visibles, costuras decorativas, ribetes, vivos, acabados de bordes
6. MANGAS: tipo (montada, raglán, japonesa), largo exacto, puño, acabado
7. PROPORCIONES: largo total respecto a cadera, ancho de hombros, cintura marcada o recta

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "baseDescription": "Descripción completa de la silueta: forma, largo, ancho, tipo de manga, proporciones exactas",
  "concepts": [
    {
      "id": "1",
      "title": "Fiel al original",
      "description": "Copia exacta de la foto principal. Vista frontal: [descripción ultra-detallada de cada elemento visible: silueta, corte, cuello, mangas, cierres, costuras, proporciones, acabados, bolsillos, largo]."
    }
  ]
}

REGLAS:
- Escribe en español
- Solo 1 concepto: "Fiel al original" — reproducción 100% fiel de la foto
- Describir solo VISTA FRONTAL con máximo detalle constructivo
- Cada detalle debe ser descrito: tipo exacto de cuello, forma y posición de cierre, bolsillos, acabados, costuras, pespuntes, proporciones, largo de manga`;

// FLUX Kontext image editing prompt: photo → fashion flat sketch (front view only)
export function buildPhotoToSketchPrompt(
  garmentType: string,
  claudeDescription: string
): string {
  return `Redraw this exact ${garmentType} as a professional fashion flat technical drawing. Copy EVERY detail from this photo exactly.

COPY THESE DETAILS EXACTLY FROM THE PHOTO:
- Exact collar type and shape as shown
- Exact closure type: buttons, toggles, zippers, frog closures — draw them exactly as they appear
- Exact number and position of closures/buttons
- Exact pocket shapes, flap details, welt pockets
- Exact seam lines, topstitching, decorative stitching
- Exact proportions: sleeve length, body length, shoulder width
- Exact hem shape and finishing

DRAWING STYLE:
- Pure white background, nothing else
- Flat lay perspective: garment laid flat on a table
- Bold clean BLACK outlines (2-3px weight), perfectly symmetrical
- Sharp precise lines like Adobe Illustrator or CLO3D fashion flat
- Fine dashed lines for stitch details
- No color, no shading, no gray, no texture — only black line art
- No body, no mannequin, no text, no labels, no shadows

IMPORTANT: Do not simplify or generalize the design. Every closure, every seam, every pocket detail from the original photo MUST appear in the sketch. This is a technical drawing for manufacturing — accuracy is critical.

GARMENT DETAILS: ${claudeDescription}`;
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
- "front-collar"
- "front-shoulder"
- "front-bust"
- "front-waist"
- "front-hip"
- "front-hem"
- "front-sleeve"

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

  return `Describe esta prenda con máximo detalle para reproducirla como sketch técnico:

TIPO DE PRENDA: ${data.garmentType}
TEMPORADA: ${data.season}
NOMBRE/ESTILO: ${data.styleName}
TEJIDO: ${data.fabric}
NOTAS ADICIONALES: ${data.additionalNotes}

INSTRUCCIONES POR FOTO:
${photoInstructions}

RECUERDA:
- Solo 1 concepto: "Fiel al original" — copia exacta al 100%
- Incluye "baseDescription" con la silueta completa
- Describe solo vista frontal con todos los detalles constructivos
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
