'use client';

import { forwardRef, useState, useCallback } from 'react';
import { ConstructionNote, SuggestedMeasurements, SketchOption } from '@/types/tech-pack';
import RedNote from './RedNote';
import MeasurementLines from './MeasurementLines';
import MetadataHeader from './MetadataHeader';
import MeasurementsGrid from './MeasurementsGrid';
import FabricSwatch from './FabricSwatch';

interface TechPackPreviewProps {
  selectedSketch: SketchOption;
  selectedNotes: ConstructionNote[];
  suggestedMeasurements?: SuggestedMeasurements;
  season: string;
  styleName: string;
  fabric: string;
}

const TechPackPreview = forwardRef<HTMLDivElement, TechPackPreviewProps>(
  function TechPackPreview({ selectedSketch, selectedNotes, suggestedMeasurements, season, styleName, fabric }, ref) {
    const [headerFields, setHeaderFields] = useState({
      brandName: '',
      designerName: '',
      patternCutter: '',
      extension: '',
      styleName: styleName || '',
      dateCreated: new Date().toLocaleDateString('es-ES'),
    });

    const [notes, setNotes] = useState<ConstructionNote[]>(selectedNotes || []);
    const [measurements, setMeasurements] = useState<Record<string, string>>({});
    const [comments, setComments] = useState('');
    const [swatchBase64, setSwatchBase64] = useState<string | null>(null);

    const handleHeaderChange = useCallback((field: string, value: string) => {
      setHeaderFields((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleNoteChange = useCallback((index: number, text: string) => {
      setNotes((prev) => prev.map((n, i) => (i === index ? { ...n, text } : n)));
    }, []);

    const handleMeasurementChange = useCallback((key: string, value: string) => {
      setMeasurements((prev) => ({ ...prev, [key]: value }));
    }, []);

    // All notes are front-only
    const frontNotes = notes;

    return (
      <div
        ref={ref}
        className="bg-white shadow-lg mx-auto"
        style={{
          width: 794,
          minHeight: 1123,
          padding: '24px 28px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        {/* Header — identical to reference */}
        <MetadataHeader
          brandName={headerFields.brandName}
          designerName={headerFields.designerName}
          season={season}
          styleName={headerFields.styleName}
          patternCutter={headerFields.patternCutter}
          extension={headerFields.extension}
          dateCreated={headerFields.dateCreated}
          onFieldChange={handleHeaderChange}
        />

        {/* Sketch area — single front view */}
        <div className="flex gap-2 mb-4" style={{ minHeight: 560 }}>
          {/* Measurement lines — left side */}
          <div className="relative flex-shrink-0" style={{ width: 60 }}>
            <MeasurementLines
              measurements={{
                bust: suggestedMeasurements?.bust,
                waist: suggestedMeasurements?.waist,
                seat: suggestedMeasurements?.seat,
              }}
            />
          </div>

          {/* Front sketch image — centered, larger */}
          <div className="flex-1 relative" style={{ maxWidth: 480, height: 560, margin: '0 auto' }}>
            <div className="w-full h-full flex items-center justify-center bg-white">
              <img
                src={selectedSketch.frontImageBase64}
                alt="Vista frontal"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {/* Front notes */}
            <div className="absolute inset-0 pointer-events-none">
              {frontNotes.map((note, i) => (
                <RedNote
                  key={`front-${i}`}
                  note={note}
                  onTextChange={(text) => {
                    const originalIndex = notes.findIndex((n) => n === note);
                    if (originalIndex !== -1) handleNoteChange(originalIndex, text);
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-gray-400 font-medium uppercase tracking-wider">
              Frontal
            </div>
          </div>
        </div>

        {/* Bottom section: Fabric swatch + Measurements — matches reference */}
        <div className="flex gap-4">
          {/* Fabric swatch area — bottom left like reference */}
          <div className="flex-shrink-0">
            <p className="text-[8px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Tejido</p>
            <FabricSwatch
              swatchBase64={swatchBase64}
              fabricName={fabric}
              onUpload={setSwatchBase64}
            />
          </div>

          {/* Measurements grid */}
          <div className="flex-1">
            <MeasurementsGrid
              measurements={measurements}
              onMeasurementChange={handleMeasurementChange}
            />
          </div>
        </div>

        {/* Comments area — empty space for handwritten notes */}
        <div className="mt-3 border-t border-gray-300 pt-2">
          <p className="text-[8px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Comentarios</p>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setComments(e.currentTarget.textContent || '')}
            className="min-h-[60px] p-2 text-[9px] text-gray-600 bg-gray-50 rounded border border-gray-200 outline-none focus:border-gray-400"
            style={{ lineHeight: 1.5 }}
          >
            {comments || 'Notas adicionales de construcción y patronaje...'}
          </div>
        </div>
      </div>
    );
  }
);

export default TechPackPreview;
