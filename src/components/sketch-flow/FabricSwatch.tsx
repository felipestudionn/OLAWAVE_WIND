'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FabricSwatchProps {
  swatchBase64: string | null;
  fabricName: string;
  onUpload: (base64: string) => void;
}

export default function FabricSwatch({ swatchBase64, fabricName, onUpload }: FabricSwatchProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div>
      <div
        className="w-16 h-16 border border-gray-300 rounded cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {swatchBase64 ? (
          <img src={swatchBase64} alt="Fabric swatch" className="w-full h-full object-cover" />
        ) : (
          <Upload className="h-4 w-4 text-gray-300" />
        )}
      </div>
      {fabricName && (
        <p className="text-[8px] text-gray-500 mt-0.5 max-w-[64px] truncate">{fabricName}</p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
