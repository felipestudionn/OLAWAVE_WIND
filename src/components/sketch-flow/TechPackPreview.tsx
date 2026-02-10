'use client';

import { forwardRef, useState, useCallback } from 'react';
import { ConstructionNote, SuggestedMeasurements, SketchOption } from '@/types/tech-pack';
import RedNote from './RedNote';
import MetadataHeader from './MetadataHeader';
import FabricSwatch from './FabricSwatch';

interface TechPackPreviewProps {
  selectedSketch: SketchOption;
  selectedNotes: ConstructionNote[];
  suggestedMeasurements?: SuggestedMeasurements;
  season: string;
  styleName: string;
  fabric: string;
}

const MEASUREMENT_LINES = [
  { label: 'bust', y: 22 },
  { label: 'waist', y: 32 },
  { label: 'seat', y: 40 },
];

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
    const [swatchBase64, setSwatchBase64] = useState<string | null>(null);

    const handleHeaderChange = useCallback((field: string, value: string) => {
      setHeaderFields((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleNoteChange = useCallback((index: number, text: string) => {
      setNotes((prev) => prev.map((n, i) => (i === index ? { ...n, text } : n)));
    }, []);

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
        {/* Header */}
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

        {/* Main sketch area — mannequin + sketch overlay */}
        <div className="flex" style={{ minHeight: 720 }}>
          {/* Measurement labels — left side */}
          <div className="relative flex-shrink-0" style={{ width: 80 }}>
            {MEASUREMENT_LINES.map((line) => (
              <div
                key={line.label}
                className="absolute flex items-center"
                style={{ top: `${line.y}%`, left: 0, right: 0 }}
              >
                <span className="text-[8px] text-gray-400 font-medium tracking-wide mr-1 whitespace-nowrap">
                  {line.label}
                </span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
              </div>
            ))}
          </div>

          {/* Mannequin + sketch container */}
          <div className="flex-1 relative" style={{ maxWidth: 500, margin: '0 auto' }}>
            {/* Layer 1: Mannequin image (light pencil figure) */}
            <img
              src="/images/mannequin-front.png"
              alt="Maniquí"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Layer 2: Sketch image (multiply blend — white disappears, black lines stay) */}
            <img
              src={selectedSketch.frontImageBase64}
              alt="Vista frontal"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Layer 3: Red construction notes */}
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

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-gray-400 font-medium uppercase tracking-wider">
              Frontal
            </div>
          </div>
        </div>

        {/* Bottom: Fabric swatch only */}
        <div className="mt-2">
          <p className="text-[8px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Tejido</p>
          <FabricSwatch
            swatchBase64={swatchBase64}
            fabricName={fabric}
            onUpload={setSwatchBase64}
          />
        </div>
      </div>
    );
  }
);

export default TechPackPreview;
