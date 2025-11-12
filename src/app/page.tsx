'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Github, GitFork, Server, Network, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function HomePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      toast.error(`Authentication error: ${error}`);
    } else if (success) {
      toast.success('Successfully authenticated with GitHub!');
    }
  }, [searchParams]);
  return (
    <div className='min-h-screen bg-gray-1'>
      {/* Hero Section */}
      <section className='container mx-auto px-4 py-16 md:py-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight text-gray-12 md:text-6xl'>
            ContribHub
          </h1>
          <p className='mb-8 text-xl text-gray-11 md:text-2xl'>
            Streamline your contributions to the Chain-Love repository. Fork, create pull requests, and add RPC endpoints with ease.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button asChild size='lg' className='flex items-center gap-2'>
              <Link href='/fork-pr'>
                <GitFork className='size-5' />
                Get Started
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg' className='flex items-center gap-2'>
              <a href='https://github.com/Chain-Love/chain-love' target='_blank' rel='noopener noreferrer'>
                <Github className='size-5' />
                View Repository
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-12'>
            What You Can Do
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            {/* Fork & PR Card */}
            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader>
                <div className='mb-4 flex size-12 items-center justify-center rounded-lg bg-accent-9/10'>
                  <GitFork className='size-6 text-accent-9' />
                </div>
                <CardTitle>Fork & Create PR</CardTitle>
                <CardDescription>
                  Authenticate with GitHub, fork the repository, and create pull requests directly from the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant='outline' className='w-full'>
                  <Link href='/fork-pr' className='flex items-center justify-center gap-2'>
                    Go to Fork & PR
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Add RPC Card */}
            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader>
                <div className='mb-4 flex size-12 items-center justify-center rounded-lg bg-accent-9/10'>
                  <Server className='size-6 text-accent-9' />
                </div>
                <CardTitle>Add RPC Endpoint</CardTitle>
                <CardDescription>
                  Easily add new RPC endpoints to the Chain-Love database with a user-friendly form interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant='outline' className='w-full'>
                  <Link href='/add-rpc' className='flex items-center justify-center gap-2'>
                    Add RPC Endpoint
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Browse RPC Card */}
            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader>
                <div className='mb-4 flex size-12 items-center justify-center rounded-lg bg-accent-9/10'>
                  <Network className='size-6 text-accent-9' />
                </div>
                <CardTitle>Browse RPC Endpoints</CardTitle>
                <CardDescription>
                  Explore and discover RPC endpoints from all supported networks and chains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant='outline' className='w-full'>
                  <Link href='/rpc' className='flex items-center justify-center gap-2'>
                    Browse RPCs
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-12'>
            How It Works
          </h2>
          <div className='space-y-8'>
            <div className='flex gap-4'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-9 text-white font-bold'>
                1
              </div>
              <div>
                <h3 className='mb-2 text-xl font-semibold text-gray-12'>
                  Authenticate with GitHub
                </h3>
                <p className='text-gray-11'>
                  Click &quot;Login with GitHub&quot; to authenticate your GitHub account. This allows you to fork repositories and create pull requests.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-9 text-white font-bold'>
                2
              </div>
              <div>
                <h3 className='mb-2 text-xl font-semibold text-gray-12'>
                  Fork the Repository
                </h3>
                <p className='text-gray-11'>
                  Fork the Chain-Love/chain-love repository to your GitHub account with a single click.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-9 text-white font-bold'>
                3
              </div>
              <div>
                <h3 className='mb-2 text-xl font-semibold text-gray-12'>
                  Add Your Contributions
                </h3>
                <p className='text-gray-11'>
                  Use the Add RPC Endpoint form to add new RPC endpoints, or manually edit files in your fork on GitHub.
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-9 text-white font-bold'>
                4
              </div>
              <div>
                <h3 className='mb-2 text-xl font-semibold text-gray-12'>
                  Create Pull Request
                </h3>
                <p className='text-gray-11'>
                  Create a pull request from your fork to the upstream repository. Your contributions will be reviewed and merged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-6 bg-gray-2 py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-gray-11'>
          <p>
            ContribHub - Making contributions to Chain-Love easier
          </p>
          <p className='mt-2'>
            <a
              href='https://github.com/Chain-Love/chain-love'
              target='_blank'
              rel='noopener noreferrer'
              className='text-accent-9 hover:underline'
            >
              View Chain-Love Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
