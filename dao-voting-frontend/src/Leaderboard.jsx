import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Leaderboard() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3030/proposals")
            .then((res) => res.json())
            .then((data) => {
                // Sort proposals by votes_for in descending order
                const sortedProposals = [...data].sort((a, b) => b.votes_for - a.votes_for);
                setProposals(sortedProposals);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard">
            <h1>Proposal Leaderboard</h1>
            <h2>Sorted by Votes For</h2>
            
            {proposals.length === 0 ? (
                <p>No proposals found.</p>
            ) : (
                <div className="leaderboard-list">
                    {proposals.map((proposal, index) => (
                        <div className="leaderboard-item" key={proposal.id}>
                            <div className="rank">#{index + 1}</div>
                            <div className="proposal-info">
                                <h3>{proposal.title}</h3>
                                <p>{proposal.description}</p>
                            </div>
                            <div className="vote-stats">
                                <div className="votes-for">
                                    <span className="label">Votes For:</span>
                                    <span className="value">{proposal.votes_for}</span>
                                </div>
                                <div className="votes-against">
                                    <span className="label">Votes Against:</span>
                                    <span className="value">{proposal.votes_against}</span>
                                </div>
                            </div>
                            <div className="proposal-links">
                                <Link to={`/proposal/${proposal.id}`}>View Details</Link>
                                <Link to={`/vote/${proposal.id}`}>Vote</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard; 