'use client';

import { SketchOption } from '@/types/tech-pack';
import { Check } from 'lucide-react';

interface SketchOptionCardProps {
  option: SketchOption;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SketchOptionCard({ option, isSelected, onSelect }: SketchOptionCardProps) {
  // Extract just the title (before the colon in the description)
  const title = option.description.split(':')[0] || `Opción ${option.id}`;

  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl border-2 p-3 transition-all text-left w-full
        ${isSelected
          ? 'border-gray-900 bg-gray-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
        }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Sketch previews */}
      <div className="flex gap-2 mb-2">
        {/* Front */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden">
          <img
            src={option.frontImageBase64}
            alt="Vista frontal"
            className="w-full h-auto object-contain"
            style={{ maxHeight: 200 }}
          />
          <p className="text-[8px] text-gray-400 text-center py-0.5 uppercase tracking-wider">Frontal</p>
        </div>
        {/* Back */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden">
          <img
            src={option.backImageBase64}
            alt="Vista trasera"
            className="w-full h-auto object-contain"
            style={{ maxHeight: 200 }}
          />
          <p className="text-[8px] text-gray-400 text-center py-0.5 uppercase tracking-wider">Trasera</p>
        </div>
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-gray-800 line-clamp-2">{title}</p>
    </button>
  );
}
