import { useCreateUniverse } from "../hooks/useCreateUniverse";
import { Box, Button, Text } from "@radix-ui/themes";

export function CreateUniverse() {
    const { createUniverse, isPending } = useCreateUniverse();

    return (
        <Box className="create-universe-container" style={{ marginTop: "0" }}>
            <Text as="p" size="2" mb="3" className="instruction-text">
                Start your journey by creating a new Universe.
            </Text>

            <Button
                size="3"
                onClick={() => createUniverse(() => alert("Universe Created Successfully!"))}
                disabled={isPending}
                className="create-universe-btn"
                style={{ cursor: isPending ? 'not-allowed' : 'pointer' }}
            >
                {isPending ? "Creating..." : "Create Universe"}
            </Button>
        </Box>
    );
}
