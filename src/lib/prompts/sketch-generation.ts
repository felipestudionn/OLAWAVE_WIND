// Concept generation — primary photo is THE garment, secondary photos add detail modifications
export const CONCEPT_GENERATION_PROMPT = `Eres un diseñador técnico de moda experto. Tu trabajo es analizar la foto principal de referencia y proponer variantes de diseño.

IMPORTANTE: La FOTO 1 es la FOTO PRINCIPAL. Tu primer concepto SIEMPRE debe ser una reproducción FIEL al 100% de esa prenda exactamente como aparece en la foto.

INSTRUCCIONES:
1. Analiza la FOTO 1 (principal) en detalle absoluto: silueta, corte, largo, mangas, cuello, detalles constructivos, proporciones, acabados, cierres, bolsillos, costuras visibles
2. El CONCEPTO 1 ("Fiel al original") debe describir la prenda de la foto principal tal cual es, sin NINGÚN cambio
3. Si hay fotos secundarias (2, 3, 4), lee sus instrucciones y crea conceptos adicionales que partan de la prenda principal pero incorporen los detalles solicitados de las fotos secundarias
4. Si solo hay 1 foto, genera 3 variantes adicionales con cambios constructivos sutiles (cuello, mangas, largo, acabados)

REGLAS:
- Cada concepto debe describir la prenda de forma técnica y precisa
- Incluir silueta, detalles constructivos, acabados, y proporción
- Describir tanto la VISTA FRONTAL como la VISTA TRASERA
- Las descripciones deben ser lo suficientemente detalladas para que un ilustrador pueda dibujar la prenda EXACTA
- El CONCEPTO 1 SIEMPRE se llama "Fiel al original" y describe EXACTAMENTE lo que se ve en la foto principal
- Escribe en español

FORMATO DE SALIDA (JSON puro, sin markdown):
{
  "concepts": [
    {
      "id": "1",
      "title": "Fiel al original",
      "description": "Descripción técnica completa y fiel de la prenda tal como aparece en la foto principal. Vista frontal: ... Vista trasera: ..."
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

// Image-to-image: prompt sent to Gemini WITH the reference photo to convert it to a technical sketch
export function buildSketchFromPhotoPrompt(
  view: 'front' | 'back',
  garmentType: string,
  conceptDescription: string
): string {
  if (view === 'front') {
    return `Convierte esta foto de prenda en un FLAT SKETCH técnico de moda (dibujo plano técnico / fashion flat).

REQUISITOS CRÍTICOS — ESTILO FLAT SKETCH:
- Dibuja la prenda PLANA, como si estuviera extendida sobre una mesa — SIN CUERPO, SIN MANIQUÍ, SIN FIGURA HUMANA
- Vista FRONTAL de la prenda sola, completamente simétrica
- Copia fielmente TODOS los detalles de la foto: silueta, proporciones, largo, corte, cuello, mangas, bolsillos, botones, cremalleras, costuras, cierres (alamares, frog closures, etc.)
- SOLO líneas negras finas sobre fondo blanco puro — como un dibujo técnico de patronaje a mano
- Líneas de contorno limpias y definidas
- Líneas de costura internas con trazo discontinuo (pespuntes, pinzas, uniones de piezas)
- Detalles constructivos visibles: topstitching, ribetes, ojales, botones (como círculos pequeños), cremalleras, pliegues
- SIN color, SIN relleno, SIN sombreado, SIN degradados — solo trazos de línea
- SIN fondo decorativo — fondo completamente blanco
- NO incluir texto, etiquetas, medidas ni anotaciones en la imagen
- El resultado debe parecer un dibujo técnico hecho a mano con rotulador fino negro sobre papel blanco

PRENDA: ${garmentType}
MODIFICACIONES: ${conceptDescription}`;
  }

  return `Basándote en esta foto de la prenda, dibuja la VISTA TRASERA como un FLAT SKETCH técnico de moda.

REQUISITOS CRÍTICOS — ESTILO FLAT SKETCH:
- Dibuja la VISTA TRASERA de esta MISMA prenda, PLANA — SIN CUERPO, SIN MANIQUÍ, SIN FIGURA HUMANA
- La prenda extendida como si estuviera sobre una mesa, vista desde atrás
- Interpreta la parte trasera coherentemente con el diseño frontal visible en la foto
- SOLO líneas negras finas sobre fondo blanco puro — como un dibujo técnico de patronaje a mano
- Líneas de contorno limpias y definidas
- Líneas de costura internas con trazo discontinuo (costuras de espalda, pinzas, canesú)
- Detalles constructivos traseros: costuras centrales, cremallera trasera si aplica, aberturas, ventilaciones, etiqueta
- SIN color, SIN relleno, SIN sombreado, SIN degradados — solo trazos de línea
- SIN fondo decorativo — fondo completamente blanco
- NO incluir texto, etiquetas, medidas ni anotaciones en la imagen
- El resultado debe parecer un dibujo técnico hecho a mano con rotulador fino negro sobre papel blanco

PRENDA: ${garmentType}
MODIFICACIONES: ${conceptDescription}`;
}

// Text-only prompt for image generation (fallback when no reference photo available)
export function buildImagePrompt(concept: string, view: 'front' | 'back', garmentType: string): string {
  const viewLabel = view === 'front' ? 'FRONTAL' : 'TRASERA (de espaldas)';
  return `Generate a clean technical fashion FLAT SKETCH drawing.

REQUIREMENTS:
- Vista ${viewLabel} de la prenda PLANA, extendida — SIN CUERPO, SIN MANIQUÍ, SIN FIGURA HUMANA
- La prenda dibujada sola, simétrica, como si estuviera sobre una mesa
- Estilo: dibujo técnico de moda a línea negra fina sobre fondo blanco puro
- Incluir todos los detalles constructivos: costuras, botones, pliegues, cierres, topstitching, ojales
- Líneas de costura internas con trazo discontinuo
- Estilo similar a un flat sketch de ficha técnica profesional de moda / tech pack
- Solo líneas negras — SIN color, SIN relleno, SIN sombreado
- Fondo completamente blanco
- NO incluir texto, etiquetas ni anotaciones en la imagen
- El resultado debe parecer un dibujo técnico hecho a mano con rotulador fino negro

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

RECUERDA: El concepto 1 SIEMPRE es "Fiel al original" — copia exacta de la foto principal. Los conceptos 2-4 parten de esa base e incorporan cambios. Solo JSON, sin markdown.`;
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
