'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Link as LinkIcon, ArrowRight, Check, X, Loader2, Sparkles, ImageIcon, FolderOpen, LogOut, AlertCircle, RefreshCw, Download, ChevronLeft, Pencil, Search, TrendingUp, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveCreativeSpaceData, type CreativeSpaceData } from '@/lib/data-sync';

interface MoodImage {
  id: string;
  src: string;
  name: string;
  source?: 'upload' | 'pinterest';
}

interface PinterestPin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dominantColor?: string;
}

interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  pin_count: number;
  image_thumbnail_url?: string;
}

interface MoodboardAnalysis {
  collectionName?: string;
  keyColors: string[];
  keyTrends: string[];
  keyBrands?: string[];
  keyItems: string[];
  keyStyles?: string[];
  keyMaterials?: string[];
  seasonalFit?: string;
  moodDescription?: string;
  targetAudience?: string;
}

interface MarketTrends {
  keyColors: string[];
  keyTrends: string[];
  keyItems: string[];
  lastUpdated?: string;
}

interface TrendExploration {
  query: string;
  keyColors: string[];
  keyTrends: string[];
  keyItems: string[];
  description: string;
}

interface SelectedTrends {
  colors: string[];
  trends: string[];
  items: string[];
}

export function CreativeSpaceClient() {
  const router = useRouter();
  const [images, setImages] = useState<MoodImage[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [pinterestBoards, setPinterestBoards] = useState<PinterestBoard[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<MoodboardAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pinterestError, setPinterestError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [viewingBoardId, setViewingBoardId] = useState<string | null>(null);
  const [boardPins, setBoardPins] = useState<PinterestPin[]>([]);
  const [loadingPins, setLoadingPins] = useState(false);
  const [selectedPins, setSelectedPins] = useState<Set<string>>(new Set());
  
  // AI Trend Insights state
  const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null);
  const [loadingMarketTrends, setLoadingMarketTrends] = useState(false);
  const [trendQuery, setTrendQuery] = useState('');
  const [trendExploration, setTrendExploration] = useState<TrendExploration | null>(null);
  const [exploringTrend, setExploringTrend] = useState(false);
  const [selectedTrends, setSelectedTrends] = useState<SelectedTrends>({
    colors: [],
    trends: [],
    items: []
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Pinterest is connected
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pinterest_connected') === 'true') {
      setPinterestConnected(true);
      loadPinterestBoards();
      // Clean up URL
      window.history.replaceState({}, '', '/creative-space');
    }

    // Check if Pinterest was disconnected
    if (urlParams.get('pinterest_disconnected') === 'true') {
      // Clean up URL
      window.history.replaceState({}, '', '/creative-space');
    }

    // Check stored Pinterest state
    const storedPinterestState = localStorage.getItem('olawave_pinterest_connected');
    if (storedPinterestState === 'true') {
      setPinterestConnected(true);
      const storedBoards = localStorage.getItem('olawave_pinterest_boards');
      if (storedBoards) {
        setPinterestBoards(JSON.parse(storedBoards));
      }
      const storedSelected = localStorage.getItem('olawave_pinterest_selected');
      if (storedSelected) {
        setSelectedBoards(JSON.parse(storedSelected));
      }
    }
  }, []);

  // Save data whenever images, selected boards, or AI analysis change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Old format for backward compat
      const summary = {
        count: images.length,
        names: images.map((img) => img.name).slice(0, 20),
      };
      window.localStorage.setItem('olawave_moodboard_summary', JSON.stringify(summary));

      // New unified format - use AI analysis if available
      const selectedBoardsData = pinterestBoards.filter(b => selectedBoards.includes(b.id));
      const creativeData: CreativeSpaceData = {
        moodboardImages: images.map(img => ({
          id: img.id,
          name: img.name,
          url: img.src
        })),
        pinterestBoards: selectedBoardsData.map(b => ({
          id: b.id,
          name: b.name,
          pinCount: b.pin_count
        })),
        keyColors: aiAnalysis?.keyColors || [],
        keyTrends: aiAnalysis?.keyTrends || [],
        keyItems: aiAnalysis?.keyItems || [],
        keyStyles: aiAnalysis?.keyStyles || [],
      };
      saveCreativeSpaceData(creativeData);
      
      // Store Pinterest selected boards
      if (selectedBoards.length > 0) {
        localStorage.setItem('olawave_pinterest_selected', JSON.stringify(selectedBoards));
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [images, selectedBoards, pinterestBoards, aiAnalysis]);

  // Convert image URL to base64
  const imageToBase64 = async (imageUrl: string): Promise<{ base64: string; mimeType: string } | null> => {
    try {
      // For blob URLs (uploaded files) - can fetch directly
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({ base64, mimeType: blob.type || 'image/jpeg' });
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
      
      // For external URLs (Pinterest, etc.) - use server proxy to avoid CORS
      if (imageUrl.startsWith('http')) {
        const response = await fetch('/api/proxy-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });
        
        if (response.ok) {
          const data = await response.json();
          return { base64: data.base64, mimeType: data.mimeType };
        }
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Analyze moodboard with AI - sends actual images to Gemini Vision
  const analyzeMoodboard = async () => {
    if (images.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      // Convert all images to base64 for Gemini Vision
      console.log(`Converting ${images.length} images to base64...`);
      const imagePromises = images.map(img => imageToBase64(img.src));
      const base64Images = await Promise.all(imagePromises);
      
      // Filter out failed conversions
      const validImages = base64Images.filter((img): img is { base64: string; mimeType: string } => img !== null);
      
      if (validImages.length === 0) {
        console.error('No images could be converted');
        return;
      }
      
      console.log(`Sending ${validImages.length} images to Gemini Vision...`);
      
      const response = await fetch('/api/ai/analyze-moodboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: validImages,
        }),
      });

      const data = await response.json();
      console.log('API Response status:', response.status);
      console.log('API Response data:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        // Check if we got valid analysis data
        if (data && (data.keyColors || data.keyTrends || data.keyItems)) {
          console.log('Setting AI Analysis:', data);
          setAiAnalysis(data);
        } else if (data.error) {
          console.error('API returned error:', data.error);
          alert(`Error: ${data.error}`);
        } else {
          console.error('Invalid analysis data received:', data);
        }
      } else {
        console.error('Analysis failed:', data);
        alert(`Analysis failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error analyzing moodboard:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPinterestBoards = async () => {
    setLoadingBoards(true);
    setPinterestError(null);
    try {
      const res = await fetch('/api/pinterest/boards');
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific error codes
        if (data.code === 'TOKEN_EXPIRED' || data.code === 'NO_TOKEN') {
          setPinterestError('Tu sesión de Pinterest ha expirado. Por favor, reconecta tu cuenta.');
          // Auto-disconnect on token expiry
          handlePinterestDisconnect();
          return;
        }
        setPinterestError(data.error || 'Error al cargar los boards de Pinterest');
        return;
      }
      
      if (data.items && Array.isArray(data.items)) {
        setPinterestBoards(data.items);
        localStorage.setItem('olawave_pinterest_boards', JSON.stringify(data.items));
        localStorage.setItem('olawave_pinterest_connected', 'true');
        setShowBoardSelector(true);
        setPinterestError(null);
      } else {
        setPinterestError('No se encontraron boards en tu cuenta de Pinterest');
      }
    } catch (err) {
      console.error('Error loading boards:', err);
      setPinterestError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoadingBoards(false);
    }
  };

  const handlePinterestDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await fetch('/api/auth/pinterest/signout', { method: 'POST' });
      
      // Clear local state
      setPinterestConnected(false);
      setPinterestBoards([]);
      setSelectedBoards([]);
      setPinterestError(null);
      setViewingBoardId(null);
      setBoardPins([]);
      
      // Clear localStorage
      localStorage.removeItem('olawave_pinterest_connected');
      localStorage.removeItem('olawave_pinterest_boards');
      localStorage.removeItem('olawave_pinterest_selected');
    } catch (err) {
      console.error('Error disconnecting Pinterest:', err);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const loadBoardPins = async (boardId: string) => {
    setLoadingPins(true);
    setViewingBoardId(boardId);
    setSelectedPins(new Set());
    try {
      const res = await fetch(`/api/pinterest/boards/${boardId}/pins`);
      const data = await res.json();
      
      if (res.ok && data.items) {
        setBoardPins(data.items);
      } else {
        setPinterestError('Error al cargar los pins del board');
      }
    } catch (err) {
      console.error('Error loading pins:', err);
      setPinterestError('Error de conexión al cargar pins');
    } finally {
      setLoadingPins(false);
    }
  };

  const togglePinSelection = (pinId: string) => {
    setSelectedPins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pinId)) {
        newSet.delete(pinId);
      } else {
        newSet.add(pinId);
      }
      return newSet;
    });
  };

  const selectAllPins = () => {
    if (selectedPins.size === boardPins.length) {
      setSelectedPins(new Set());
    } else {
      setSelectedPins(new Set(boardPins.map(p => p.id)));
    }
  };

  const importSelectedPins = () => {
    const pinsToImport = boardPins.filter(pin => selectedPins.has(pin.id));
    const newImages: MoodImage[] = pinsToImport.map(pin => ({
      id: `pinterest-${pin.id}`,
      src: pin.imageUrl,
      name: pin.title || 'Pinterest Pin',
      source: 'pinterest' as const,
    }));
    
    // Add to moodboard, avoiding duplicates
    setImages(prev => {
      const existingIds = new Set(prev.map(img => img.id));
      const uniqueNew = newImages.filter(img => !existingIds.has(img.id));
      return [...prev, ...uniqueNew];
    });
    
    // Go back to board list
    setViewingBoardId(null);
    setBoardPins([]);
    setSelectedPins(new Set());
  };

  const importAllBoardPins = async (boardId: string) => {
    setLoadingPins(true);
    try {
      const res = await fetch(`/api/pinterest/boards/${boardId}/pins`);
      const data = await res.json();
      
      if (res.ok && data.items) {
        const newImages: MoodImage[] = data.items.map((pin: PinterestPin) => ({
          id: `pinterest-${pin.id}`,
          src: pin.imageUrl,
          name: pin.title || 'Pinterest Pin',
          source: 'pinterest' as const,
        }));
        
        setImages(prev => {
          const existingIds = new Set(prev.map(img => img.id));
          const uniqueNew = newImages.filter(img => !existingIds.has(img.id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error('Error importing board:', err);
    } finally {
      setLoadingPins(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newImages: MoodImage[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        src: url,
        name: file.name,
      });
    });

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handlePinterestConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI || 'https://olawave.ai/api/auth/pinterest/callback';
    const scope = 'boards:read,pins:read';
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;
    
    window.location.href = authUrl;
  };

  const toggleBoardSelection = (boardId: string) => {
    setSelectedBoards(prev => 
      prev.includes(boardId) 
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const hasContent = images.length > 0 || selectedBoards.length > 0;

  const handleContinue = () => {
    router.push('/ai-advisor');
  };

  // Load market trends
  const loadMarketTrends = async () => {
    setLoadingMarketTrends(true);
    try {
      const response = await fetch('/api/ai/market-trends');
      if (response.ok) {
        const data = await response.json();
        setMarketTrends(data);
      }
    } catch (error) {
      console.error('Error loading market trends:', error);
    } finally {
      setLoadingMarketTrends(false);
    }
  };

  // Explore a specific trend
  const exploreTrend = async () => {
    if (!trendQuery.trim()) return;
    
    setExploringTrend(true);
    try {
      const response = await fetch('/api/ai/explore-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trendQuery }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrendExploration(data);
      }
    } catch (error) {
      console.error('Error exploring trend:', error);
    } finally {
      setExploringTrend(false);
    }
  };

  // Toggle selection of a trend item
  const toggleTrendSelection = (type: 'colors' | 'trends' | 'items', value: string) => {
    setSelectedTrends(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  // Add all items from exploration to selection
  const addExplorationToSelection = () => {
    if (!trendExploration) return;
    setSelectedTrends(prev => ({
      colors: Array.from(new Set([...prev.colors, ...trendExploration.keyColors])),
      trends: Array.from(new Set([...prev.trends, ...trendExploration.keyTrends])),
      items: Array.from(new Set([...prev.items, ...trendExploration.keyItems]))
    }));
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
            1
          </div>
          <div>
            <h3 className="font-semibold">Step 1: Inspiration</h3>
            <p className="text-sm text-muted-foreground">Build your creative moodboard</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-pink-100 text-pink-700">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Analyzed
        </Badge>
      </div>

      {/* Main Moodboard Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Your Creative Moodboard
              </CardTitle>
              <CardDescription>
                Upload images or connect Pinterest to define your collection's visual direction
              </CardDescription>
            </div>
            {images.length > 0 && (
              <Button 
                onClick={analyzeMoodboard} 
                disabled={isAnalyzing}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Masonry Grid - Images First */}
            {images.length > 0 && (
              <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative group overflow-hidden rounded-lg border bg-background break-inside-avoid"
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                      style={{ 
                        // Vary heights for masonry effect
                        minHeight: index % 3 === 0 ? '200px' : index % 3 === 1 ? '150px' : '180px'
                      }}
                    />
                    <button
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      onClick={() => removeImage(img.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {img.source === 'pinterest' && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Pinterest
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Compact Upload Area - Below Images */}
            <label className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all ${images.length > 0 ? 'p-4' : 'p-8'}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className={`rounded-full bg-primary/10 flex items-center justify-center ${images.length > 0 ? 'w-8 h-8' : 'w-12 h-12'}`}>
                <Plus className={`text-primary ${images.length > 0 ? 'h-4 w-4' : 'h-6 w-6'}`} />
              </div>
              <div className="text-center">
                <p className={`font-medium ${images.length > 0 ? 'text-sm' : ''}`}>
                  {images.length > 0 ? 'Add more images' : 'Drop images here or click to upload'}
                </p>
                {images.length === 0 && (
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF up to 10MB each</p>
                )}
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <Input
                    value={aiAnalysis.collectionName || ''}
                    onChange={(e) => setAiAnalysis({ ...aiAnalysis, collectionName: e.target.value })}
                    placeholder="Collection Name"
                    className="text-xl font-semibold text-purple-900 bg-transparent border-none hover:bg-white/50 focus:bg-white/80 px-2 py-1 h-auto transition-colors"
                  />
                  <Pencil className="h-4 w-4 text-purple-400 flex-shrink-0" />
                </div>
                <CardDescription className="mt-1">
                  {aiAnalysis.moodDescription || 'Insights extracted from your creative direction'}
                </CardDescription>
              </div>
              {aiAnalysis.seasonalFit && (
                <Badge className="bg-purple-600 text-white text-sm px-3 py-1 flex-shrink-0">
                  {aiAnalysis.seasonalFit}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Colors */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Key Colors</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyColors?.map((color, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/80">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Trends */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Key Trends</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyTrends?.map((trend, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/80">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Brands */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Reference Brands</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyBrands?.map((brand, i) => (
                    <Badge key={i} variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Items */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Key Items</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyItems?.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/80">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Materials */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Key Materials</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyMaterials?.map((material, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/80">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Styles */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Key Styles</h4>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.keyStyles?.map((style, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/80">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {aiAnalysis.targetAudience && (
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">Target Audience:</span> {aiAnalysis.targetAudience}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pinterest Integration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.43l1.4-5.96s-.37-.73-.37-1.82c0-1.7.99-2.97 2.22-2.97 1.05 0 1.56.78 1.56 1.72 0 1.05-.67 2.62-1.01 4.07-.29 1.2.61 2.18 1.8 2.18 2.16 0 3.82-2.28 3.82-5.57 0-2.91-2.09-4.95-5.08-4.95-3.46 0-5.49 2.6-5.49 5.28 0 1.05.4 2.17.91 2.78.1.12.11.23.08.35l-.34 1.38c-.05.22-.18.27-.41.16-1.52-.71-2.47-2.93-2.47-4.72 0-3.84 2.79-7.37 8.05-7.37 4.23 0 7.51 3.01 7.51 7.04 0 4.2-2.65 7.58-6.33 7.58-1.24 0-2.4-.64-2.8-1.4l-.76 2.9c-.28 1.06-1.03 2.4-1.53 3.21A12 12 0 1 0 12 0z"/>
                </svg>
                Pinterest Boards
              </CardTitle>
              <CardDescription>
                Import inspiration directly from your Pinterest boards
              </CardDescription>
            </div>
            {!pinterestConnected ? (
              <Button onClick={handlePinterestConnect}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect Pinterest
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePinterestDisconnect}
                  disabled={isDisconnecting}
                  className="text-muted-foreground hover:text-destructive"
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Pinterest Error Message */}
          {pinterestError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{pinterestError}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadPinterestBoards}
                  className="mt-2 text-red-600 hover:text-red-700 p-0 h-auto"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {!pinterestConnected ? (
            <div className="text-center py-6 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Connect your Pinterest account to import boards as creative inspiration</p>
            </div>
          ) : loadingBoards ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading your boards...</span>
            </div>
          ) : viewingBoardId ? (
            // Viewing pins inside a board
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setViewingBoardId(null); setBoardPins([]); setSelectedPins(new Set()); }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver a boards
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={selectAllPins}
                    disabled={loadingPins}
                  >
                    {selectedPins.size === boardPins.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </Button>
                  {selectedPins.size > 0 && (
                    <Button 
                      size="sm" 
                      onClick={importSelectedPins}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Importar {selectedPins.size} pins
                    </Button>
                  )}
                </div>
              </div>
              
              {loadingPins ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Cargando pins...</span>
                </div>
              ) : boardPins.length > 0 ? (
                <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {boardPins.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => togglePinSelection(pin.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                        selectedPins.has(pin.id)
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {selectedPins.has(pin.id) && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <img 
                        src={pin.imageUrl} 
                        alt={pin.title || 'Pin'}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No se encontraron pins en este board</p>
              )}
            </div>
          ) : pinterestBoards.length > 0 ? (
            // Board list view
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Haz clic en un board para ver sus pins, o importa todo el board directamente
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadPinterestBoards}
                  disabled={loadingBoards}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${loadingBoards ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {pinterestBoards.map((board) => (
                  <div
                    key={board.id}
                    className="relative p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
                  >
                    {board.image_thumbnail_url ? (
                      <img 
                        src={board.image_thumbnail_url} 
                        alt={board.name}
                        className="w-full h-20 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                        <FolderOpen className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <h4 className="font-medium text-sm truncate mb-1">{board.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{board.pin_count} pins</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => loadBoardPins(board.id)}
                      >
                        Ver pins
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => importAllBoardPins(board.id)}
                        disabled={loadingPins}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Importar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Button onClick={loadPinterestBoards} disabled={loadingBoards}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Load My Boards
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Trend Insights */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                AI Trend Insights
              </CardTitle>
              <CardDescription>
                Discover market trends and explore specific aesthetics
              </CardDescription>
            </div>
            <Button 
              onClick={loadMarketTrends}
              disabled={loadingMarketTrends}
              variant="outline"
              size="sm"
            >
              {loadingMarketTrends ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {marketTrends ? 'Refresh' : 'Load Market Trends'}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Trends Section */}
          {marketTrends && (
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Current Market Trends
                <span className="text-xs font-normal text-muted-foreground">
                  (Click to select for your collection)
                </span>
              </h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                {/* Colors */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-800">Trending Colors</h5>
                  <div className="flex flex-wrap gap-1">
                    {marketTrends.keyColors.map((color, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.colors.includes(color) ? "default" : "secondary"}
                        className={`cursor-pointer transition-all ${selectedTrends.colors.includes(color) ? 'bg-blue-600' : 'bg-white/80 hover:bg-blue-100'}`}
                        onClick={() => toggleTrendSelection('colors', color)}
                      >
                        {selectedTrends.colors.includes(color) && <Check className="h-3 w-3 mr-1" />}
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Trends */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-800">Trending Aesthetics</h5>
                  <div className="flex flex-wrap gap-1">
                    {marketTrends.keyTrends.map((trend, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.trends.includes(trend) ? "default" : "secondary"}
                        className={`cursor-pointer transition-all ${selectedTrends.trends.includes(trend) ? 'bg-blue-600' : 'bg-white/80 hover:bg-blue-100'}`}
                        onClick={() => toggleTrendSelection('trends', trend)}
                      >
                        {selectedTrends.trends.includes(trend) && <Check className="h-3 w-3 mr-1" />}
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Items */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-800">Trending Items</h5>
                  <div className="flex flex-wrap gap-1">
                    {marketTrends.keyItems.map((item, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.items.includes(item) ? "default" : "secondary"}
                        className={`cursor-pointer transition-all ${selectedTrends.items.includes(item) ? 'bg-blue-600' : 'bg-white/80 hover:bg-blue-100'}`}
                        onClick={() => toggleTrendSelection('items', item)}
                      >
                        {selectedTrends.items.includes(item) && <Check className="h-3 w-3 mr-1" />}
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explore Trends Section */}
          <div className="border-t border-blue-200 pt-4">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
              <Search className="h-4 w-4" />
              Explore a Specific Trend
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Quiet Luxury, Gorpcore, Y2K, Coquette..."
                value={trendQuery}
                onChange={(e) => setTrendQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && exploreTrend()}
                className="flex-1"
              />
              <Button 
                onClick={exploreTrend}
                disabled={exploringTrend || !trendQuery.trim()}
              >
                {exploringTrend ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Exploration Results */}
          {trendExploration && (
            <div className="bg-white/60 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-blue-900">
                  Results for "{trendExploration.query}"
                </h5>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={addExplorationToSelection}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add All to Selection
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{trendExploration.description}</p>
              
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <span className="text-xs font-medium text-blue-700">Colors</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trendExploration.keyColors.map((color, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.colors.includes(color) ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${selectedTrends.colors.includes(color) ? 'bg-blue-600' : ''}`}
                        onClick={() => toggleTrendSelection('colors', color)}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-700">Trends</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trendExploration.keyTrends.map((trend, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.trends.includes(trend) ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${selectedTrends.trends.includes(trend) ? 'bg-blue-600' : ''}`}
                        onClick={() => toggleTrendSelection('trends', trend)}
                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-700">Items</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trendExploration.keyItems.map((item, i) => (
                      <Badge 
                        key={i} 
                        variant={selectedTrends.items.includes(item) ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${selectedTrends.items.includes(item) ? 'bg-blue-600' : ''}`}
                        onClick={() => toggleTrendSelection('items', item)}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Your Selection */}
          {(selectedTrends.colors.length > 0 || selectedTrends.trends.length > 0 || selectedTrends.items.length > 0) && (
            <div className="border-t border-blue-200 pt-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                <Check className="h-4 w-4" />
                Your Trend Selection
              </h4>
              <div className="grid gap-3 md:grid-cols-3">
                {selectedTrends.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-700">Selected Colors ({selectedTrends.colors.length})</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTrends.colors.map((color, i) => (
                        <Badge key={i} className="bg-blue-600">
                          {color}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => toggleTrendSelection('colors', color)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTrends.trends.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-700">Selected Trends ({selectedTrends.trends.length})</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTrends.trends.map((trend, i) => (
                        <Badge key={i} className="bg-blue-600">
                          {trend}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => toggleTrendSelection('trends', trend)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTrends.items.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-700">Selected Items ({selectedTrends.items.length})</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTrends.items.map((item, i) => (
                        <Badge key={i} className="bg-blue-600">
                          {item}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => toggleTrendSelection('items', item)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue to Next Step - Now at the end */}
      <Card className={`border-2 transition-all ${hasContent ? 'border-primary bg-primary/5' : 'border-dashed'}`}>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Ready to continue?</h3>
              <p className="text-sm text-muted-foreground">
                {hasContent 
                  ? `You have ${images.length} images${selectedBoards.length > 0 ? ` and ${selectedBoards.length} Pinterest boards` : ''}${aiAnalysis ? ' with AI analysis' : ''}${selectedTrends.colors.length + selectedTrends.trends.length + selectedTrends.items.length > 0 ? ` and ${selectedTrends.colors.length + selectedTrends.trends.length + selectedTrends.items.length} trend selections` : ''}`
                  : 'Add some images or select Pinterest boards to continue'
                }
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              disabled={!hasContent}
              size="lg"
              className="gap-2"
            >
              Continue to Strategy
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

