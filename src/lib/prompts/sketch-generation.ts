// Prompt for Claude to analyze reference photos and generate 3-4 design concepts
export const CONCEPT_GENERATION_PROMPT = `Eres un diseñador técnico de moda experto. Tu trabajo es analizar fotos de referencia y proponer variantes de diseño.

INSTRUCCIONES:
1. Analiza todas las fotos de referencia proporcionadas
2. Lee las instrucciones específicas de cada foto (qué elementos quiere el usuario de cada una)
3. Genera EXACTAMENTE 4 conceptos de diseño diferentes que combinen los elementos solicitados
4. Cada concepto debe ser una interpretación distinta pero coherente

REGLAS:
- Cada concepto debe describir la prenda de forma técnica y precisa
- Incluir silueta, detalles constructivos, acabados, y proporción
- Describir tanto la VISTA FRONTAL como la VISTA TRASERA
- Las descripciones deben ser lo suficientemente detalladas para que un ilustrador pueda dibujar la prenda
- Escribe en español

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "concepts": [
    {
      "id": "1",
      "title": "Nombre corto del concepto",
      "description": "Descripción técnica completa de la prenda para vista frontal y trasera. Incluir silueta, largo, mangas, cuello, detalles constructivos, acabados, etc."
    },
    {
      "id": "2",
      "title": "...",
      "description": "..."
    },
    {
      "id": "3",
      "title": "...",
      "description": "..."
    },
    {
      "id": "4",
      "title": "...",
      "description": "..."
    }
  ]
}`;

// Template for generating sketch images with Gemini Imagen
export function buildImagePrompt(concept: string, view: 'front' | 'back', garmentType: string): string {
  const viewLabel = view === 'front' ? 'FRONTAL' : 'TRASERA (de espaldas)';
  return `Generate a clean technical fashion flat sketch drawing.

REQUIREMENTS:
- Vista ${viewLabel} de la prenda sobre un croquis/maniquí técnico de moda femenino
- Estilo: dibujo técnico de moda a línea negra sobre fondo blanco puro
- El maniquí debe ser un croquis técnico proporcional (NO fashion illustration estilizada)
- Proporciones realistas del cuerpo humano (8 cabezas de altura)
- La prenda dibujada encima del croquis con líneas negras más gruesas
- Incluir detalles constructivos: costuras, botones, pliegues, cierres, topstitching
- Líneas de costura con trazo discontinuo donde aplique
- Estilo similar a un sketch de ficha técnica profesional de moda
- El maniquí debe tener: cabeza simple con línea central, cuerpo con brazos ligeramente separados, piernas rectas
- Solo blanco y negro, sin colores
- Fondo completamente blanco
- NO incluir texto, etiquetas ni anotaciones en la imagen

PRENDA: ${garmentType}
DESCRIPCIÓN: ${concept}`;
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
    .map((img, i) => `- Foto ${i + 1}: ${img.instructions || 'Usar como referencia general'}`)
    .join('\n');

  return `Genera 4 conceptos de diseño para la siguiente prenda:

TIPO DE PRENDA: ${data.garmentType}
TEMPORADA: ${data.season}
NOMBRE/ESTILO: ${data.styleName}
TEJIDO: ${data.fabric}
NOTAS ADICIONALES: ${data.additionalNotes}

INSTRUCCIONES POR FOTO DE REFERENCIA:
${photoInstructions}

Analiza TODAS las fotos de referencia cuidadosamente. Combina los elementos específicos mencionados en cada foto para crear 4 variantes coherentes del diseño. Recuerda: solo JSON, sin markdown.`;
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

// Keep old prompts for backward compatibility
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
