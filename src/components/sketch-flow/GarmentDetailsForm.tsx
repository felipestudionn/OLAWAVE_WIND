'use client';

import { GarmentDetails, GarmentType } from '@/types/tech-pack';

interface GarmentDetailsFormProps {
  details: GarmentDetails;
  onChange: (details: GarmentDetails) => void;
}

const GARMENT_TYPES: { value: GarmentType; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'blouse', label: 'Blusa' },
  { value: 'shirt', label: 'Camisa' },
  { value: 'jacket', label: 'Chaqueta' },
  { value: 'blazer', label: 'Blazer' },
  { value: 'dress', label: 'Vestido' },
  { value: 'pants', label: 'Pantalón' },
  { value: 'skirt', label: 'Falda' },
  { value: 'set', label: 'Conjunto' },
  { value: 'coat', label: 'Abrigo' },
  { value: 'other', label: 'Otro' },
];

const SEASONS = [
  'SS26',
  'PF26',
  'Resort 2026',
  'FW26',
  'SS27',
  'FW27',
];

export default function GarmentDetailsForm({ details, onChange }: GarmentDetailsFormProps) {
  const update = (field: keyof GarmentDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Detalles de la prenda</h3>
      <p className="text-sm text-gray-500 mb-4">Define el tipo, temporada y tejido de tu ficha técnica.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de prenda *</label>
          <select
            value={details.garmentType}
            onChange={(e) => update('garmentType', e.target.value)}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          >
            <option value="">Seleccionar tipo...</option>
            {GARMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temporada</label>
          <select
            value={details.season}
            onChange={(e) => update('season', e.target.value)}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          >
            <option value="">Seleccionar temporada...</option>
            {SEASONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de estilo</label>
          <input
            type="text"
            value={details.styleName}
            onChange={(e) => update('styleName', e.target.value)}
            placeholder="Ej: Set Tweed, Blazer Oversize..."
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tejido principal</label>
          <input
            type="text"
            value={details.fabric}
            onChange={(e) => update('fabric', e.target.value)}
            placeholder="Ej: Tweed rojo/negro, Satén, Denim..."
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder:text-gray-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
          <textarea
            value={details.additionalNotes}
            onChange={(e) => update('additionalNotes', e.target.value)}
            placeholder="Ej: 'Peplum en espalda', 'Vivo de 3cm desfluecado ambos lados', 'Fit oversize'..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
