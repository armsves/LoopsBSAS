import { useAccount } from "wagmi";
import { useDataSets } from "@filoz/synapse-react";
import { calibration } from '@filoz/synapse-core/chains';
import { useMemo } from "react";

/**
 * Wrapper around useDataSets that only calls it when on Filecoin Calibration chain
 * This prevents "Chain with id X not found" errors when on other chains
 * 
 * IMPORTANT: React hooks must be called unconditionally, so we always call useDataSets.
 * However, we check the chainId first and return safe defaults if not on Calibration.
 * The hook will still be called, but we prevent it from causing errors by checking chainId.
 */
export const useDataSetsWrapped = () => {
  const { address, chainId } = useAccount();

  // Check if we're on the correct chain for synapse operations
  const isOnCalibration = chainId === calibration.id;

  // Always call the hook (React rules), but check chainId first
  // If not on Calibration, the hook might error, so we'll handle it
  const hookResult = useDataSets({
    address: isOnCalibration ? address : undefined,
  });

  // If not on Calibration, return safe defaults to prevent errors
  // This prevents the hook from trying to access chain info when on wrong chain
  return useMemo(() => {
    if (!isOnCalibration) {
      return {
        data: [],
        isLoading: false,
        isFetchedAfterMount: true,
        error: null,
      };
    }
    return hookResult;
  }, [isOnCalibration, hookResult]);
};
