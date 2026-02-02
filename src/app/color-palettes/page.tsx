'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Palette, Shuffle, Copy, Check, ArrowLeft, Search, X } from 'lucide-react';
import palettesData from '@/data/sanzo-palettes.json';

interface SanzoColor {
  name: string;
  hex: string;
}

type SanzoPalette = SanzoColor[];

export default function ColorPalettesPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [randomPalette, setRandomPalette] = useState<SanzoPalette | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const palettes = palettesData as SanzoPalette[];

  const filteredPalettes = useMemo(() => {
    if (!searchQuery.trim()) return palettes;
    
    const query = searchQuery.toLowerCase().trim();
    return palettes.filter(palette => 
      palette.some(color => 
        color.name.toLowerCase().includes(query) ||
        color.hex.toLowerCase().includes(query)
      )
    );
  }, [palettes, searchQuery]);

  const getRandomPalette = () => {
    const source = filteredPalettes.length > 0 ? filteredPalettes : palettes;
    const randomIndex = Math.floor(Math.random() * source.length);
    setRandomPalette(source[randomIndex]);
  };

  const copyToClipboard = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const displayedPalette = randomPalette;

  return (
    <div className="min-h-screen bg-[#fff6dc]">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link 
                    href="/"
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">Color Palette Inspiration</h1>
                </div>
                <p className="text-gray-600 ml-12">
                  A collection of {palettes.length} color combinations by Sanzo Wada (1883-1967)
                </p>
              </div>
              <button
                onClick={getRandomPalette}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium transition-all hover:bg-gray-800"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Random Palette
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colors... (e.g., violet, blue, red)"
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {searchQuery && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{filteredPalettes.length}</span> palettes containing "{searchQuery}"
                </span>
                {filteredPalettes.length === 0 && (
                  <span className="text-orange-600">— Try another color name</span>
                )}
              </div>
            )}
          </div>

          {/* Random Palette Display */}
          {displayedPalette && (
            <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Palette className="h-5 w-5 text-orange-500" />
                Featured Palette
              </h2>
              <div className="flex gap-4 flex-wrap">
                {displayedPalette.map((color, index) => (
                  <div key={index} className="flex-1 min-w-[150px]">
                    <div
                      className="h-32 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 relative group"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                        {copiedColor === color.hex ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Copy className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium text-gray-900">{color.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Palettes Grid */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {searchQuery ? `Matching Palettes` : 'Browse All Palettes'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPalettes.map((palette, paletteIndex) => (
              <div
                key={paletteIndex}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setRandomPalette(palette)}
              >
                <div className="flex h-20">
                  {palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 relative group/color"
                      style={{ backgroundColor: color.hex }}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(color.hex);
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/30">
                        {copiedColor === color.hex ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">
                    #{paletteIndex + 1} · {palette.length} colors
                  </p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {palette.map((color, i) => (
                      <span key={i} className="text-[10px] text-gray-400 uppercase">
                        {color.hex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
