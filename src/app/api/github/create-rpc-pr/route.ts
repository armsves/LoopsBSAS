import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const REPO_OWNER = 'Chain-Love';
const REPO_NAME = 'chain-love';

interface RpcFormData {
  slug: string;
  provider: string;
  plan: string;
  nodeType: string;
  chain: string;
  address: string; // Owner address (0x...) to claim provider
  accessPrice: string;
  queryPrice: string;
  uptimeSla: string;
  bandwidthSla: string;
  blocksBehindSla: string; // Number format
  starred: boolean;
  trial: boolean;
  availableApis: string[];
  limitations: string[];
  securityImprovements: string[];
  monitoringAndAnalytics: string[];
  regions: string[];
  actionButtons: string[];
  // Note: verifiedUptime, verifiedLatency, verifiedBlocksBehindAvg are reserved for future use
  // and should always be null/blank in CSV
}

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
      errors: [],
    }));

    let errorMessage = errorData.message || `GitHub API error: ${response.status}`;
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorDetails = errorData.errors
        .map((e: any) => e.message || JSON.stringify(e))
        .join(', ');
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

function convertToCSVRow(data: RpcFormData): string {
  // Convert boolean to uppercase TRUE/FALSE as per Style Guide
  const starred = data.starred ? 'TRUE' : 'FALSE';
  const trial = data.trial ? 'TRUE' : 'FALSE';

  // Convert arrays to JSON strings (validated format)
  // Empty arrays should be represented as empty string, not "[]"
  const availableApis = data.availableApis?.length
    ? JSON.stringify(data.availableApis)
    : '';
  const limitations = data.limitations?.length
    ? JSON.stringify(data.limitations)
    : '';
  const securityImprovements = data.securityImprovements?.length
    ? JSON.stringify(data.securityImprovements)
    : '';
  const monitoringAndAnalytics = data.monitoringAndAnalytics?.length
    ? JSON.stringify(data.monitoringAndAnalytics)
    : '';
  const regions = data.regions?.length ? JSON.stringify(data.regions) : '';
  const actionButtons = data.actionButtons?.length
    ? JSON.stringify(data.actionButtons)
    : '';

  // CSV format: escape commas and quotes, handle empty values
  const escapeCSV = (value: string | null | undefined): string => {
    if (!value || value.trim() === '') return '';
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Handle null values - use 'null' string for empty fields
  const nullIfEmpty = (value: string | null | undefined): string => {
    if (!value || value.trim() === '') return 'null';
    return escapeCSV(value);
  };

  // blocksBehindSla should be a number or null
  const blocksBehindSla = data.blocksBehindSla?.trim() || 'null';

  // verifiedUptime, verifiedLatency, verifiedBlocksBehindAvg should be blank (reserved for future use)
  // According to wiki: "Reserved for future use. Leave them blank."

  // Order matches wiki: slug,provider,plan,nodeType,chain,accessPrice,queryPrice,uptimeSla,bandwidthSla,blocksBehindSla,starred,trial,availableApis,limitations,securityImprovements,monitoringAndAnalytics,regions,verifiedUptime,verifiedLatency,verifiedBlocksBehindAvg,actionButtons,address
  return [
    escapeCSV(data.slug),
    escapeCSV(data.provider),
    escapeCSV(data.plan),
    escapeCSV(data.nodeType),
    escapeCSV(data.chain),
    nullIfEmpty(data.accessPrice),
    nullIfEmpty(data.queryPrice),
    nullIfEmpty(data.uptimeSla),
    nullIfEmpty(data.bandwidthSla),
    blocksBehindSla === 'null' ? 'null' : escapeCSV(blocksBehindSla),
    starred,
    trial,
    escapeCSV(availableApis),
    escapeCSV(limitations),
    escapeCSV(securityImprovements),
    escapeCSV(monitoringAndAnalytics),
    escapeCSV(regions),
    'null', // verifiedUptime - reserved for future use
    'null', // verifiedLatency - reserved for future use
    'null', // verifiedBlocksBehindAvg - reserved for future use
    escapeCSV(actionButtons),
    nullIfEmpty(data.address), // address is at the end
  ].join(',');
}

function getCSVHeader(): string {
  // Order matches wiki exactly
  return [
    'slug',
    'provider',
    'plan',
    'nodeType',
    'chain',
    'accessPrice',
    'queryPrice',
    'uptimeSla',
    'bandwidthSla',
    'blocksBehindSla',
    'starred',
    'trial',
    'availableApis',
    'limitations',
    'securityImprovements',
    'monitoringAndAnalytics',
    'regions',
    'verifiedUptime',
    'verifiedLatency',
    'verifiedBlocksBehindAvg',
    'actionButtons',
    'address',
  ].join(',');
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
    const { network, rpcData }: { network: string; rpcData: RpcFormData } = body;

    if (!network || !rpcData) {
      return NextResponse.json(
        { error: 'Network and RPC data are required' },
        { status: 400 }
      );
    }

    // Map config keys to GitHub folder names
    // The config uses keys like 'eth', but GitHub repo uses folder names like 'ethereum'
    const networkFolderMap: Record<string, string> = {
      eth: 'ethereum',
      // Add other mappings if needed, otherwise use the key as-is
    };
    const networkFolder = networkFolderMap[network] || network;

    // Get user info
    const userResponse = await githubApiRequest('/user', token);
    const username = userResponse.login;
    const forkFullName = `${username}/${REPO_NAME}`;

    // Check if fork exists
    let forkExists = false;
    try {
      await githubApiRequest(`/repos/${forkFullName}`, token);
      forkExists = true;
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
      // Fork doesn't exist, need to create it first
      return NextResponse.json(
        {
          error:
            'Fork not found. Please fork the repository first using the Fork & PR page.',
        },
        { status: 404 }
      );
    }

    // Get default branch (usually 'main')
    const repoInfo = await githubApiRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}`,
      token
    );
    const defaultBranch = repoInfo.default_branch || 'main';

    // Create a new branch
    const branchName = `add-rpc-${rpcData.slug}-${Date.now()}`;
    const refName = `refs/heads/${branchName}`;

    // Get the latest commit SHA from default branch
    const refResponse = await githubApiRequest(
      `/repos/${forkFullName}/git/ref/heads/${defaultBranch}`,
      token
    );
    const baseSha = refResponse.object.sha;

    // Create new branch
    await githubApiRequest(`/repos/${forkFullName}/git/refs`, token, {
      method: 'POST',
      body: JSON.stringify({
        ref: refName,
        sha: baseSha,
      }),
    });

    // Get network display name from config for PR title/description
    let networkDisplayName = networkFolder;
    try {
      const configResponse = await fetch('https://raw.githubusercontent.com/Chain-Love/chain-love/json/json/app_config.json');
      if (configResponse.ok) {
        const config = await configResponse.json();
        const networkKey = Object.keys(config.dataSources || {}).find(key => {
          const folderMap: Record<string, string> = { eth: 'ethereum' };
          return (folderMap[key] || key) === networkFolder;
        });
        if (networkKey && config.dataSources[networkKey]?.originNetwork?.name) {
          networkDisplayName = config.dataSources[networkKey].originNetwork.name;
        }
      }
    } catch {
      // Fallback to folder name if config fetch fails
    }

    // Read existing CSV file or create new one
    // Use networkFolder which maps config keys to actual folder names
    const csvPath = `networks/${networkFolder}/rpc.csv`;
    let existingContent = '';
    let fileSha: string | null = null;

    try {
      const fileResponse = await githubApiRequest(
        `/repos/${forkFullName}/contents/${csvPath}?ref=${branchName}`,
        token
      );
      existingContent = Buffer.from(fileResponse.content, 'base64').toString(
        'utf-8'
      );
      fileSha = fileResponse.sha;
    } catch (error: any) {
      // File doesn't exist, we'll create it
      if (error.status !== 404) {
        throw error;
      }
    }

    // Parse existing CSV or create header
    let csvLines: string[] = [];
    if (existingContent) {
      csvLines = existingContent.split('\n').filter(line => line.trim());
    } else {
      csvLines = [getCSVHeader()];
    }

    // Add new row
    const newRow = convertToCSVRow(rpcData);
    csvLines.push(newRow);

    // Combine into new content
    const newContent = csvLines.join('\n') + '\n';

    // Create or update file
    const contentBase64 = Buffer.from(newContent, 'utf-8').toString('base64');

    await githubApiRequest(
      `/repos/${forkFullName}/contents/${csvPath}`,
      token,
      {
        method: fileSha ? 'PUT' : 'POST',
        body: JSON.stringify({
          message: `Add RPC endpoint for ${networkDisplayName} ${rpcData.chain}: ${rpcData.provider} - ${rpcData.plan}`,
          content: contentBase64,
          branch: branchName,
          ...(fileSha && { sha: fileSha }),
        }),
      }
    );

    // Create PR
    const prResponse = await githubApiRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      token,
      {
        method: 'POST',
        body: JSON.stringify({
          title: `Add RPC endpoint for ${networkDisplayName} ${rpcData.chain}: ${rpcData.provider} - ${rpcData.plan}`,
          body: `This PR adds a new RPC endpoint to the Chain-Love database for **${networkDisplayName} ${rpcData.chain}**.

## Changes
- Added new RPC endpoint: **${rpcData.provider}** (${rpcData.plan})
- Network: **${networkDisplayName}**
- Chain: **${rpcData.chain}**
- File: \`${csvPath}\`

## RPC Details
- **Provider**: ${rpcData.provider}
- **Plan**: ${rpcData.plan}
- **Node Type**: ${rpcData.nodeType}
- **Chain**: ${rpcData.chain}
${rpcData.address ? `- **Owner Address**: ${rpcData.address}` : ''}
${rpcData.accessPrice ? `- **Access Price**: ${rpcData.accessPrice}` : ''}
${rpcData.queryPrice ? `- **Query Price**: ${rpcData.queryPrice}` : ''}
${rpcData.uptimeSla ? `- **Uptime SLA**: ${rpcData.uptimeSla}` : ''}
${rpcData.bandwidthSla ? `- **Bandwidth SLA**: ${rpcData.bandwidthSla}` : ''}
${rpcData.blocksBehindSla ? `- **Blocks Behind SLA**: ${rpcData.blocksBehindSla}` : ''}
${rpcData.trial ? '- **Trial Available**: Yes' : ''}
${rpcData.starred ? '- **Starred**: Yes' : ''}
${rpcData.availableApis?.length ? `- **Available APIs**: ${rpcData.availableApis.join(', ')}` : ''}
${rpcData.limitations?.length ? `- **Limitations**: ${rpcData.limitations.join(', ')}` : ''}
${rpcData.regions?.length ? `- **Regions**: ${rpcData.regions.join(', ')}` : ''}

## Guidelines Followed
- [x] Reviewed the [Style Guide](https://github.com/Chain-Love/chain-love/wiki/Style-Guide)
- [x] Used uppercase TRUE/FALSE for boolean values
- [x] Validated JSON columns
- [x] Checked existing entries for consistency

## Reference
- [RPC Column Definitions](https://github.com/Chain-Love/chain-love/wiki/RPC)`,
          head: `${username}:${branchName}`,
          base: defaultBranch,
        }),
      }
    );

    return NextResponse.json({
      success: true,
      prUrl: prResponse.html_url,
      prNumber: prResponse.number,
      branchName,
      message: 'Pull request created successfully',
    });
  } catch (error: any) {
    console.error('Create RPC PR error:', error);
    console.error('Error status:', error.status);
    console.error('Error data:', error.data);

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
        status: status,
      },
      { status }
    );
  }
}

