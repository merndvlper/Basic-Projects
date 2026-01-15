import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text, TextField, Dialog, IconButton, Grid } from "@radix-ui/themes";
import { GalaxyDef, StarDef, PlanetDef } from "../hooks/useUniverseDetails";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

interface GalaxyBuilderProps {
    onCommit: (galaxyDef: GalaxyDef) => void;
    isPending: boolean;
    onCancel: () => void;
}

export function GalaxyBuilder({ onCommit, isPending, onCancel }: GalaxyBuilderProps) {

    const [galaxyName, setGalaxyName] = useState("");
    const [stars, setStars] = useState<StarDef[]>([]);


    const [isStarModalOpen, setIsStarModalOpen] = useState(false);
    const [currentStar, setCurrentStar] = useState<Partial<StarDef>>({ name: "", orbit: 1, planets: [] });


    const [newPlanetName, setNewPlanetName] = useState("");
    const [newPlanetOrbit, setNewPlanetOrbit] = useState("1");

    const addPlanetToCurrentStar = () => {
        if (!newPlanetName) return;
        const planet: PlanetDef = { name: newPlanetName, orbit: parseInt(newPlanetOrbit) };
        setCurrentStar(prev => ({
            ...prev,
            planets: [...(prev.planets || []), planet]
        }));
        setNewPlanetName("");
        setNewPlanetOrbit(String((parseInt(newPlanetOrbit) % 15) + 1));
    };

    const removePlanetFromCurrentStar = (idx: number) => {
        setCurrentStar(prev => ({
            ...prev,
            planets: prev.planets?.filter((_, i) => i !== idx)
        }));
    };

    const saveStar = () => {
        if (!currentStar.name || !currentStar.orbit) return;
        setStars(prev => [...prev, currentStar as StarDef]);
        setIsStarModalOpen(false);
        setCurrentStar({ name: "", orbit: 1, planets: [] });
    };

    const removeStar = (idx: number) => {
        setStars(prev => prev.filter((_, i) => i !== idx));
    };


    const handleCommit = () => {
        if (!galaxyName) return;
        const galaxyDef: GalaxyDef = {
            name: galaxyName,
            stars: stars
        };
        onCommit(galaxyDef);
    };

    return (
        <Box>

            <Card className="universe-card" style={{ padding: "1.5rem", border: "1px solid var(--cyber-cyan)" }}>
                <Heading size="5" mb="4" className="glow-text">Galaxy Construction Kit</Heading>


                <Box mb="4">
                    <Text size="2" mb="1" color="gray">Galaxy Name</Text>
                    <TextField.Root
                        placeholder="e.g. Andromeda"
                        value={galaxyName}
                        onChange={e => setGalaxyName(e.target.value)}
                    />
                </Box>


                <Box mb="4">
                    <Flex justify="between" align="center" mb="2">
                        <Text size="3" weight="bold" style={{ color: "white" }}>Stars ({stars.length})</Text>
                        <Button size="1" onClick={() => setIsStarModalOpen(true)}>
                            <PlusIcon /> Add Star
                        </Button>
                    </Flex>

                    {stars.length === 0 ? (
                        <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>No stars yet. Add one to see it here.</Text>
                    ) : (
                        <Grid columns="2" gap="2">
                            {stars.map((star, idx) => (
                                <Card key={idx} variant="surface" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <Flex justify="between">
                                        <Box>
                                            <Text weight="bold" size="2" color="cyan">{star.name}</Text>
                                            <Text as="div" size="1" color="gray">Orbit {star.orbit} • {star.planets.length} Planets</Text>
                                        </Box>
                                        <IconButton size="1" color="red" variant="ghost" onClick={() => removeStar(idx)}>
                                            <TrashIcon />
                                        </IconButton>
                                    </Flex>
                                </Card>
                            ))}
                        </Grid>
                    )}
                </Box>


                <Flex gap="3" justify="end" mt="4">
                    <Button variant="soft" color="gray" onClick={onCancel} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleCommit} disabled={isPending || !galaxyName} className="create-universe-btn">
                        {isPending ? "launching..." : "Launch Galaxy"}
                    </Button>
                </Flex>
            </Card>


            <Dialog.Root open={isStarModalOpen} onOpenChange={setIsStarModalOpen}>
                <Dialog.Content style={{ maxWidth: 450, background: '#1e293b' }}>
                    <Dialog.Title>Design a Star System</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Add a star and its orbiting planets.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Box>
                            <Text size="1">Star Name</Text>
                            <TextField.Root
                                value={currentStar.name}
                                onChange={e => setCurrentStar(s => ({ ...s, name: e.target.value }))}
                                placeholder="e.g. Sun"
                            />
                        </Box>
                        <Box>
                            <Text size="1">Orbit ID (1-15)</Text>
                            <TextField.Root
                                type="number"
                                value={currentStar.orbit}
                                onChange={e => setCurrentStar(s => ({ ...s, orbit: parseInt(e.target.value) || 1 }))}
                            />
                        </Box>

                        <Box style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                            <Text size="2" weight="bold" mb="2">Planets</Text>
                            <Flex gap="2" mb="2">
                                <TextField.Root
                                    placeholder="Planet Name"
                                    value={newPlanetName}
                                    onChange={e => setNewPlanetName(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <TextField.Root
                                    placeholder="Orbit"
                                    value={newPlanetOrbit}
                                    onChange={e => setNewPlanetOrbit(e.target.value)}
                                    type="number"
                                    style={{ width: '60px' }}
                                />
                                <Button size="1" onClick={addPlanetToCurrentStar}>Add</Button>
                            </Flex>

                            <Flex direction="column" gap="1">
                                {currentStar.planets?.map((p, i) => (
                                    <Flex key={i} justify="between" align="center" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                                        <Text>🪐 {p.name} (Orbit {p.orbit})</Text>
                                        <IconButton size="1" variant="ghost" color="red" onClick={() => removePlanetFromCurrentStar(i)}>
                                            <TrashIcon width="12" height="12" />
                                        </IconButton>
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={() => setIsStarModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveStar} disabled={!currentStar.name}>Save Star System</Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Box>
    );
}
