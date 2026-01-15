import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { PACKAGE_ID, UNIVERSE_MODULE } from "../constants";

export function useUniverses() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const [universes, setUniverses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUniverses = async () => {
            if (!account) {
                setUniverses([]);
                return;
            }

            setIsLoading(true);
            try {

                const result = await client.queryTransactionBlocks({
                    filter: {
                        FromAddress: account.address,
                    },
                    options: {
                        showEffects: true,
                        showInput: true,
                    },
                });

                const universeIds = result.data.flatMap((tx) => {

                    const isCreateUniverseTx = tx.transaction?.data.transaction?.kind === "ProgrammableTransaction" &&
                        tx.transaction.data.transaction.transactions.some((command) =>
                            "MoveCall" in command &&
                            command.MoveCall.package === PACKAGE_ID &&
                            command.MoveCall.module === UNIVERSE_MODULE &&
                            command.MoveCall.function === "create_universe"
                        );

                    if (!isCreateUniverseTx) return [];


                    return (
                        tx.effects?.created?.map((created) => created.reference.objectId) ||
                        []
                    );
                });


                setUniverses([...new Set(universeIds)]);
            } catch (error) {
                console.error("Error fetching universes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUniverses();
    }, [client, account]);

    return { universes, isLoading };
}
