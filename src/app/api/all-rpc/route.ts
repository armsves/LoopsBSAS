import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/app/api-helpers/error-response';
import type { NextApiResponse } from '@/app/api-helpers/types';
import { getAppConfigOnServer } from '@/app/api/config/services';
import {
  fetchRemoteProvidersPayload,
  normalizeOne,
} from '@/app/api-helpers/infrastructure-providers/helpers';
import { Rpc } from '@/service/infrastructureProvidersApi/infrastructure.types';

export const dynamic = 'force-dynamic';

export type AllRpcResponse = Array<{
  network: string;
  networkName: string;
  chain: string;
  rpc: Rpc;
}>;

export async function GET(
  req: NextRequest,
): NextApiResponse<AllRpcResponse> {
  try {
    const { dataSources } = await getAppConfigOnServer();
    const networkKeys = Object.keys(dataSources);

    const allRpcEndpoints: AllRpcResponse = [];

    // Fetch RPC data from all networks
    for (const networkKey of networkKeys) {
      try {
        const payload = await fetchRemoteProvidersPayload(networkKey);
        const rpcList = (payload.rpc ?? []).map(normalizeOne) as Rpc[];

        const networkInfo = dataSources[networkKey];
        const networkName = networkInfo.originNetwork.name;

        // Get chain mapping
        const chainMap = new Map<string, string>();
        for (const chain of networkInfo.originNetwork.chains ?? []) {
          chainMap.set(chain.key.toLowerCase(), chain.name);
        }

        // Add each RPC endpoint with network and chain info
        for (const rpc of rpcList) {
          const chainKey = rpc.chain?.toLowerCase() || '';
          const chainName = chainMap.get(chainKey) || rpc.chain || 'Unknown';

          allRpcEndpoints.push({
            network: networkKey,
            networkName,
            chain: chainName,
            rpc,
          });
        }
      } catch (error) {
        // Log error but continue with other networks
        console.error(`Failed to fetch RPC data for ${networkKey}:`, error);
      }
    }

    // Return in the format expected by SuccessResponse<AllRpcResponse>
    // AllRpcResponse is RpcEndpoint[]
    // So we return { result: RpcEndpoint[] }
    return NextResponse.json({ result: allRpcEndpoints });
  } catch (error) {
    console.error('Error fetching all RPC endpoints:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

