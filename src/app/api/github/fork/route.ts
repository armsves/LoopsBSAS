import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const REPO_OWNER = 'Chain-Love';
const REPO_NAME = 'chain-love';

async function getGitHubToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('github_access_token')?.value || null;
}

async function githubApiRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Chain-Love-Widget',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: response.statusText,
      errors: []
    }));
    
    // Build detailed error message
    let errorMessage = errorData.message || `GitHub API error: ${response.status}`;
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorDetails = errorData.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      if (errorDetails) {
        errorMessage += ` - ${errorDetails}`;
      }
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}

async function checkForkStatus(token: string) {
  const userResponse = await githubApiRequest('/user', token);
  const username = userResponse.login;

  try {
    const forkResponse = await githubApiRequest(
      `/repos/${username}/${REPO_NAME}`,
      token
    );
    
    // If we get here, the repo exists - check if it's a fork of our target repo
    if (forkResponse.fork && forkResponse.parent?.full_name === `${REPO_OWNER}/${REPO_NAME}`) {
      return {
        forkExists: true,
        forkUrl: forkResponse.html_url,
        forkFullName: forkResponse.full_name,
        username,
      };
    }
    // If repo exists but isn't a fork of our target
    return {
      forkExists: false,
      error: `Repository ${username}/${REPO_NAME} already exists but is not a fork of ${REPO_OWNER}/${REPO_NAME}`,
      username,
    };
  } catch (error: any) {
    // 404 means fork doesn't exist
    if (error.status === 404) {
      return {
        forkExists: false,
        username,
      };
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getGitHubToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated. Please login with GitHub first.' },
        { status: 401 }
      );
    }

    const forkStatus = await checkForkStatus(token);
    
    return NextResponse.json({
      success: true,
      ...forkStatus,
    });
  } catch (error: any) {
    console.error('Check fork status error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to check fork status',
        details: error.data || null,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getGitHubToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated. Please login with GitHub first.' },
        { status: 401 }
      );
    }

    // Check if fork already exists first
    const forkStatus = await checkForkStatus(token);
    
    if (forkStatus.forkExists) {
      return NextResponse.json({
        success: true,
        forkExists: true,
        forkUrl: forkStatus.forkUrl,
        forkFullName: forkStatus.forkFullName,
        message: 'Fork already exists',
      });
    }

    if (forkStatus.error) {
      return NextResponse.json({
        error: forkStatus.error,
      }, { status: 409 });
    }

    // Fork doesn't exist, create it
    const forkResponse = await githubApiRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/forks`,
      token,
      { method: 'POST' }
    );

    return NextResponse.json({
      success: true,
      forkExists: false,
      forkUrl: forkResponse.html_url,
      forkFullName: forkResponse.full_name,
      message: 'Repository forked successfully',
    });
  } catch (error: any) {
    console.error('Fork error:', error);
    console.error('Error status:', error.status);
    console.error('Error data:', error.data);
    
    // Return more detailed error information
    const status = error.status || 500;
    const errorMessage = error.message || 'Failed to fork repository';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.data || null,
        status: status
      },
      { status }
    );
  }
}

