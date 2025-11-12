import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getGitHubToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('github_access_token')?.value || null;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getGitHubToken();

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token is valid by making a simple API call
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Chain-Love-Widget',
      },
    });

    if (response.ok) {
      const user = await response.json();
      return NextResponse.json({
        authenticated: true,
        username: user.login,
      });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

