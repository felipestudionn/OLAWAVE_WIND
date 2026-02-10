'use client';

import { useCallback, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { UploadedImage } from '@/types/tech-pack';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

function resizeAndConvert(file: File, maxSize: number = 1024): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context failed'));
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve({
          base64,
          mimeType: file.type || 'image/jpeg',
          previewUrl: dataUrl,
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onImagesChange, maxImages = 4 }: ImageUploaderProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFile = useCallback(async (file: File, slotIndex: number) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return;
    try {
      const { base64, mimeType, previewUrl } = await resizeAndConvert(file);
      const newImages = [...images];
      const existing = newImages[slotIndex];
      newImages[slotIndex] = {
        file,
        base64,
        mimeType,
        instructions: existing?.instructions || '',
        previewUrl,
      };
      onImagesChange(newImages);
    } catch (err) {
      console.error('Error processing image:', err);
    }
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, slotIndex);
  }, [handleFile]);

  const handleRemove = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const slots = Array.from({ length: maxImages }, (_, i) => images[i] || null);

  const slotLabel = (i: number) => i === 0 ? 'Foto principal' : `Ref. ${i + 1}`;
  const emptyLabel = (i: number) => {
    if (i === 0) return images.length === 0 ? 'Añadir foto principal' : 'Foto principal';
    return `Ref. ${i + 1} (opcional)`;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Fotos de referencia</h3>
      <p className="text-sm text-gray-500 mb-4">
        Sube la <strong>foto principal</strong> de la prenda y, opcionalmente, fotos secundarias para tomar detalles específicos.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slots.map((img, i) => (
          <div
            key={i}
            className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer
              ${i === 0 && !img ? 'border-gray-900 bg-gray-50 hover:bg-gray-100' : ''}
              ${i === 0 && img ? 'border-gray-900 bg-gray-50' : ''}
              ${i !== 0 && !img ? 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50' : ''}
              ${i !== 0 && img ? 'border-gray-300 bg-gray-50' : ''}`}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, i)}
            onClick={() => !img && fileInputRefs.current[i]?.click()}
          >
            {img ? (
              <>
                <img
                  src={img.previewUrl}
                  alt={`Reference ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                  className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-600" />
                </button>
                <div className={`absolute bottom-0 left-0 right-0 text-white text-xs py-1 px-2 rounded-b-xl text-center font-medium
                  ${i === 0 ? 'bg-gray-900/80' : 'bg-black/50'}`}>
                  {slotLabel(i)}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                {i === 0 && images.length === 0 ? (
                  <Upload className="h-6 w-6 text-gray-600" />
                ) : (
                  <ImageIcon className="h-5 w-5" />
                )}
                <span className={`text-xs font-medium text-center px-2 ${i === 0 ? 'text-gray-600' : ''}`}>
                  {emptyLabel(i)}
                </span>
              </div>
            )}
            <input
              ref={(el) => { fileInputRefs.current[i] = el; }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, images.length < maxImages ? (img ? i : images.length) : i);
                e.target.value = '';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
