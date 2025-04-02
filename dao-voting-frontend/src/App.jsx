import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WalletProvider, useWallet } from "./WalletContext";
import Home from "./Home";
import CreateProposal from "./CreateProposal";
import ProposalDetails from "./ProposalDetails";
import Vote from "./Vote";

function WalletButton() {
    const { account, connectWallet, disconnectWallet, error } = useWallet();
    
    return (
        <div className="wallet-section">
            {error && <div className="error">{error}</div>}
            {account ? (
                <div className="wallet-connected">
                    <span>Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
                    <button onClick={disconnectWallet} className="disconnect-wallet">
                        Disconnect
                    </button>
                </div>
            ) : (
                <button onClick={connectWallet} className="connect-wallet">
                    Connect Wallet
                </button>
            )}
        </div>
    );
}

function App() {
    return (
        <WalletProvider>
            <Router>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/create">Create Proposal</Link></li>
                    </ul>
                    <WalletButton />
                </nav>

                <main className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create" element={<CreateProposal />} />
                        <Route path="/proposal/:id" element={<ProposalDetails />} />
                        <Route path="/vote/:id" element={<Vote />} />
                    </Routes>
                </main>
            </Router>
        </WalletProvider>
    );
}

export default App;