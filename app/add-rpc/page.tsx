'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Badge } from '@/components/ui/shadcn/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, X, CheckCircle2, XCircle, Server } from 'lucide-react';
import { toast } from 'sonner';

interface RpcFormData {
  slug: string;
  provider: string;
  plan: string;
  nodeType: string;
  chain: string;
  address: string; // Owner address (0x...) to claim provider, not RPC URL
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
}

const mockData: RpcFormData = {
  slug: 'infura-ethereum-mainnet-free',
  provider: 'Infura',
  plan: 'Free',
  nodeType: 'Recent-State',
  chain: 'mainnet',
  address: '', // Owner address (0x...) - leave blank if not claiming ownership
  accessPrice: '$0',
  queryPrice: '$0',
  uptimeSla: '99.9%',
  bandwidthSla: '10G/s',
  blocksBehindSla: '2',
  starred: false,
  trial: true,
  availableApis: ['eth', 'net', 'web3'],
  limitations: ['20k requests daily cap', '40 rps'],
  securityImprovements: ['DDoS Protection', 'IP Protection'],
  monitoringAndAnalytics: ['Usage analytics', 'Request logs'],
  regions: ['US East', 'EU West'],
  actionButtons: ['[Signup](https://infura.io)', '[Docs](https://docs.infura.io)'],
};

export default function AddRpcPage() {
  const [formData, setFormData] = useState<RpcFormData>(mockData);
  const [network, setNetwork] = useState('eth'); // Use 'eth' to match config key
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [forkExists, setForkExists] = useState(false);
  const [networks, setNetworks] = useState<Array<{ key: string; name: string; folder?: string }>>([]);
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(true);
  const isSubmittingRef = useRef(false); // Ref to prevent duplicate submissions

  const getNetworkFolder = (networkKey: string): string => {
    const network = networks.find(n => n.key === networkKey);
    if (network?.folder) {
      return network.folder;
    }
    // Fallback mapping
    const folderMap: Record<string, string> = { eth: 'ethereum' };
    return folderMap[networkKey] || networkKey;
  };

  useEffect(() => {
    checkAuth();
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        const dataSources = data.result?.dataSources || {};
        const folderMap: Record<string, string> = { eth: 'ethereum' };
        const networkList = Object.entries(dataSources).map(([key, value]: [string, any]) => ({
          key,
          name: value.originNetwork?.name || key,
          folder: folderMap[key] || key,
        }));
        setNetworks(networkList.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error('Failed to load networks:', error);
      // Fallback to hardcoded list
      const folderMap: Record<string, string> = { eth: 'ethereum' };
      setNetworks([
        { key: 'algorand', name: 'Algorand', folder: 'algorand' },
        { key: 'arbitrum', name: 'Arbitrum', folder: 'arbitrum' },
        { key: 'astar', name: 'Astar', folder: 'astar' },
        { key: 'base', name: 'Base', folder: 'base' },
        { key: 'eth', name: 'Ethereum', folder: 'ethereum' },
        { key: 'filecoin', name: 'Filecoin', folder: 'filecoin' },
        { key: 'flare', name: 'Flare', folder: 'flare' },
        { key: 'lens', name: 'Lens', folder: 'lens' },
        { key: 'linea', name: 'Linea', folder: 'linea' },
        { key: 'optimism', name: 'Optimism', folder: 'optimism' },
        { key: 'polygon', name: 'Polygon', folder: 'polygon' },
        { key: 'somnia', name: 'Somnia', folder: 'somnia' },
        { key: 'stellar', name: 'Stellar', folder: 'stellar' },
      ]);
    } finally {
      setIsLoadingNetworks(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/github/check-auth');
      if (response.ok) {
        setIsAuthenticated(true);
        // Check if fork exists
        checkFork();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const checkFork = async () => {
    try {
      const response = await fetch('/api/github/fork');
      if (response.ok) {
        const data = await response.json();
        setForkExists(data.forkExists || false);
      }
    } catch {
      // Silently fail
    }
  };

  const handleInputChange = (field: keyof RpcFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: 'availableApis' | 'limitations' | 'securityImprovements' | 'monitoringAndAnalytics' | 'regions' | 'actionButtons',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'availableApis' | 'limitations' | 'securityImprovements' | 'monitoringAndAnalytics' | 'regions' | 'actionButtons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const removeArrayItem = (
    field: 'availableApis' | 'limitations' | 'securityImprovements' | 'monitoringAndAnalytics' | 'regions' | 'actionButtons',
    index: number
  ) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmittingRef.current || isSubmitting) {
      toast.error('Please wait, submission in progress...');
      return;
    }

    // Prevent if PR already created
    if (prUrl) {
      toast.error('PR already created. Please refresh the page to create a new one.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/github/create-rpc-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network,
          rpcData: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrUrl(data.prUrl);
        toast.success('Pull request created successfully!');
      } else {
        // Handle duplicate PR error specifically
        if (data.error?.includes('already exists') || response.status === 409) {
          toast.error('A PR with this branch already exists. Please use different data or wait a moment.');
        } else {
          toast.error(data.error || 'Failed to create PR');
        }
      }
    } catch (error: any) {
      toast.error('Failed to create PR: ' + (error.message || 'Network error'));
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const loadMockData = () => {
    setFormData(mockData);
    toast.success('Mock data loaded');
  };

  if (isCheckingAuth) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='container mx-auto min-h-screen px-4 py-8'>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please authenticate with GitHub to add RPC endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = '/fork-pr')}>
              Go to Fork & PR Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!forkExists) {
    return (
      <div className='container mx-auto min-h-screen px-4 py-8'>
        <Card>
          <CardHeader>
            <CardTitle>Fork Required</CardTitle>
            <CardDescription>
              You need to fork the repository before adding RPC endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-gray-11'>
              Please fork the Chain-Love/chain-love repository first.
            </p>
            <Button onClick={() => (window.location.href = '/fork-pr')}>
              Go to Fork & PR Page
            </Button>
            <Button
              variant='outline'
              onClick={checkFork}
              className='ml-2'
            >
              Check Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Add RPC Endpoint</h1>
        <p className='text-gray-11'>
          Add a new RPC endpoint to the Chain-Love database
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Network Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Network & Chain</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='network'>Network *</Label>
              {isLoadingNetworks ? (
                <div className='mt-1 flex items-center gap-2'>
                  <LoadingSpinner size={16} />
                  <span className='text-sm text-gray-11'>Loading networks...</span>
                </div>
              ) : (
                <select
                  id='network'
                  value={network}
                  onChange={e => setNetwork(e.target.value)}
                  className='mt-1 w-full rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-9'
                >
                  {networks.map(net => (
                    <option key={net.key} value={net.key}>
                      {net.name}
                    </option>
                  ))}
                </select>
              )}
              <p className='mt-1 text-xs text-gray-11'>
                File will be created/updated in:{' '}
                <code className='text-xs bg-gray-2 px-1 rounded'>
                  networks/{getNetworkFolder(network)}/rpc.csv
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Required fields</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='slug'>Slug *</Label>
                <Input
                  id='slug'
                  value={formData.slug}
                  onChange={e => handleInputChange('slug', e.target.value)}
                  placeholder='e.g., infura-ethereum-mainnet-free'
                  required
                />
              </div>
              <div>
                <Label htmlFor='provider'>Provider *</Label>
                <Input
                  id='provider'
                  value={formData.provider}
                  onChange={e => handleInputChange('provider', e.target.value)}
                  placeholder='e.g., Infura'
                  required
                />
              </div>
              <div>
                <Label htmlFor='plan'>Plan *</Label>
                <Input
                  id='plan'
                  value={formData.plan}
                  onChange={e => handleInputChange('plan', e.target.value)}
                  placeholder='e.g., Free, Pro, Enterprise'
                  required
                />
              </div>
              <div>
                <Label htmlFor='nodeType'>Node Type *</Label>
                <select
                  id='nodeType'
                  value={formData.nodeType}
                  onChange={e => handleInputChange('nodeType', e.target.value)}
                  className='mt-1 w-full rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-9'
                  required
                >
                  <option value=''>Select node type</option>
                  <option value='Recent-State'>Recent-State</option>
                  <option value='Full Archive'>Full Archive</option>
                </select>
                <p className='mt-1 text-xs text-gray-11'>
                  Use only Recent-State or Full Archive unless approved
                </p>
              </div>
              <div>
                <Label htmlFor='chain'>Chain *</Label>
                <Input
                  id='chain'
                  value={formData.chain}
                  onChange={e => handleInputChange('chain', e.target.value)}
                  placeholder='e.g., mainnet, sepolia'
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Address */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Address (Optional)</CardTitle>
            <CardDescription>
              Your address to claim provider ownership (PR subject to KYC)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor='address'>Owner Address</Label>
              <Input
                id='address'
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                placeholder='0x...'
              />
              <p className='mt-1 text-xs text-gray-11'>
                Format: 0x... (Leave blank if not claiming ownership)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & SLAs */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & SLAs</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div>
                <Label htmlFor='accessPrice'>Access Price</Label>
                <Input
                  id='accessPrice'
                  value={formData.accessPrice}
                  onChange={e => handleInputChange('accessPrice', e.target.value)}
                  placeholder='e.g., $0, $49, Custom'
                />
                <p className='mt-1 text-xs text-gray-11'>
                  Monthly access price. Provide information about discounts if available.
                </p>
              </div>
              <div>
                <Label htmlFor='queryPrice'>Query Price</Label>
                <Input
                  id='queryPrice'
                  value={formData.queryPrice}
                  onChange={e => handleInputChange('queryPrice', e.target.value)}
                  placeholder='e.g., $0, $0.40/1M CUs'
                />
                <p className='mt-1 text-xs text-gray-11'>
                  Price per 1M requests (or CUs). Specify unit if not per request.
                </p>
              </div>
              <div>
                <Label htmlFor='uptimeSla'>Uptime SLA</Label>
                <Input
                  id='uptimeSla'
                  value={formData.uptimeSla}
                  onChange={e => handleInputChange('uptimeSla', e.target.value)}
                  placeholder='e.g., 99.9%, 99.99%'
                />
                <p className='mt-1 text-xs text-gray-11'>
                  Stated uptime guarantee. Use percent format if applicable.
                </p>
              </div>
              <div>
                <Label htmlFor='bandwidthSla'>Bandwidth SLA</Label>
                <Input
                  id='bandwidthSla'
                  value={formData.bandwidthSla}
                  onChange={e => handleInputChange('bandwidthSla', e.target.value)}
                  placeholder='e.g., 1G/s, 10G/s'
                />
                <p className='mt-1 text-xs text-gray-11'>
                  Stated bandwidth guarantee.
                </p>
              </div>
              <div>
                <Label htmlFor='blocksBehindSla'>Blocks Behind SLA</Label>
                <Input
                  id='blocksBehindSla'
                  type='number'
                  value={formData.blocksBehindSla}
                  onChange={e => handleInputChange('blocksBehindSla', e.target.value)}
                  placeholder='e.g., 100, 200'
                />
                <p className='mt-1 text-xs text-gray-11'>
                  Stated maximum lag in blocks (number format).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Options</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-4'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.starred}
                  onChange={e => handleInputChange('starred', e.target.checked)}
                  className='rounded'
                />
                <span className='text-sm'>Starred</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.trial}
                  onChange={e => handleInputChange('trial', e.target.checked)}
                  className='rounded'
                />
                <span className='text-sm'>Trial Available</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Array Fields */}
        {(['availableApis', 'limitations', 'securityImprovements', 'monitoringAndAnalytics', 'regions'] as const).map(field => (
          <Card key={field}>
            <CardHeader>
              <CardTitle className='capitalize'>
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {(formData[field] || []).map((item, index) => (
                <div key={index} className='flex gap-2'>
                  <Input
                    value={item}
                    onChange={e => handleArrayChange(field, index, e.target.value)}
                    placeholder={
                      field === 'availableApis' ? 'e.g., eth, net, web3' :
                      field === 'limitations' ? 'e.g., 12M req/mo, 40 rps' :
                      field === 'regions' ? 'e.g., US East, EU West' :
                      `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`
                    }
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => removeArrayItem(field, index)}
                  >
                    <X className='size-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => addArrayItem(field)}
                className='w-full'
              >
                <Plus className='mr-2 size-4' />
                Add {field.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
              {field === 'availableApis' && (
                <p className='mt-1 text-xs text-gray-11'>
                  Namespaces/method groups (e.g., eth, web3, net, debug, trace)
                </p>
              )}
              {field === 'limitations' && (
                <p className='mt-1 text-xs text-gray-11'>
                  Rate limits/quotas. Express limits with unit and period (e.g., req/s, req/min, per month)
                </p>
              )}
              {field === 'regions' && (
                <p className='mt-1 text-xs text-gray-11'>
                  Hosting regions. Use &quot;Global&quot; if specific region is unknown or not applicable
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Action Buttons</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {(formData.actionButtons || []).map((item, index) => (
              <div key={index} className='flex gap-2'>
                <Input
                  value={item}
                  onChange={e => handleArrayChange('actionButtons', index, e.target.value)}
                  placeholder='e.g., [Buy](https://www.example.com/#pricing), [Docs](https://docs.example.com/)'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => removeArrayItem('actionButtons', index)}
                >
                  <X className='size-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              onClick={() => addArrayItem('actionButtons')}
              className='w-full'
            >
              <Plus className='mr-2 size-4' />
              Add Action Button
            </Button>
            <p className='mt-1 text-xs text-gray-11'>
              Use Markdown format: [Text](URL). Example: [Buy](https://www.example.com/#pricing), [Docs](https://docs.example.com/)
            </p>
          </CardContent>
        </Card>


        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Row Summary</CardTitle>
            <CardDescription>
              All 22 fields that will be added to networks/{network}/rpc.csv
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='rounded-md bg-gray-3 p-4'>
              <div className='mb-3 text-xs font-semibold text-gray-12'>
                PR will be created for: <strong>{network}</strong> network, <strong>{formData.chain}</strong> chain
              </div>
              <div className='grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono'>
                <div><span className='text-gray-11'>1. slug:</span> <span className='text-gray-12'>{formData.slug || '(empty)'}</span></div>
                <div><span className='text-gray-11'>2. provider:</span> <span className='text-gray-12'>{formData.provider || '(empty)'}</span></div>
                <div><span className='text-gray-11'>3. plan:</span> <span className='text-gray-12'>{formData.plan || '(empty)'}</span></div>
                <div><span className='text-gray-11'>4. nodeType:</span> <span className='text-gray-12'>{formData.nodeType || '(empty)'}</span></div>
                <div><span className='text-gray-11'>5. chain:</span> <span className='text-gray-12'>{formData.chain || '(empty)'}</span></div>
                <div><span className='text-gray-11'>6. accessPrice:</span> <span className='text-gray-12'>{formData.accessPrice || 'null'}</span></div>
                <div><span className='text-gray-11'>7. queryPrice:</span> <span className='text-gray-12'>{formData.queryPrice || 'null'}</span></div>
                <div><span className='text-gray-11'>8. uptimeSla:</span> <span className='text-gray-12'>{formData.uptimeSla || 'null'}</span></div>
                <div><span className='text-gray-11'>9. bandwidthSla:</span> <span className='text-gray-12'>{formData.bandwidthSla || 'null'}</span></div>
                <div><span className='text-gray-11'>10. blocksBehindSla:</span> <span className='text-gray-12'>{formData.blocksBehindSla || 'null'}</span></div>
                <div><span className='text-gray-11'>11. starred:</span> <span className='text-gray-12'>{formData.starred ? 'TRUE' : 'FALSE'}</span></div>
                <div><span className='text-gray-11'>12. trial:</span> <span className='text-gray-12'>{formData.trial ? 'TRUE' : 'FALSE'}</span></div>
                <div><span className='text-gray-11'>13. availableApis:</span> <span className='text-gray-12'>{formData.availableApis?.length ? JSON.stringify(formData.availableApis) : 'null'}</span></div>
                <div><span className='text-gray-11'>14. limitations:</span> <span className='text-gray-12'>{formData.limitations?.length ? JSON.stringify(formData.limitations) : 'null'}</span></div>
                <div><span className='text-gray-11'>15. securityImprovements:</span> <span className='text-gray-12'>{formData.securityImprovements?.length ? JSON.stringify(formData.securityImprovements) : 'null'}</span></div>
                <div><span className='text-gray-11'>16. monitoringAndAnalytics:</span> <span className='text-gray-12'>{formData.monitoringAndAnalytics?.length ? JSON.stringify(formData.monitoringAndAnalytics) : 'null'}</span></div>
                <div><span className='text-gray-11'>17. regions:</span> <span className='text-gray-12'>{formData.regions?.length ? JSON.stringify(formData.regions) : 'null'}</span></div>
                <div><span className='text-gray-11'>18. verifiedUptime:</span> <span className='text-gray-11'>null (reserved)</span></div>
                <div><span className='text-gray-11'>19. verifiedLatency:</span> <span className='text-gray-11'>null (reserved)</span></div>
                <div><span className='text-gray-11'>20. verifiedBlocksBehindAvg:</span> <span className='text-gray-11'>null (reserved)</span></div>
                <div><span className='text-gray-11'>21. actionButtons:</span> <span className='text-gray-12'>{formData.actionButtons?.length ? JSON.stringify(formData.actionButtons) : 'null'}</span></div>
                <div><span className='text-gray-11'>22. address:</span> <span className='text-gray-12'>{formData.address || 'null'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={loadMockData}
                disabled={isSubmitting}
              >
                Load Mock Data
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || !!prUrl || !formData.slug || !formData.provider || !formData.plan || !formData.nodeType || !formData.chain}
                className='flex-1'
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span className='ml-2'>Creating PR...</span>
                  </>
                ) : (
                  <>
                    <Server className='mr-2 size-4' />
                    Create PR for {network} {formData.chain}
                  </>
                )}
              </Button>
            </div>

            {prUrl && (
              <div className='mt-4 flex items-center gap-2 text-success'>
                <CheckCircle2 className='size-5' />
                <span>PR created successfully!</span>
                <Button
                  variant='outline'
                  onClick={() => window.open(prUrl, '_blank')}
                  className='ml-auto'
                >
                  View PR
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

