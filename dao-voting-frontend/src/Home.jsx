import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3030/proposals")
            .then((res) => res.json())
            .then((data) => {
                setProposals(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Loading proposals...</div>;
    }

    return (
        <div>
            <h1>DAO Voting System </h1>
            <h2>All Proposals</h2>
            
            {proposals.length === 0 ? (
                <p>No proposals found. Create a new one!</p>
            ) : (
                proposals.map((proposal) => (
                    <div className="proposal-card" key={proposal.id}>
                        <h2>{proposal.title}</h2>
                        <p>{proposal.description}</p>
                        
                        <div className="proposal-links">
                            <Link to={`/proposal/${proposal.id}`}>View Details</Link>
                            <Link to={`/vote/${proposal.id}`}>Vote</Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;