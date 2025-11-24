// Pinterest OAuth and API integration
// This will be used to connect user's Pinterest boards to the Creative Space

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  pin_count: number;
  image_thumbnail_url?: string;
}

export interface PinterestPin {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  dominant_color?: string;
  image_url?: string;
}

export interface PinterestAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

/**
 * Get Pinterest OAuth URL for user authentication
 */
export function getPinterestAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI || `${window.location.origin}/api/auth/pinterest/callback`;
  const scope = ['boards:read', 'pins:read'].join(',');
  
  if (!clientId) {
    throw new Error('Pinterest Client ID not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: generateState(),
  });

  return `https://www.pinterest.com/oauth/?${params.toString()}`;
}

/**
 * Generate a random state for OAuth security
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Extract key insights from Pinterest boards for AI context
 */
export function extractPinterestInsights(boards: PinterestBoard[], pins: PinterestPin[]): {
  colorPalette: string[];
  themes: string[];
  keywords: string[];
} {
  // Extract dominant colors from pins
  const colors = pins
    .map(pin => pin.dominant_color)
    .filter(Boolean) as string[];

  // Extract keywords from titles and descriptions
  const allText = [
    ...boards.map(b => `${b.name} ${b.description || ''}`),
    ...pins.map(p => `${p.title || ''} ${p.description || ''}`)
  ].join(' ');

  // Simple keyword extraction (in production, use NLP)
  const keywords = allText
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 20);

  return {
    colorPalette: Array.from(new Set(colors)).slice(0, 5),
    themes: Array.from(new Set(boards.map(b => b.name))),
    keywords: Array.from(new Set(keywords))
  };
}
