import { useUniverses } from "../hooks/useUniverses";
import { Card, Flex, Text, Box, ScrollArea, Button } from "@radix-ui/themes";

interface UniverseListProps {
    onSelect: (id: string) => void;
}

export function UniverseList({ onSelect }: UniverseListProps) {
    const { universes, isLoading } = useUniverses();

    if (isLoading) {
        return <Text className="glow-text">Loading Universes...</Text>;
    }

    if (universes.length === 0) {
        return (
            <Text className="instruction-text" size="2">
                No universes found. Create one to get started!
            </Text>
        );
    }

    return (
        <Box style={{ width: "100%", maxWidth: "320px", marginTop: "1.5rem", marginLeft: "auto", marginRight: "auto" }}>
            <Text size="4" mb="2" className="glow-text" style={{ display: 'block', textAlign: 'center' }}>
                My Universes
            </Text>
            <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 250 }}>
                <Flex direction="column" gap="2">
                    {universes.map((id) => (
                        <Card key={id} className="universe-card" style={{ padding: "0.5rem" }}>
                            <Flex align="center" justify="between">
                                <Box>
                                    <Text size="2" weight="bold" style={{ color: "var(--sui-primary)" }}>
                                        Universe
                                    </Text>
                                    <Text as="div" size="1" color="gray">
                                        {id.slice(0, 6)}...{id.slice(-4)}
                                    </Text>
                                </Box>
                                <Button size="1" variant="soft" onClick={() => onSelect(id)}>Enter</Button>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </ScrollArea>
        </Box>
    );
}
