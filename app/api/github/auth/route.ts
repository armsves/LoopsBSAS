import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/github/callback`;

export async function GET(req: NextRequest) {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: 'GitHub Client ID not configured' },
      { status: 500 }
    );
  }

  const state = Math.random().toString(36).substring(2, 15);
  const scope = 'repo'; // Required for forking and creating PRs

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope,
    state,
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  const response = NextResponse.redirect(githubAuthUrl);
  // Store state in cookie for verification
  response.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });

  return response;
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('github_access_token');
  response.cookies.delete('github_oauth_state');
  return response;
}

