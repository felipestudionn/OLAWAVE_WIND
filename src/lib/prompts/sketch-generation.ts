// Concept generation — primary photo is THE garment, secondary photos add detail modifications
export const CONCEPT_GENERATION_PROMPT = `Eres un diseñador técnico de moda experto. Tu trabajo es describir la prenda de la foto de forma concisa y precisa para que un modelo de IA pueda dibujarla fielmente como un sketch técnico.

INSTRUCCIONES:
1. Describe la silueta general: tipo de prenda, largo, forma, proporciones
2. Describe cada elemento visible: cuello, cierres, bolsillos, mangas, puños, costuras decorativas
3. Sé CONCISO — una frase por elemento. No repitas información ni exageres.
4. El objetivo es que el sketch sea FIEL a la foto, no que tenga más detalle del necesario.

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "baseDescription": "Descripción concisa de la silueta y proporciones generales",
  "concepts": [
    {
      "id": "1",
      "title": "Fiel al original",
      "description": "Descripción concisa de la prenda vista frontal: silueta, cuello, cierres, bolsillos, mangas, acabados."
    }
  ]
}

REGLAS:
- Escribe en español
- Solo 1 concepto: "Fiel al original"
- Solo vista frontal
- Descripción CONCISA y PRECISA — no exagerar ni inventar detalles que no se ven claramente`;

// FLUX Kontext image editing prompt: photo → fashion flat sketch (front view only)
export function buildPhotoToSketchPrompt(
  garmentType: string,
  claudeDescription: string
): string {
  return `Convert this ${garmentType} photo into a clean technical fashion flat drawing. Be faithful to the original — do not exaggerate, add, or change any details.

STYLE: Clean vector-like black line art on pure white background. Flat lay front view, symmetrical. Sharp precise lines like Adobe Illustrator. No color, no shading, no body, no mannequin, no text.

ACCURACY: Reproduce the garment exactly as shown in the photo — same proportions, same closures, same pockets, same collar shape. Do not embellish or stylize.

REFERENCE: ${claudeDescription}`;
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
