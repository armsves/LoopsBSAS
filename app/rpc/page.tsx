'use client';

import { useQuery } from '@tanstack/react-query';
import httpClient from '@/service/httpClient';
import { SuccessResponse } from '@/app/api-helpers/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import CopyToClipboardButton from '@/components/ui/buttons/copy-button';
import { Badge } from '@/components/ui/shadcn/badge';
import { Input } from '@/components/ui/shadcn/input';
import { useState, useMemo } from 'react';
import { Search, Network, Server, Copy } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type RpcEndpoint = {
  network: string;
  networkName: string;
  chain: string;
  rpc: {
    slug: string;
    provider: string;
    plan: string;
    nodeType: string;
    chain: string;
    address: string | null;
    accessPrice: string | null;
    queryPrice: string | null;
    uptimeSla: string | null;
    bandwidthSla: string | null;
    blocksBehindSla: string | null;
    starred: boolean;
    trial: boolean;
    availableApis: string[] | null;
    limitations: string[] | null;
    securityImprovements: string[] | null;
    monitoringAndAnalytics: string[] | null;
    regions: string[] | null;
    verifiedUptime: string | null;
    verifiedLatency: string | null;
    verifiedBlocksBehindAvg: string | null;
    actionButtons: string[] | null;
  };
};

// The API returns { result: RpcEndpoint[] }
// httpClient.get returns that directly, so it's { result: RpcEndpoint[] }
// SuccessResponse<T> = { result: T }, so SuccessResponse<RpcEndpoint[]> = { result: RpcEndpoint[] }
type AllRpcResponse = RpcEndpoint[];

function useAllRpcQuery() {
  return useQuery<SuccessResponse<AllRpcResponse>>({
    queryKey: ['/api/all-rpc'],
    queryFn: () => httpClient.get('/api/all-rpc'),
  });
}

export default function AllRpcPage() {
  const { data, isLoading, error } = useAllRpcQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [selectedChain, setSelectedChain] = useState<string>('all');

  // API returns { result: RpcEndpoint[] }
  // httpClient.get returns { result: RpcEndpoint[] }  
  // SuccessResponse<AllRpcResponse> = { result: RpcEndpoint[] }
  const rpcData = data?.result || [];
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('RPC Page Debug:', {
      hasData: !!data,
      dataStructure: data ? Object.keys(data) : null,
      resultStructure: data?.result ? Object.keys(data.result) : null,
      rpcDataLength: rpcData.length,
      firstItem: rpcData[0],
    });
  }

  // Get unique networks and chains for filters
  const networks = useMemo(() => {
    const unique = new Set(rpcData.map(item => item.network));
    return Array.from(unique).sort();
  }, [rpcData]);

  const chains = useMemo(() => {
    const unique = new Set(rpcData.map(item => item.chain));
    return Array.from(unique).sort();
  }, [rpcData]);

  // Filter RPC endpoints
  const filteredRpc = useMemo(() => {
    return rpcData.filter(item => {
      const matchesSearch =
        !searchQuery ||
        item.rpc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rpc.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.networkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNetwork =
        selectedNetwork === 'all' || item.network === selectedNetwork;

      const matchesChain =
        selectedChain === 'all' || item.chain === selectedChain;

      return matchesSearch && matchesNetwork && matchesChain;
    });
  }, [rpcData, searchQuery, selectedNetwork, selectedChain]);

  // Group by network
  const groupedByNetwork = useMemo(() => {
    const grouped = new Map<string, typeof filteredRpc>();
    for (const item of filteredRpc) {
      const key = item.network;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    }
    return grouped;
  }, [filteredRpc]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <p className='text-center text-destructive'>
              Error loading RPC endpoints: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>All RPC Endpoints</h1>
        <p className='text-gray-11'>
          Browse and discover RPC endpoints from all supported networks
        </p>
      </div>

      {/* Filters */}
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-11' />
              <Input
                placeholder='Search by provider, address, network...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Network Filter */}
            <select
              value={selectedNetwork}
              onChange={e => setSelectedNetwork(e.target.value)}
              className='rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-9'
            >
              <option value='all'>All Networks</option>
              {networks.map(network => {
                const networkItem = rpcData.find(item => item.network === network);
                return (
                  <option key={network} value={network}>
                    {networkItem?.networkName || network}
                  </option>
                );
              })}
            </select>

            {/* Chain Filter */}
            <select
              value={selectedChain}
              onChange={e => setSelectedChain(e.target.value)}
              className='rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-9'
            >
              <option value='all'>All Chains</option>
              {chains.map(chain => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>
          </div>

          <div className='mt-4 text-sm text-gray-11'>
            Showing {filteredRpc.length} of {rpcData.length} RPC endpoints
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredRpc.length === 0 ? (
        <Card>
          <CardContent className='pt-6'>
            <p className='text-center text-gray-11'>
              No RPC endpoints found matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
          {Array.from(groupedByNetwork.entries()).map(([network, items]) => {
            const networkItem = items[0];
            return (
              <div key={network}>
                <div className='mb-4 flex items-center gap-2'>
                  <Network className='size-5 text-accent-9' />
                  <h2 className='text-2xl font-semibold'>
                    {networkItem.networkName}
                  </h2>
                  <Badge variant='secondary'>{items.length} endpoints</Badge>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {items.map((item, idx) => (
                    <RpcCard key={`${item.network}-${item.rpc.slug}-${idx}`} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RpcCard({
  item,
}: {
  item: RpcEndpoint;
}) {
  const { rpc, networkName, chain } = item;

  return (
    <Card className='transition-shadow hover:shadow-lg'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='mb-1 text-lg'>{rpc.provider}</CardTitle>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline'>{networkName}</Badge>
              <Badge variant='outline'>{chain}</Badge>
              {rpc.plan && (
                <Badge variant='secondary'>{rpc.plan}</Badge>
              )}
              {rpc.starred && (
                <Badge className='bg-accent-9 text-white'>⭐ Starred</Badge>
              )}
              {rpc.trial && (
                <Badge className='bg-success text-white'>Trial</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {rpc.address && (
          <div>
            <div className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-11'>
              <Server className='size-4' />
              RPC Address
            </div>
            <div className='flex items-center gap-2 rounded-md border border-gray-6 bg-gray-3 p-2'>
              <code className='flex-1 break-all text-sm text-gray-12'>
                {rpc.address}
              </code>
              <CopyToClipboardButton
                copyText={rpc.address}
                tooltipText='RPC address copied!'
                className='shrink-0'
              >
                <Copy className='size-4' />
              </CopyToClipboardButton>
            </div>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4 text-sm'>
          {rpc.nodeType && (
            <div>
              <div className='text-gray-11'>Node Type</div>
              <div className='font-medium'>{rpc.nodeType}</div>
            </div>
          )}
          {rpc.accessPrice && (
            <div>
              <div className='text-gray-11'>Access Price</div>
              <div className='font-medium'>{rpc.accessPrice}</div>
            </div>
          )}
          {rpc.queryPrice && (
            <div>
              <div className='text-gray-11'>Query Price</div>
              <div className='font-medium'>{rpc.queryPrice}</div>
            </div>
          )}
          {rpc.verifiedLatency && (
            <div>
              <div className='text-gray-11'>Latency</div>
              <div className='font-medium'>{rpc.verifiedLatency}</div>
            </div>
          )}
        </div>

        {rpc.availableApis && rpc.availableApis.length > 0 && (
          <div>
            <div className='mb-2 text-sm font-medium text-gray-11'>
              Available APIs
            </div>
            <div className='flex flex-wrap gap-1'>
              {rpc.availableApis.map((api, idx) => (
                <Badge key={idx} variant='outline' className='text-xs'>
                  {api}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {rpc.regions && rpc.regions.length > 0 && (
          <div>
            <div className='mb-2 text-sm font-medium text-gray-11'>Regions</div>
            <div className='flex flex-wrap gap-1'>
              {rpc.regions.map((region, idx) => (
                <Badge key={idx} variant='outline' className='text-xs'>
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {rpc.limitations && rpc.limitations.length > 0 && (
          <div>
            <div className='mb-2 text-sm font-medium text-gray-11'>
              Limitations
            </div>
            <ul className='list-disc space-y-1 pl-5 text-sm text-gray-11'>
              {rpc.limitations.map((limitation, idx) => (
                <li key={idx}>{limitation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

