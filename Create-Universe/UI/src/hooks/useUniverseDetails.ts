import { useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { PACKAGE_ID, UNIVERSE_MODULE } from "../constants";


export interface PlanetDef {
    name: string;
    orbit: number;
}

export interface StarDef {
    name: string;
    orbit: number;
    planets: PlanetDef[];
}

export interface GalaxyDef {
    name: string;
    stars: StarDef[];
}

export interface Galaxy {
    name: string;
    stars: any[];
}

export interface UniverseData {
    id: { id: string };
    galaxies: Galaxy[];
}

export function useUniverseDetails(universeId: string | null) {
    const client = useSuiClient();
    const { mutate: signAndExecute, isPending: isAddingGalaxy } = useSignAndExecuteTransaction();
    const [universeData, setUniverseData] = useState<UniverseData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUniverse = async () => {
        if (!universeId) return;
        setIsLoading(true);
        try {
            const result = await client.getObject({
                id: universeId,
                options: {
                    showContent: true,
                },
            });

            if (result.data?.content?.dataType === "moveObject") {
                const rawFields = result.data.content.fields as any;
                console.log("Fetcher Result Raw:", rawFields);


                const cleanGalaxies = rawFields.galaxies.map((g: any) => ({
                    name: g.fields.name,
                    stars: g.fields.stars.map((s: any) => ({
                        name: s.fields.name,
                        orbit: s.fields.orbit,
                        alive: s.fields.alive,
                        planets: s.fields.planets.map((p: any) => ({
                            name: p.fields.name,
                            orbit: p.fields.orbit
                        }))
                    }))
                }));

                const cleanData: UniverseData = {
                    id: rawFields.id,
                    galaxies: cleanGalaxies
                };

                console.log("Fetcher Result Clean:", cleanData);
                setUniverseData(cleanData);
            }
        } catch (error) {
            console.error("Error fetching universe details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUniverse();
    }, [universeId, client]);


    const addGalaxy = (name: string, onSuccess?: () => void) => {
        if (!universeId) return;
        const tx = new Transaction();
        const galaxy = tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_galaxy`,
            arguments: [tx.pure.string(name)],
        });
        tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_galaxy_on_universe`,
            arguments: [tx.object(universeId), galaxy],
        });
        signAndExecute({ transaction: tx }, {
            onSuccess: () => { fetchUniverse(); if (onSuccess) onSuccess(); }
        });
    };

    const addComplexGalaxy = (galaxyDef: GalaxyDef, targetUniverseId: string, onSuccess?: () => void) => {
        if (!targetUniverseId) return;

        const tx = new Transaction();


        const galaxy = tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_galaxy`,
            arguments: [tx.pure.string(galaxyDef.name)],
        });


        galaxyDef.stars.forEach((starDef) => {

            const star = tx.moveCall({
                target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_star`,
                arguments: [tx.pure.string(starDef.name), tx.pure.u8(starDef.orbit)],
            });


            starDef.planets.forEach((planetDef) => {

                const planet = tx.moveCall({
                    target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_planet`,
                    arguments: [tx.pure.string(planetDef.name), tx.pure.u8(planetDef.orbit)],
                });


                tx.moveCall({
                    target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_planet_on_star`,
                    arguments: [star, planet],
                });
            });


            tx.moveCall({
                target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_star_on_galaxy`,
                arguments: [galaxy, star],
            });
        });


        tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_galaxy_on_universe`,
            arguments: [tx.object(targetUniverseId), galaxy],
        });

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: (result) => {
                    console.log("Complex galaxy created!", result);
                    if (universeId === targetUniverseId) fetchUniverse();
                    if (onSuccess) onSuccess();
                },
                onError: (err) => {
                    console.error("Failed to create complex galaxy", err);
                },
            }
        );
    };

    const createUniverseAndAddGalaxy = (galaxyDef: GalaxyDef, onSuccess?: () => void) => {
        const tx = new Transaction();


        const universe = tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_universe`,
            arguments: [],
        });


        const galaxy = tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_galaxy`,
            arguments: [tx.pure.string(galaxyDef.name)],
        });


        galaxyDef.stars.forEach((starDef) => {
            const star = tx.moveCall({
                target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_star`,
                arguments: [tx.pure.string(starDef.name), tx.pure.u8(starDef.orbit)],
            });

            starDef.planets.forEach((planetDef) => {
                const planet = tx.moveCall({
                    target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::new_planet`,
                    arguments: [tx.pure.string(planetDef.name), tx.pure.u8(planetDef.orbit)],
                });
                tx.moveCall({
                    target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_planet_on_star`,
                    arguments: [star, planet],
                });
            });

            tx.moveCall({
                target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_star_on_galaxy`,
                arguments: [galaxy, star],
            });
        });


        tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::add_galaxy_on_universe`,
            arguments: [universe, galaxy],
        });


        tx.moveCall({
            target: `${PACKAGE_ID}::${UNIVERSE_MODULE}::create_universe`,
            arguments: [universe],
        });

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: (result) => {
                    console.log("New Universe with Galaxy created!", result);
                    if (onSuccess) onSuccess();
                },
                onError: (err) => {
                    console.error("Failed to create universe with galaxy", err);
                },
            }
        );
    };

    return { universeData, isLoading, addGalaxy, addComplexGalaxy, createUniverseAndAddGalaxy, isAddingGalaxy, refetch: fetchUniverse };
}
