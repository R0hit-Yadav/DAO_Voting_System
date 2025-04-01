import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import CreateProposal from "./CreateProposal";
import ProposalDetails from "./ProposalDetails";
import Vote from "./Vote";

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/create">Create Proposal</Link></li>
                </ul>
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
    );
}

export default App;