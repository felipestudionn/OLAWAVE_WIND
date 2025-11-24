import { NextRequest, NextResponse } from 'next/server';

/**
 * Pinterest OAuth callback handler
 * This endpoint receives the authorization code from Pinterest
 * and exchanges it for an access token
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/creative-space?error=${error}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/creative-space?error=no_code', req.url)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/pinterest/callback`,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID || '',
        client_secret: process.env.PINTEREST_CLIENT_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    
    // Store token in session/cookie (implement based on your auth strategy)
    // For now, redirect with token in URL (NOT SECURE - use session in production)
    const response = NextResponse.redirect(
      new URL('/creative-space?pinterest_connected=true', req.url)
    );
    
    // Set secure cookie with token
    response.cookies.set('pinterest_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600,
    });

    return response;
  } catch (error) {
    console.error('Pinterest OAuth error:', error);
    return NextResponse.redirect(
      new URL('/creative-space?error=auth_failed', req.url)
    );
  }
}
