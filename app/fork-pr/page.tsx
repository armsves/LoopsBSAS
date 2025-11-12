'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Badge } from '@/components/ui/shadcn/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Github, CheckCircle2, XCircle, ExternalLink, GitFork, GitPullRequest, Server } from 'lucide-react';
import { toast } from 'sonner';

type AuthStatus = 'not_authenticated' | 'checking' | 'authenticated';
type ForkStatus = 'not_forked' | 'forking' | 'forked' | 'error';
type PrStatus = 'not_created' | 'creating' | 'created' | 'error';

export default function ForkPRPage() {
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  const [forkStatus, setForkStatus] = useState<ForkStatus>('not_forked');
  const [prStatus, setPrStatus] = useState<PrStatus>('not_created');
  const [forkUrl, setForkUrl] = useState<string | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [prTitle, setPrTitle] = useState('');
  const [prBody, setPrBody] = useState('');
  const [prBranch, setPrBranch] = useState('');

  useEffect(() => {
    // Check for OAuth callback errors/success
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      toast.error(`Authentication error: ${error}`);
    } else if (success) {
      toast.success('Successfully authenticated with GitHub!');
    }

    // Check authentication status
    checkAuthStatus();
  }, [searchParams]);

  useEffect(() => {
    // Check fork status when authenticated
    if (authStatus === 'authenticated') {
      checkForkStatus();
    }
  }, [authStatus]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/github/check-auth');
      if (response.ok) {
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('not_authenticated');
      }
    } catch {
      setAuthStatus('not_authenticated');
    }
  };

  const checkForkStatus = async () => {
    try {
      const response = await fetch('/api/github/fork');
      if (response.ok) {
        const data = await response.json();
        if (data.forkExists) {
          setForkStatus('forked');
          setForkUrl(data.forkUrl);
        }
      }
    } catch (error) {
      // Silently fail - fork check is optional
      console.log('Fork status check failed:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/github/auth';
  };

  const handleFork = async () => {
    setForkStatus('forking');
    try {
      const response = await fetch('/api/github/fork', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setForkStatus('forked');
        setForkUrl(data.forkUrl);
        toast.success(data.message || 'Repository forked successfully!');
      } else {
        setForkStatus('error');
        // Show detailed error message
        const errorMsg = data.error || 'Failed to fork repository';
        const details = data.details ? ` Details: ${JSON.stringify(data.details)}` : '';
        toast.error(errorMsg + details);
        console.error('Fork error details:', data);
      }
    } catch (error: any) {
      setForkStatus('error');
      toast.error('Failed to fork repository: ' + (error.message || 'Network error'));
      console.error('Fork error:', error);
    }
  };

  const handleCreatePR = async () => {
    if (!prTitle.trim() || !prBranch.trim()) {
      toast.error('Please provide a PR title and branch name');
      return;
    }

    setPrStatus('creating');
    try {
      const response = await fetch('/api/github/create-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prTitle,
          body: prBody,
          branch: prBranch,
                    baseBranch: 'main', // Default branch for chain-love repo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrStatus('created');
        setPrUrl(data.prUrl);
        toast.success('Pull request created successfully!');
      } else {
        setPrStatus('error');
        toast.error(data.error || 'Failed to create pull request');
      }
    } catch (error: any) {
      setPrStatus('error');
      toast.error('Failed to create pull request');
    }
  };

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-4xl font-bold'>Fork & Create PR</h1>
            <p className='text-gray-11'>
              Fork the Chain-Love/chain-love repository and create a pull request
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/add-rpc')}
          >
            <Server className='mr-2 size-4' />
            Add RPC Endpoint
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Authentication Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Github className='size-5' />
              Step 1: Authenticate with GitHub
            </CardTitle>
            <CardDescription>
              Login with your GitHub account to fork the repository
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {authStatus === 'checking' && (
              <div className='flex items-center gap-2'>
                <LoadingSpinner size={20} />
                <span className='text-sm text-gray-11'>Checking authentication...</span>
              </div>
            )}

            {authStatus === 'not_authenticated' && (
              <Button onClick={handleLogin} className='w-full'>
                <Github className='mr-2 size-4' />
                Login with GitHub
              </Button>
            )}

            {authStatus === 'authenticated' && (
              <div className='flex items-center gap-2 text-success'>
                <CheckCircle2 className='size-5' />
                <span>Authenticated with GitHub</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fork Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <GitFork className='size-5' />
              Step 2: Fork Repository
            </CardTitle>
            <CardDescription>
              Fork Chain-Love/chain-love to your GitHub account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {authStatus !== 'authenticated' && (
              <p className='text-sm text-gray-11'>
                Please authenticate with GitHub first
              </p>
            )}

            {authStatus === 'authenticated' && (forkStatus === 'not_forked' || forkStatus === 'forking') && (
              <Button
                onClick={handleFork}
                disabled={forkStatus === 'forking'}
                className='w-full'
              >
                {forkStatus === 'forking' ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span className='ml-2'>Forking...</span>
                  </>
                ) : (
                  <>
                    <GitFork className='mr-2 size-4' />
                    Fork Repository
                  </>
                )}
              </Button>
            )}

            {forkStatus === 'forked' && forkUrl && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-success'>
                  <CheckCircle2 className='size-5' />
                  <span>Repository forked successfully!</span>
                </div>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => window.open(forkUrl, '_blank')}
                >
                  <ExternalLink className='mr-2 size-4' />
                  View Fork
                </Button>
              </div>
            )}

            {forkStatus === 'error' && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-destructive'>
                  <XCircle className='size-5' />
                  <span>Failed to fork repository</span>
                </div>
                <p className='text-xs text-gray-11'>
                  Check the browser console for detailed error information.
                  Common issues: insufficient permissions, repository already forked, or network error.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create PR Card */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <GitPullRequest className='size-5' />
              Step 3: Create Pull Request
            </CardTitle>
            <CardDescription>
              Create a pull request from your fork to the upstream repository
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {forkStatus !== 'forked' && (
              <p className='text-sm text-gray-11'>
                Please fork the repository first
              </p>
            )}

            {forkStatus === 'forked' && (
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='pr-title'>PR Title *</Label>
                  <Input
                    id='pr-title'
                    placeholder='e.g., Add new RPC endpoint for Ethereum mainnet'
                    value={prTitle}
                    onChange={e => setPrTitle(e.target.value)}
                    className='mt-1'
                  />
                  <p className='mt-1 text-xs text-gray-11'>
                    Be specific about what you&apos;re adding or updating (e.g., &quot;Add ProviderX RPC for Ethereum&quot;, &quot;Update networks/ethereum/rpc.csv&quot;)
                  </p>
                </div>

                <div>
                  <Label htmlFor='pr-branch'>Branch Name *</Label>
                  <Input
                    id='pr-branch'
                    placeholder='e.g., add-ethereum-rpc'
                    value={prBranch}
                    onChange={e => setPrBranch(e.target.value)}
                    className='mt-1'
                  />
                  <p className='mt-1 text-xs text-gray-11'>
                    The branch name in your fork (must exist in your fork). Example: <code className='text-xs bg-gray-2 px-1 rounded'>add-ethereum-rpc</code>
                  </p>
                </div>

                <div>
                  <Label htmlFor='pr-body'>PR Description</Label>
                  <textarea
                    id='pr-body'
                    placeholder='Describe your changes...&#10;&#10;Example:&#10;- Added new RPC endpoint for Ethereum mainnet&#10;- Updated provider information in networks/ethereum/rpc.csv&#10;- Followed Style Guide formatting requirements'
                    value={prBody}
                    onChange={e => setPrBody(e.target.value)}
                    className='mt-1 min-h-[100px] w-full rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-9'
                    rows={6}
                  />
                  <p className='mt-1 text-xs text-gray-11'>
                    Describe what changes you made and which files were modified. Reference the{' '}
                    <a
                      href='https://github.com/Chain-Love/chain-love/wiki/Style-Guide'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-accent-9 hover:underline'
                    >
                      Style Guide
                    </a>{' '}
                    if applicable.
                  </p>
                </div>

                <Button
                  onClick={handleCreatePR}
                  disabled={prStatus === 'creating' || !prTitle.trim() || !prBranch.trim()}
                  className='w-full'
                >
                  {prStatus === 'creating' ? (
                    <>
                      <LoadingSpinner size={16} />
                      <span className='ml-2'>Creating PR...</span>
                    </>
                  ) : (
                    <>
                      <GitPullRequest className='mr-2 size-4' />
                      Create Pull Request
                    </>
                  )}
                </Button>

                {prStatus === 'created' && prUrl && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-success'>
                      <CheckCircle2 className='size-5' />
                      <span>Pull request created successfully!</span>
                    </div>
                    <Button
                      variant='outline'
                      className='w-full'
                      onClick={() => window.open(prUrl, '_blank')}
                    >
                      <ExternalLink className='mr-2 size-4' />
                      View Pull Request
                    </Button>
                  </div>
                )}

                {prStatus === 'error' && (
                  <div className='flex items-center gap-2 text-destructive'>
                    <XCircle className='size-5' />
                    <span>Failed to create pull request</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className='list-decimal space-y-2 pl-5 text-sm text-gray-11'>
            <li>Authenticate with GitHub using OAuth</li>
            <li>Fork the Chain-Love/chain-love repository to your account</li>
            <li>Make changes in your fork (you&apos;ll need to do this manually via GitHub)</li>
            <li>Create a pull request from your fork&apos;s branch to the upstream repository</li>
          </ol>
          
          <div className='mt-6 space-y-4'>
            <div className='rounded-md bg-gray-3 p-4'>
              <p className='text-sm font-medium text-gray-12 mb-2'>Repository Structure</p>
              <p className='text-sm text-gray-11 mb-2'>
                The chain-love repository uses CSV files organized by network:
              </p>
              <code className='block text-xs bg-gray-2 p-2 rounded mb-2'>
                networks/&lt;network_name&gt;/rpc.csv
              </code>
              <p className='text-sm text-gray-11'>
                For example, to add an RPC endpoint for Ethereum, edit:{' '}
                <code className='text-xs bg-gray-2 px-1 rounded'>networks/ethereum/rpc.csv</code>
              </p>
            </div>

            <div className='rounded-md bg-gray-3 p-4'>
              <p className='text-sm font-medium text-gray-12 mb-2'>Important Guidelines</p>
              <ul className='list-disc space-y-1 pl-5 text-sm text-gray-11'>
                <li>
                  Follow the{' '}
                  <a
                    href='https://github.com/Chain-Love/chain-love/wiki/Style-Guide'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-accent-9 hover:underline'
                  >
                    Style Guide
                  </a>{' '}
                  for formatting
                </li>
                <li>
                  Review the{' '}
                  <a
                    href='https://github.com/Chain-Love/chain-love/wiki/RPC'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-accent-9 hover:underline'
                  >
                    RPC Column Definitions
                  </a>{' '}
                  before adding entries
                </li>
                <li>Use uppercase <code className='text-xs bg-gray-2 px-1 rounded'>TRUE</code>/<code className='text-xs bg-gray-2 px-1 rounded'>FALSE</code> for boolean values</li>
                <li>Validate JSON columns with jsonformatter.org</li>
                <li>Check existing entries for consistency in naming</li>
              </ul>
            </div>

            <div className='rounded-md bg-gray-3 p-4'>
              <p className='text-sm font-medium text-gray-12 mb-2'>Note:</p>
              <p className='text-sm text-gray-11'>
                You need to create the branch and make changes in your fork manually on GitHub.
                This tool only helps you fork the repository and create the PR after you&apos;ve made your changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

