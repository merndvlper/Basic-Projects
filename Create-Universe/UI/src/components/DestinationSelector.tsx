import { Dialog, Button, Flex, Text, Card, RadioGroup, ScrollArea, Box } from "@radix-ui/themes";
import { useState } from "react";
import { useUniverses } from "../hooks/useUniverses";

interface DestinationSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (destination: "new" | string) => void;
    isPending: boolean;
}

export function DestinationSelector({ open, onOpenChange, onConfirm, isPending }: DestinationSelectorProps) {
    const { universes, isLoading } = useUniverses();
    const [selection, setSelection] = useState<string>("new");

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content style={{ maxWidth: 450, background: '#1e293b' }}>
                <Dialog.Title className="glow-text">Select Destination</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Where should we launch this new Galaxy?
                </Dialog.Description>

                <RadioGroup.Root value={selection} onValueChange={setSelection}>
                    <Flex direction="column" gap="2">


                        <label style={{ cursor: 'pointer' }}>
                            <Card variant="surface" style={{ background: selection === 'new' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.05)', border: selection === 'new' ? '1px solid var(--cyber-cyan)' : '1px solid transparent' }}>
                                <Flex gap="2" align="center">
                                    <RadioGroup.Item value="new" />
                                    <Box>
                                        <Text weight="bold" style={{ color: 'white' }}>Create New Universe</Text>
                                        <Text as="div" size="1" color="gray">Deploy a brand new Universe container.</Text>
                                    </Box>
                                </Flex>
                            </Card>
                        </label>

                        <Text size="2" mt="2" mb="1" color="gray">OR Select Existing Universe:</Text>


                        <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
                            {isLoading ? (
                                <Text size="1">Loading universes...</Text>
                            ) : universes.length === 0 ? (
                                <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>No existing universes found.</Text>
                            ) : (
                                <Flex direction="column" gap="2">
                                    {universes.map(id => (
                                        <label key={id} style={{ cursor: 'pointer' }}>
                                            <Card variant="surface" style={{ padding: '0.5rem', background: selection === id ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.05)', border: selection === id ? '1px solid var(--cyber-cyan)' : '1px solid transparent' }}>
                                                <Flex gap="2" align="center">
                                                    <RadioGroup.Item value={id} />
                                                    <Box>
                                                        <Text size="2" style={{ color: '#e2faff' }}>Universe {id.slice(0, 6)}...{id.slice(-4)}</Text>
                                                    </Box>
                                                </Flex>
                                            </Card>
                                        </label>
                                    ))}
                                </Flex>
                            )}
                        </ScrollArea>

                    </Flex>
                </RadioGroup.Root>

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={() => onConfirm(selection)} disabled={isPending} className="create-universe-btn">
                        {isPending ? "Launching..." : "Launch Galaxy 🚀"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
