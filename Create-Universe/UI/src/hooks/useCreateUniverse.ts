import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, UNIVERSE_MODULE } from "../constants";

export function useCreateUniverse() {
    const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

    const createUniverse = (onSuccess?: () => void) => {
        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::create_universe`,
            arguments: [],
        });

        signAndExecute(
            {
                transaction: tx,
            },
            {
                onSuccess: (result) => {
                    console.log("Universe created successfully:", result);
                    if (onSuccess) onSuccess();
                },
                onError: (error) => {
                    console.error("Failed to create universe:", error);
                },
            }
        );
    };

    return { createUniverse, isPending };
}
