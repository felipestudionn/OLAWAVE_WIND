'use client';

import { X } from 'lucide-react';
import { UploadedImage } from '@/types/tech-pack';

interface PhotoCardProps {
  image: UploadedImage;
  index: number;
  onInstructionChange: (index: number, instruction: string) => void;
  onRemove: (index: number) => void;
}

export default function PhotoCard({ image, index, onInstructionChange, onRemove }: PhotoCardProps) {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="relative w-24 h-32 flex-shrink-0">
        <img
          src={image.previewUrl}
          alt={`Reference ${index + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-1.5 -right-1.5 p-0.5 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center rounded-b-lg font-medium">
          Photo {index + 1}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What do you like from this photo?
        </label>
        <textarea
          value={image.instructions}
          onChange={(e) => onInstructionChange(index, e.target.value)}
          placeholder="e.g. 'The collar and shoulder details', 'The buttons and length'..."
          className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
