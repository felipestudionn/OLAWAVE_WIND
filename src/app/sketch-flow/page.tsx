'use client';

import { useState, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import ImageUploader from '@/components/sketch-flow/ImageUploader';
import PhotoCard from '@/components/sketch-flow/PhotoCard';
import GarmentDetailsForm from '@/components/sketch-flow/GarmentDetailsForm';
import TechPackPreview from '@/components/sketch-flow/TechPackPreview';
import { useAuth } from '@/contexts/AuthContext';
import { useTechPacks } from '@/hooks/useTechPacks';
import { exportTechPackPDF, exportTechPackPNG } from '@/lib/export-pdf';
import {
  UploadedImage,
  GarmentDetails,
  TechPackResult,
} from '@/types/tech-pack';
import {
  PenTool,
  Loader2,
  Download,
  Image as ImageIcon,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  FileDown,
  ChevronDown,
} from 'lucide-react';

export default function SketchFlowPage() {
  const { user } = useAuth();
  const { saveTechPack } = useTechPacks(user?.id);
  const techPackRef = useRef<HTMLDivElement>(null);

  // Wizard state
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [garmentDetails, setGarmentDetails] = useState<GarmentDetails>({
    garmentType: '',
    season: '',
    styleName: '',
    fabric: '',
    additionalNotes: '',
  });
  const [techPackResult, setTechPackResult] = useState<TechPackResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const canGenerate = images.length >= 1 && garmentDetails.garmentType !== '';

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setError(null);
    setTechPackResult(null);
    setSaved(false);

    try {
      setGenerationStep('Analyzing reference photos...');

      const payload = {
        images: images.map((img) => ({
          base64: img.base64,
          mimeType: img.mimeType,
          instructions: img.instructions,
        })),
        garmentType: garmentDetails.garmentType,
        season: garmentDetails.season,
        styleName: garmentDetails.styleName,
        fabric: garmentDetails.fabric,
        additionalNotes: garmentDetails.additionalNotes,
      };

      setGenerationStep('Generating technical sketches...');

      const response = await fetch('/api/ai/generate-techpack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Generation failed');
      }

      const result: TechPackResult = await response.json();
      setTechPackResult(result);
      setGenerationStep('');

      // Auto-save if user is authenticated
      if (user) {
        try {
          await saveTechPack({
            season: garmentDetails.season || 'N/A',
            style_name: garmentDetails.styleName || 'Untitled',
            garment_type: garmentDetails.garmentType,
            fabric: garmentDetails.fabric,
            additional_notes: garmentDetails.additionalNotes,
            reference_images: [],
            sketch_front_svg: result.sketchFrontSvg,
            sketch_back_svg: result.sketchBackSvg,
            technical_description: result.technicalDescription,
            construction_notes: result.constructionNotes,
            suggested_measurements: result.suggestedMeasurements,
            status: 'complete',
          });
          setSaved(true);
        } catch {
          // Non-critical - don't show error for save failure
          console.warn('Auto-save failed');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setGenerationStep('');
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, images, garmentDetails, user, saveTechPack]);

  const handleReset = useCallback(() => {
    setTechPackResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!techPackRef.current) return;
    const name = garmentDetails.styleName || 'tech-pack';
    await exportTechPackPDF(techPackRef.current, `${name}.pdf`);
    setShowExportMenu(false);
  }, [garmentDetails.styleName]);

  const handleExportPNG = useCallback(async () => {
    if (!techPackRef.current) return;
    const name = garmentDetails.styleName || 'tech-pack';
    await exportTechPackPNG(techPackRef.current, `${name}.png`);
    setShowExportMenu(false);
  }, [garmentDetails.styleName]);

  const handleInstructionChange = useCallback((index: number, instruction: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, instructions: instruction } : img))
    );
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen bg-[#fff6dc]">
      <Navbar />
      <main className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SketchFlow</h1>
            </div>
            <p className="text-gray-500 text-sm max-w-xl">
              Upload reference photos, tell us what you like from each one, and our AI will generate a complete fashion tech pack with technical sketches ready for your pattern team.
            </p>
          </div>

          {/* Result view */}
          {techPackResult ? (
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Edit inputs
                </button>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-xs text-green-600 font-medium">Saved</span>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                        <button
                          onClick={handleExportPDF}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          Download PDF
                        </button>
                        <button
                          onClick={handleExportPNG}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          Download PNG
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tech Pack Preview - scrollable container */}
              <div className="overflow-x-auto pb-4">
                <div className="mx-auto" style={{ width: 794 }}>
                  <TechPackPreview
                    ref={techPackRef}
                    techPack={techPackResult}
                    season={garmentDetails.season}
                    styleName={garmentDetails.styleName}
                    fabric={garmentDetails.fabric}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Wizard input view */
            <div className="space-y-8">
              {/* Step 1: Upload photos */}
              <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm font-medium text-gray-500">Reference photos</span>
                </div>
                <ImageUploader images={images} onImagesChange={setImages} />
              </section>

              {/* Step 2: Instructions per photo */}
              {images.length > 0 && (
                <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-sm font-medium text-gray-500">What do you want from each photo?</span>
                  </div>
                  <div className="space-y-3">
                    {images.map((img, i) => (
                      <PhotoCard
                        key={i}
                        image={img}
                        index={i}
                        onInstructionChange={handleInstructionChange}
                        onRemove={handleRemoveImage}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Step 3: Garment details */}
              <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm font-medium text-gray-500">General details</span>
                </div>
                <GarmentDetailsForm details={garmentDetails} onChange={setGarmentDetails} />
              </section>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Generate button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium transition-all shadow-lg
                    ${canGenerate && !isGenerating
                      ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {generationStep || 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Tech Pack
                    </>
                  )}
                </button>
              </div>

              {/* Generating overlay */}
              {isGenerating && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium">{generationStep}</p>
                  <p className="text-gray-500 text-sm mt-1">This may take 20-40 seconds</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
