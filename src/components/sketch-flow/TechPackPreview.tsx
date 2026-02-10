'use client';

import { forwardRef, useState, useCallback } from 'react';
import { TechPackResult, ConstructionNote, SuggestedMeasurements } from '@/types/tech-pack';
import CroquisFrontal from './CroquisFrontal';
import CroquisTrasero from './CroquisTrasero';
import SketchOverlay from './SketchOverlay';
import RedNote from './RedNote';
import MeasurementLines from './MeasurementLines';
import MetadataHeader from './MetadataHeader';
import MeasurementsGrid from './MeasurementsGrid';
import FabricSwatch from './FabricSwatch';

interface TechPackPreviewProps {
  techPack: TechPackResult;
  season: string;
  styleName: string;
  fabric: string;
}

const TechPackPreview = forwardRef<HTMLDivElement, TechPackPreviewProps>(
  function TechPackPreview({ techPack, season, styleName, fabric }, ref) {
    const [headerFields, setHeaderFields] = useState({
      brandName: '',
      designerName: '',
      patternCutter: '',
      extension: '',
      styleName: styleName || '',
      dateCreated: new Date().toLocaleDateString('en-GB'),
    });

    const [notes, setNotes] = useState<ConstructionNote[]>(techPack.constructionNotes || []);
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

    // Separate notes for front and back
    const frontNotes = notes.filter((n) => !n.position.includes('back'));
    const backNotes = notes.filter((n) => n.position.includes('back'));

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

        {/* Sketch area */}
        <div className="flex gap-2 mb-4" style={{ minHeight: 420 }}>
          {/* Measurement lines */}
          <div className="relative flex-shrink-0" style={{ width: 60 }}>
            <MeasurementLines
              measurements={{
                bust: techPack.suggestedMeasurements?.bust,
                waist: techPack.suggestedMeasurements?.waist,
                seat: techPack.suggestedMeasurements?.seat,
              }}
            />
          </div>

          {/* Front croquis + sketch */}
          <div className="flex-1 relative" style={{ maxWidth: 300, height: 420 }}>
            <div className="absolute inset-0">
              <CroquisFrontal className="w-full h-full opacity-35" />
            </div>
            <div className="absolute inset-0">
              <SketchOverlay svgContent={techPack.sketchFrontSvg} />
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
            <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-gray-400 font-medium">
              FRONT
            </div>
          </div>

          {/* Back croquis + sketch */}
          <div className="flex-1 relative" style={{ maxWidth: 300, height: 420 }}>
            <div className="absolute inset-0">
              <CroquisTrasero className="w-full h-full opacity-35" />
            </div>
            <div className="absolute inset-0">
              <SketchOverlay svgContent={techPack.sketchBackSvg} />
            </div>
            {/* Back notes */}
            <div className="absolute inset-0 pointer-events-none">
              {backNotes.map((note, i) => (
                <RedNote
                  key={`back-${i}`}
                  note={note}
                  onTextChange={(text) => {
                    const originalIndex = notes.findIndex((n) => n === note);
                    if (originalIndex !== -1) handleNoteChange(originalIndex, text);
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-gray-400 font-medium">
              BACK
            </div>
          </div>
        </div>

        {/* Technical description */}
        {techPack.technicalDescription && (
          <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
            <p className="text-[9px] text-gray-600 leading-relaxed">
              {techPack.technicalDescription}
            </p>
          </div>
        )}

        {/* Bottom section: Fabric swatch + Measurements */}
        <div className="flex gap-4">
          {/* Fabric swatch area */}
          <div className="flex-shrink-0">
            <p className="text-[8px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Fabric</p>
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

        {/* Comments area */}
        <div className="mt-3 border-t border-gray-300 pt-2">
          <p className="text-[8px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Comments</p>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setComments(e.currentTarget.textContent || '')}
            className="min-h-[40px] p-2 text-[9px] text-gray-600 bg-gray-50 rounded border border-gray-200 outline-none focus:border-gray-400"
            style={{ lineHeight: 1.5 }}
          >
            {comments || 'Additional construction and pattern notes...'}
          </div>
        </div>
      </div>
    );
  }
);

export default TechPackPreview;
