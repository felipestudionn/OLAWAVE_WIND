export type TechPackStatus = 'draft' | 'generating' | 'complete' | 'error';

export type GarmentType =
  | 'top'
  | 'blouse'
  | 'shirt'
  | 'jacket'
  | 'blazer'
  | 'dress'
  | 'pants'
  | 'skirt'
  | 'set'
  | 'coat'
  | 'other';

export interface UploadedImage {
  file: File | null;
  base64: string;
  mimeType: string;
  instructions: string;
  previewUrl: string;
}

export interface GarmentDetails {
  garmentType: GarmentType | '';
  season: string;
  styleName: string;
  fabric: string;
  additionalNotes: string;
}

export interface ConstructionNote {
  text: string;
  position: string;
  x: number;
  y: number;
}

export interface SuggestedMeasurements {
  bust: string;
  waist: string;
  seat: string;
  totalLength: string;
  sleeveLength: string;
  [key: string]: string;
}

export interface TechPackResult {
  sketchFrontSvg: string;
  sketchBackSvg: string;
  technicalDescription: string;
  constructionNotes: ConstructionNote[];
  suggestedMeasurements: SuggestedMeasurements;
}

export interface TechPack {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  brand_name: string;
  designer_name: string;
  season: string;
  style_name: string;
  pattern_cutter: string;
  extension: string;
  garment_type: string;
  reference_images: Array<{ base64: string; mimeType: string; instructions: string }>;
  fabric: string;
  fabric_swatch_base64: string | null;
  additional_notes: string;
  sketch_front_svg: string | null;
  sketch_back_svg: string | null;
  technical_description: string | null;
  construction_notes: ConstructionNote[];
  suggested_measurements: SuggestedMeasurements;
  edited_measurements: Record<string, string>;
  edited_notes: ConstructionNote[] | null;
  comments: string;
  status: TechPackStatus;
}
