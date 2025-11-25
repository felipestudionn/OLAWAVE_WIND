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
    const redirectUri = process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/pinterest/callback`;
    const clientId = process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID || '';
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET || '';
    
    console.log('Pinterest OAuth callback - exchanging code for token');
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);
    
    // Pinterest API v5 requires Basic Auth header for token exchange
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const responseText = await tokenResponse.text();
    console.log('Pinterest token response status:', tokenResponse.status);
    console.log('Pinterest token response:', responseText);

    if (!tokenResponse.ok) {
      console.error('Pinterest token exchange failed:', responseText);
      return NextResponse.redirect(
        new URL(`/creative-space?error=token_exchange_failed&details=${encodeURIComponent(responseText.substring(0, 100))}`, req.url)
      );
    }

    const tokenData = JSON.parse(responseText);
    
    // Store token in session/cookie
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/creative-space?error=auth_failed&message=${encodeURIComponent(errorMessage)}`, req.url)
    );
  }
}
