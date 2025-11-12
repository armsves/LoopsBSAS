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

export async function POST(req: NextRequest) {
  try {
    const token = await getGitHubToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated. Please login with GitHub first.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, body: prBody, branch, baseBranch = 'main' } = body;

    if (!title || !branch) {
      return NextResponse.json(
        { error: 'Title and branch are required' },
        { status: 400 }
      );
    }

    // Get user info to find fork
    const userResponse = await githubApiRequest('/user', token);
    const username = userResponse.login;
    const forkFullName = `${username}/${REPO_NAME}`;

    // Create PR from fork to upstream
    const prResponse = await githubApiRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      token,
      {
        method: 'POST',
        body: JSON.stringify({
          title,
          body: prBody || `This PR was created via the Chain.Love widget.

## Changes
- Please describe your changes here

## Files Modified
- List the CSV files you modified (e.g., \`networks/ethereum/rpc.csv\`)

## Guidelines Followed
- [ ] Reviewed the [Style Guide](https://github.com/Chain-Love/chain-love/wiki/Style-Guide)
- [ ] Checked existing entries for consistency
- [ ] Validated JSON columns if applicable
- [ ] Used uppercase TRUE/FALSE for boolean values

## Reference
- [RPC Column Definitions](https://github.com/Chain-Love/chain-love/wiki/RPC)`,
          head: `${username}:${branch}`,
          base: baseBranch,
        }),
      }
    );

    return NextResponse.json({
      success: true,
      prUrl: prResponse.html_url,
      prNumber: prResponse.number,
      message: 'Pull request created successfully',
    });
  } catch (error: any) {
    console.error('Create PR error:', error);
    console.error('Error status:', error.status);
    console.error('Error data:', error.data);
    
    // Handle case where PR already exists
    if (error.status === 409 || error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'A pull request with this branch already exists' },
        { status: 409 }
      );
    }

    const status = error.status || 500;
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create pull request',
        details: error.data || null,
        status: status
      },
      { status }
    );
  }
}

