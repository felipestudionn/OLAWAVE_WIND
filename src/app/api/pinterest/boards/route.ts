import { NextRequest, NextResponse } from 'next/server';

/**
 * Fetch user's Pinterest boards
 */
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('pinterest_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated with Pinterest' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch('https://api.pinterest.com/v5/boards', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pinterest boards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}
