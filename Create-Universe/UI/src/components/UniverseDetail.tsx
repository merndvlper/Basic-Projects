import { useUniverseDetails, GalaxyDef } from "../hooks/useUniverseDetails";
import { Box, Button, Card, Flex, Heading, Text, Grid, Dialog, ScrollArea } from "@radix-ui/themes";
import { useState } from "react";
import { GalaxyBuilder } from "./GalaxyBuilder";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface UniverseDetailProps {
    universeId: string;
    onBack: () => void;
}

export function UniverseDetail({ universeId, onBack }: UniverseDetailProps) {
    const { universeData, isLoading, addComplexGalaxy, isAddingGalaxy } = useUniverseDetails(universeId);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

    const [selectedStar, setSelectedStar] = useState<any | null>(null);

    const handleCommitGalaxy = (galaxyDef: GalaxyDef) => {
        addComplexGalaxy(galaxyDef, universeId, () => {
            setIsBuilderOpen(false);
        });
    };

    if (isLoading) return <Text className="glow-text">Loading Details...</Text>;
    if (!universeData) return <Text color="red">Universe not found.</Text>;

    return (
        <Box style={{ width: "100%", maxWidth: "800px", marginTop: "2rem" }}>
            <Button variant="ghost" onClick={onBack} style={{ marginBottom: "1rem", color: "var(--sui-primary)" }}>
                &larr; Back to Universes
            </Button>


            {isBuilderOpen ? (
                <GalaxyBuilder
                    onCommit={handleCommitGalaxy}
                    isPending={isAddingGalaxy}
                    onCancel={() => setIsBuilderOpen(false)}
                />
            ) : (
                <Card className="universe-card" style={{ padding: "1.5rem" }}>
                    <Flex direction="column" gap="4">
                        <Box>
                            <Flex justify="between" align="center">
                                <Box>
                                    <Heading size="6" className="glow-text">Universe Details</Heading>
                                    <Text size="2" color="gray">ID: {universeId.slice(0, 10)}...</Text>
                                </Box>
                                <Button onClick={() => setIsBuilderOpen(true)} className="create-universe-btn">
                                    + New Galaxy System
                                </Button>
                            </Flex>
                        </Box>

                        <Box>
                            <Heading size="4" mb="3" style={{ color: "white" }}>Galaxies</Heading>
                            {universeData.galaxies && universeData.galaxies.length > 0 ? (
                                <Grid columns="2" gap="3">
                                    {universeData.galaxies.map((galaxy, index) => (
                                        <Card key={index} style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <Text weight="bold" size="3" style={{ color: 'var(--cyber-cyan)', display: 'block' }}>{galaxy.name}</Text>
                                            <Text size="1" color="gray" mb="2">
                                                Contains {galaxy.stars?.length || 0} Stars
                                            </Text>

                                            <Flex gap="2" wrap="wrap">
                                                {galaxy.stars?.map((star: any, sIdx: number) => (
                                                    <Button
                                                        key={sIdx}
                                                        variant="soft"
                                                        color="cyan"
                                                        size="1"
                                                        style={{ cursor: 'pointer', background: 'rgba(6, 182, 212, 0.1)' }}
                                                        onClick={() => setSelectedStar(star)}
                                                    >
                                                        ★ {star.name || "Star"}
                                                        <MagnifyingGlassIcon style={{ marginLeft: '4px' }} />
                                                    </Button>
                                                ))}
                                            </Flex>
                                        </Card>
                                    ))}
                                </Grid>
                            ) : (
                                <Text color="gray" style={{ fontStyle: 'italic' }}>No galaxies found. Create one above!</Text>
                            )}
                        </Box>
                    </Flex>
                </Card>
            )}

            <Dialog.Root open={!!selectedStar} onOpenChange={(open) => !open && setSelectedStar(null)}>
                <Dialog.Content style={{ maxWidth: 450, background: '#1e293b' }}>
                    <Dialog.Title className="glow-text">Star System: {selectedStar?.name}</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Orbit ID: {selectedStar?.orbit} • Status: {selectedStar?.alive ? "Alive" : "Dead"}
                    </Dialog.Description>

                    <Heading size="3" mb="2" color="cyan">Planets</Heading>

                    <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
                        {selectedStar?.planets && selectedStar.planets.length > 0 ? (
                            <Flex direction="column" gap="2" className="planet-list-container">
                                {selectedStar.planets.map((planet: any, idx: number) => (
                                    <Card key={idx} variant="surface" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <Flex justify="between" align="center">
                                            <Flex align="center" gap="2">
                                                <Text size="5">🪐</Text>
                                                <Box>
                                                    <Text weight="bold" style={{ color: 'white' }}>{planet.name}</Text>
                                                    <Text as="div" size="1" color="gray">Orbit {planet.orbit}</Text>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                ))}
                            </Flex>
                        ) : (
                            <Text color="gray" style={{ fontStyle: 'italic', display: 'block', padding: '10px', textAlign: 'center' }}>
                                No planets orbiting this star.
                            </Text>
                        )}
                    </ScrollArea>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={() => setSelectedStar(null)}>Close</Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Box>
    );
}

