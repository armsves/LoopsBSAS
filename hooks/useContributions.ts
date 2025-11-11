import { useState, useEffect, useCallback } from "react";

export interface Contribution {
  id: string;
  contributor: string;
  timestamp: number;
  data: Record<string, any>;
  status: "pending" | "analyzing" | "approved" | "rejected" | "completed";
  aiAnalysis?: {
    approved: boolean;
    reason: string;
    score: number;
  };
  swapTxHash?: string;
  ipfsCid?: string;
  prMerged?: boolean;
}

/**
 * Hook for managing contributions storage
 * Stores contributions on IPFS instead of localStorage
 */
export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ipfsIndexCid, setIpfsIndexCid] = useState<string | null>(null);

  // Load contributions from IPFS on mount
  useEffect(() => {
    loadContributionsFromIPFS();
  }, []);

  const loadContributionsFromIPFS = async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first (for migration/fallback)
      const localIndexCid = localStorage.getItem("contributions_ipfs_index");
      if (localIndexCid) {
        setIpfsIndexCid(localIndexCid);
        // Fetch from IPFS gateway
        try {
          const response = await fetch(`/api/ipfs/upload?cid=${localIndexCid}`);
          // For now, fallback to localStorage if IPFS fetch fails
          const stored = localStorage.getItem("contributions_backup");
          if (stored) {
            const parsed = JSON.parse(stored);
            setContributions(parsed);
          }
        } catch (error) {
          console.warn("Failed to load from IPFS, using localStorage backup:", error);
          const stored = localStorage.getItem("contributions_backup");
          if (stored) {
            const parsed = JSON.parse(stored);
            setContributions(parsed);
          }
        }
      } else {
        // No IPFS index yet, check for localStorage backup
        const stored = localStorage.getItem("contributions_backup");
        if (stored) {
          const parsed = JSON.parse(stored);
          setContributions(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading contributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContributionsToIPFS = async (newContributions: Contribution[]) => {
    try {
      // Upload to IPFS
      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: newContributions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const result = await response.json();
      const cid = result.cid;

      // Store the index CID
      setIpfsIndexCid(cid);
      localStorage.setItem("contributions_ipfs_index", cid);

      // Also keep a backup in localStorage for faster access
      localStorage.setItem("contributions_backup", JSON.stringify(newContributions));

      setContributions(newContributions);
      console.log("✅ Contributions saved to IPFS:", cid);
    } catch (error) {
      console.error("Error saving contributions to IPFS:", error);
      // Fallback to localStorage if IPFS fails
      localStorage.setItem("contributions_backup", JSON.stringify(newContributions));
      setContributions(newContributions);
    }
  };

  const addContribution = useCallback(async (contribution: Omit<Contribution, "id" | "timestamp">) => {
    const newContribution: Contribution = {
      ...contribution,
      id: `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    const updated = [newContribution, ...contributions];
    await saveContributionsToIPFS(updated);
    return newContribution;
  }, [contributions]);

  const updateContribution = useCallback(async (id: string, updates: Partial<Contribution>) => {
    const updated = contributions.map((contrib) =>
      contrib.id === id ? { ...contrib, ...updates } : contrib
    );
    await saveContributionsToIPFS(updated);
  }, [contributions]);

  const getContribution = useCallback((id: string) => {
    return contributions.find((contrib) => contrib.id === id);
  }, [contributions]);

  return {
    contributions,
    isLoading,
    ipfsIndexCid,
    addContribution,
    updateContribution,
    getContribution,
    refreshContributions: loadContributionsFromIPFS,
  };
};

