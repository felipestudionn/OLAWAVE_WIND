'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Link as LinkIcon, ArrowRight, Check, X, Loader2, Sparkles, ImageIcon, FolderOpen } from 'lucide-react';
import { saveCreativeSpaceData, type CreativeSpaceData } from '@/lib/data-sync';

interface MoodImage {
  id: string;
  src: string;
  name: string;
}

interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  pin_count: number;
  image_thumbnail_url?: string;
}

export function CreativeSpaceClient() {
  const router = useRouter();
  const [images, setImages] = useState<MoodImage[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [pinterestBoards, setPinterestBoards] = useState<PinterestBoard[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [showBoardSelector, setShowBoardSelector] = useState(false);

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

  // Save data whenever images or selected boards change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Old format for backward compat
      const summary = {
        count: images.length,
        names: images.map((img) => img.name).slice(0, 20),
      };
      window.localStorage.setItem('olawave_moodboard_summary', JSON.stringify(summary));

      // New unified format
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
        keyColors: ['Warm Beige', 'Olive Green', 'Electric Blue', 'Camel'],
        keyTrends: ['Oversized Tailoring', 'Gorpcore', 'Y2K Revival'],
        keyItems: ['Utility vests', 'Oversized bomber jackets', 'Platform sandals', 'Crochet bags']
      };
      saveCreativeSpaceData(creativeData);
      
      // Store Pinterest selected boards
      if (selectedBoards.length > 0) {
        localStorage.setItem('olawave_pinterest_selected', JSON.stringify(selectedBoards));
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [images, selectedBoards, pinterestBoards]);

  const loadPinterestBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await fetch('/api/pinterest/boards');
      const data = await res.json();
      
      if (data.items && Array.isArray(data.items)) {
        setPinterestBoards(data.items);
        localStorage.setItem('olawave_pinterest_boards', JSON.stringify(data.items));
        localStorage.setItem('olawave_pinterest_connected', 'true');
        setShowBoardSelector(true);
      }
    } catch (err) {
      console.error('Error loading boards:', err);
    } finally {
      setLoadingBoards(false);
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Drop images here or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF up to 10MB each</p>
              </div>
            </label>

            {/* Uploaded Images Grid */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Uploaded Images ({images.length})</h4>
                </div>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative group overflow-hidden rounded-lg border bg-background aspect-square"
                    >
                      <img
                        src={img.src}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
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
          ) : pinterestBoards.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Select boards to use as inspiration ({selectedBoards.length} selected)
                </p>
                {selectedBoards.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBoards([])}>
                    Clear selection
                  </Button>
                )}
              </div>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {pinterestBoards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => toggleBoardSelection(board.id)}
                    className={`relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedBoards.includes(board.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedBoards.includes(board.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
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
                    <h4 className="font-medium text-sm truncate">{board.name}</h4>
                    <p className="text-xs text-muted-foreground">{board.pin_count} pins</p>
                  </button>
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

      {/* Continue to Next Step */}
      <Card className={`border-2 transition-all ${hasContent ? 'border-primary bg-primary/5' : 'border-dashed'}`}>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Ready to continue?</h3>
              <p className="text-sm text-muted-foreground">
                {hasContent 
                  ? `You have ${images.length} images${selectedBoards.length > 0 ? ` and ${selectedBoards.length} Pinterest boards` : ''} selected`
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

