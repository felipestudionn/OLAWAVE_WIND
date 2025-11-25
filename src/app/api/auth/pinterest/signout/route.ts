import { NextRequest, NextResponse } from 'next/server';

/**
 * Pinterest Sign Out handler
 * Clears the Pinterest access token cookie and redirects to Creative Space
 */
export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear the Pinterest access token cookie
  response.cookies.set('pinterest_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(
    new URL('/creative-space?pinterest_disconnected=true', req.url)
  );
  
  // Clear the Pinterest access token cookie
  response.cookies.set('pinterest_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}
