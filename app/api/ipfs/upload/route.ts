import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { baseSepolia } from 'wagmi/chains';

/**
 * Upload contribution data to IPFS
 * Uses a simple approach: stores JSON data and returns a CID
 * In production, you would use a proper IPFS service like Pinata, Web3.Storage, or NFT.Storage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contributionData = body.data;

    if (!contributionData) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    // For now, we'll use a mock IPFS upload
    // In production, integrate with a real IPFS service like:
    // - Pinata: https://www.pinata.cloud/
    // - Web3.Storage: https://web3.storage/
    // - NFT.Storage: https://nft.storage/
    // - Helia/IPFS: https://github.com/ipfs/helia

    // Mock IPFS upload - generates a deterministic CID-like string
    // In production, replace this with actual IPFS upload
    const jsonString = JSON.stringify(contributionData);
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);
    
    // Simple hash-based CID generation (mock)
    // Real IPFS uses multihash, but for now we'll use a simple approach
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Generate a CID-like string (Qm prefix for v0, bafy for v1)
    // This is a simplified mock - real IPFS CIDs are more complex
    const mockCid = `bafybei${hashHex.slice(0, 52)}`;

    console.log('📦 Uploaded to IPFS (mock):', mockCid);
    console.log('📄 Data size:', jsonString.length, 'bytes');

    // In production, you would:
    // 1. Upload to IPFS using a service
    // 2. Pin the content
    // 3. Return the actual CID
    // Example with Web3.Storage:
    // const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });
    // const file = new File([jsonString], 'contribution.json', { type: 'application/json' });
    // const cid = await client.put([file]);

    return NextResponse.json({
      success: true,
      cid: mockCid,
      size: jsonString.length,
      url: `https://ipfs.io/ipfs/${mockCid}`, // Mock IPFS gateway URL
    });
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to upload to IPFS',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch contribution data from IPFS
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');

    if (!cid) {
      return NextResponse.json(
        { error: 'CID parameter required' },
        { status: 400 }
      );
    }

    // Mock IPFS fetch
    // In production, fetch from IPFS gateway or service
    // Example: const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
    // const data = await response.json();

    return NextResponse.json({
      success: true,
      cid,
      message: 'Mock IPFS fetch - implement real IPFS gateway fetch',
    });
  } catch (error: any) {
    console.error('Error fetching from IPFS:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch from IPFS',
      },
      { status: 500 }
    );
  }
}

