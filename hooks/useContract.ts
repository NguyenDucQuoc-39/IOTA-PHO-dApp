"use client";

/**
 * ============================================================================
 * IOTA CONTRACT INTEGRATION HOOK
 * ============================================================================
 *
 * This hook contains ALL the contract interaction logic.
 *
 * To customize your dApp, modify the configuration section below.
 *
 * ============================================================================
 */

import { useState } from "react";
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
  useIotaClientQuery,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { useNetworkVariable } from "@/lib/config";
import type { IotaObjectData } from "@iota/iota-sdk/client";

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================
// Change these values to match your Move contract

export const CONTRACT_MODULE = "pho"; // Your Move module name
export const CONTRACT_METHODS = {
  COOK: "cook_pho",
  GET_FLAG: "get_perfect_pho_flag",
} as const;

// ============================================================================
// DATA EXTRACTION
// ============================================================================
// Modify this to extract data from your contract's object structure

interface PhoData {
  brothQuality: number;
  noodleThickness: number;
  beefBrisket: number;
  basil: number;
  cilantro: number;
  mint: number;
  starAnise: number;
  cinnamon: number;
}

function getPhoBoxFields(data: IotaObjectData): PhoData | null {
  if (data.content?.dataType !== "moveObject") {
    console.log("Data is not a moveObject:", data.content?.dataType);
    return null;
  }

  const fields = data.content.fields as Record<string, unknown>;
  if (!fields || !fields.pho) {
    console.log("No pho fields found in object data");
    return null;
  }

  // Log the actual structure for debugging
  console.log("PhoBox fields structure:", JSON.stringify(fields, null, 2));

  const pho = fields.pho as Record<string, unknown>;

  try {
    return {
      brothQuality: parseInt(String(pho.broth_quality), 10),
      noodleThickness: parseInt(String(pho.noodle_thickness), 10),
      beefBrisket: parseInt(String(pho.beef_brisket), 10),
      basil: parseInt(String(pho.basil), 10),
      cilantro: parseInt(String(pho.cilantro), 10),
      mint: parseInt(String(pho.mint), 10),
      starAnise: parseInt(String(pho.star_anise), 10),
      cinnamon: parseInt(String(pho.cinnamon), 10),
    };
  } catch (error) {
    console.error("Error parsing pho fields:", error);
    return null;
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export interface ContractData {
  brothQuality: number;
  noodleThickness: number;
  beefBrisket: number;
  basil: number;
  cilantro: number;
  mint: number;
  starAnise: number;
  cinnamon: number;
}

export interface ContractState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: string | undefined;
  error: Error | null;
}

export interface ContractActions {
  cookPho: (
    brothQuality: number,
    noodleThickness: number,
    beefBrisket: number,
    basil: number,
    cilantro: number,
    mint: number,
    starAnise: number,
    cinnamon: number
  ) => Promise<void>;
  getPerfectPhoFlag: () => Promise<void>;
  clearObject: () => void;
}

export const useContract = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const packageId = useNetworkVariable("packageId");
  const iotaClient = useIotaClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [phoBoxId, setPhoBoxId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`phoBoxId_${currentAccount.address}`);
    }
    return null;
  });
  const [flagId, setFlagId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`flagId_${currentAccount.address}`);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [transactionError, setTransactionError] = useState<Error | null>(null);

  // Fetch pho box data
  const {
    data,
    isPending: isFetching,
    error: queryError,
    refetch,
  } = useIotaClientQuery(
    "getObject",
    {
      id: phoBoxId!,
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: !!phoBoxId,
    }
  );

  // Extract fields
  const fields = data?.data ? getPhoBoxFields(data.data) : null;

  // Check if object exists but data extraction failed
  const objectExists = !!data?.data;
  const hasValidData = !!fields;

  // Cook Pho
  const cookPho = async (
    brothQuality: number,
    noodleThickness: number,
    beefBrisket: number,
    basil: number,
    cilantro: number,
    mint: number,
    starAnise: number,
    cinnamon: number
  ) => {
    if (!packageId) return;

    try {
      setTransactionError(null);
      setHash(undefined);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.pure.u16(brothQuality),
          tx.pure.u16(noodleThickness),
          tx.pure.u16(beefBrisket),
          tx.pure.u16(basil),
          tx.pure.u16(cilantro),
          tx.pure.u16(mint),
          tx.pure.u16(starAnise),
          tx.pure.u16(cinnamon),
        ],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.COOK}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newPhoBoxId = effects?.created?.[0]?.reference?.objectId;
              if (newPhoBoxId) {
                setPhoBoxId(newPhoBoxId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`phoBoxId_${address}`, newPhoBoxId);
                }
                await refetch();
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No pho box ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error cooking pho:", err);
    }
  };

  // Get Flag
  const getPerfectPhoFlag = async () => {
    if (!phoBoxId || !packageId) return;

    try {
      setTransactionError(null);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [tx.object(phoBoxId)],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.GET_FLAG}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newFlagId = effects?.created?.[0]?.reference?.objectId;
              if (newFlagId) {
                setFlagId(newFlagId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`flagId_${address}`, newFlagId);
                }
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No flag ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            let message = String(err);
            
            // Check if it's a MoveAbort error (recipe validation failed)
            if (message.includes("MoveAbort") && message.includes("EPerfectPho")) {
              message = "❌ Recipe is not perfect! Your pho doesn't match the authentic Northern Pho recipe. The perfect recipe is: broth=10, noodle=2, beef=70, basil=30, cilantro=25, mint=15, star_anise=2, cinnamon=1";
            } else if (message.includes("MoveAbort")) {
              message = "❌ Transaction failed! Your ingredients don't match the perfect pho recipe.";
            }
            
            const error = new Error(message);
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error getting flag:", err);
    }
  };

  const contractData: ContractData | null = fields;

  const clearObject = () => {
    setPhoBoxId(null);
    setFlagId(null);
    setTransactionError(null);
    if (typeof window !== "undefined" && address) {
      localStorage.removeItem(`phoBoxId_${address}`);
      localStorage.removeItem(`flagId_${address}`);
    }
  };

  const actions: ContractActions = {
    cookPho,
    getPerfectPhoFlag,
    clearObject,
  };

  const contractState: ContractState = {
    isLoading: isLoading,
    isPending,
    isConfirming: false,
    isConfirmed: !!hash && !isLoading && !isPending,
    hash,
    error: queryError || transactionError,
  };

  return {
    data: contractData,
    actions,
    state: contractState,
    phoBoxId,
    flagId,
    objectExists,
    hasValidData,
    isFetching,
  };
};
