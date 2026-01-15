import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

import { UniverseList } from "./components/UniverseList";
import { UniverseDetail } from "./components/UniverseDetail";
import { GalaxyBuilder } from "./components/GalaxyBuilder";
import { DestinationSelector } from "./components/DestinationSelector";
import { useState } from "react";
import { useUniverseDetails, GalaxyDef } from "./hooks/useUniverseDetails";
import { Button, Flex, Box } from "@radix-ui/themes";
import "./SpaceTheme.css";

function App() {
  const account = useCurrentAccount();
  const [selectedUniverseId, setSelectedUniverseId] = useState<string | null>(null);


  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [pendingGalaxyDef, setPendingGalaxyDef] = useState<GalaxyDef | null>(null);
  const [isDestinationSelectorOpen, setIsDestinationSelectorOpen] = useState(false);


  const { addComplexGalaxy, createUniverseAndAddGalaxy, isAddingGalaxy } = useUniverseDetails(null);

  const handleGalaxyCommit = (galaxyDef: GalaxyDef) => {
    setPendingGalaxyDef(galaxyDef);
    setIsDestinationSelectorOpen(true);
  };

  const handleDestinationConfirm = (destination: "new" | string) => {
    if (!pendingGalaxyDef) return;

    if (destination === "new") {
      createUniverseAndAddGalaxy(pendingGalaxyDef, () => {
        setIsDestinationSelectorOpen(false);
        setIsBuilderOpen(false);
        setPendingGalaxyDef(null);

      });
    } else {

      addComplexGalaxy(pendingGalaxyDef, destination, () => {
        setIsDestinationSelectorOpen(false);
        setIsBuilderOpen(false);
        setPendingGalaxyDef(null);
      });
    }
  };

  return (
    <div className="app-wrap">
      <div className="stars-overlay" />
      <nav className="nav-bar">
        <div className="brand-logo glow-text">
          Sui-Space
        </div>
        <div className="nav-actions">
          <ConnectButton />
        </div>
      </nav>

      <main className="main-content">
        <section className="space-card text-center">
          {!account ? (
            <>
              <h1 className="glow-text">Log in to the system.</h1>
              <p>Connect your wallet to access deep space data.</p>
            </>
          ) : selectedUniverseId ? (
            <UniverseDetail
              universeId={selectedUniverseId}
              onBack={() => setSelectedUniverseId(null)}
            />
          ) : isBuilderOpen ? (
            <GalaxyBuilder
              onCommit={handleGalaxyCommit}
              isPending={isAddingGalaxy}
              onCancel={() => { setIsBuilderOpen(false); setPendingGalaxyDef(null); }}
            />
          ) : (
            <>
              <h1 className="glow-text">Welcome SUI Space</h1>

              <Flex gap="3" justify="center" mt="4" mb="4">

              </Flex>

              <Box mb="6">
                <Button
                  size="4"
                  variant="classic"
                  className="create-universe-btn"
                  style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                  onClick={() => setIsBuilderOpen(true)}
                >
                  Design a Galaxy
                </Button>
                <p className="instruction-text" style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                  Start here: Design your galaxy system first, then deploy it to a Universe.
                </p>
              </Box>

              <UniverseList onSelect={(id) => setSelectedUniverseId(id)} />
            </>
          )}
        </section>
      </main>


      <DestinationSelector
        open={isDestinationSelectorOpen}
        onOpenChange={setIsDestinationSelectorOpen}
        onConfirm={handleDestinationConfirm}
        isPending={isAddingGalaxy}
      />
    </div>
  );
}

export default App;