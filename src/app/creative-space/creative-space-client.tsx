'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { getPinterestAuthUrl } from '@/lib/pinterest';
import { saveCreativeSpaceData, type CreativeSpaceData } from '@/lib/data-sync';

interface MoodImage {
  id: string;
  src: string;
  name: string;
}

export function CreativeSpaceClient() {
  const [images, setImages] = useState<MoodImage[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Pinterest is connected
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pinterest_connected') === 'true') {
      setPinterestConnected(true);
    }

    // Save to both old format (for backward compat) and new unified format
    try {
      // Old format
      const summary = {
        count: images.length,
        names: images.map((img) => img.name).slice(0, 20),
      };
      window.localStorage.setItem('olawave_moodboard_summary', JSON.stringify(summary));

      // New unified format
      const creativeData: CreativeSpaceData = {
        moodboardImages: images.map(img => ({
          id: img.id,
          name: img.name,
          url: img.src
        }))
      };
      saveCreativeSpaceData(creativeData);
    } catch (e) {
      // ignore storage errors
    }
  }, [images]);

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
    try {
      const authUrl = getPinterestAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Pinterest auth error:', error);
      alert('Pinterest integration is not configured yet. Please add NEXT_PUBLIC_PINTEREST_CLIENT_ID to your environment variables.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Creative Moodboard</CardTitle>
          <Button
            variant={pinterestConnected ? "outline" : "default"}
            size="sm"
            onClick={handlePinterestConnect}
            disabled={pinterestConnected}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            {pinterestConnected ? 'Pinterest Connected' : 'Connect Pinterest'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Plus className="h-6 w-6 text-primary" />
            <div className="text-sm text-muted-foreground text-center">
              Click to upload images or drag and drop files here
            </div>
          </label>

          {images.length > 0 && (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group overflow-hidden rounded-lg border bg-background"
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between text-xs text-white">
                    <span className="truncate max-w-[70%]">{img.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-300 hover:text-red-500 hover:bg-transparent"
                      onClick={() => removeImage(img.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
