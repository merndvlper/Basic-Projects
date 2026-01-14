import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import "./SpaceTheme.css";

function App() {
  const account = useCurrentAccount();

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
          ) : (
            <>
              <h1 className="glow-text">Welcome SUI Space</h1>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;