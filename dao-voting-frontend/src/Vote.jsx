import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function Vote() {
    const { id } = useParams();
    const [support, setSupport] = useState(true);
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3030/proposal/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProposal(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleVote = async () => {
        setSubmitting(true);
        try {
            const response = await fetch("http://localhost:3030/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposal_id: parseInt(id), support })
            });
            const data = await response.json();
            alert(`Vote submitted successfully! Transaction Hash: ${data}`);
            // Refresh proposal data after voting
            const updatedProposal = await fetch(`http://localhost:3030/proposal/${id}`).then(res => res.json());
            setProposal(updatedProposal);
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert("Failed to submit vote. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading proposal information...</div>;
    }

    if (!proposal) {
        return <div className="loading">Proposal not found</div>;
    }

    // Check if voting is still allowed
    const now = new Date();
    const deadline = new Date(proposal.deadline);
    const votingClosed = now > deadline || proposal.executed;

    return (
        <div className="proposal-details">
            <h1>Vote on Proposal: {proposal.title}</h1>
            
            {votingClosed ? (
                <div className="status status-ended">Voting has ended for this proposal</div>
            ) : (
                <>
                    <p>Select your vote and submit:</p>
                    
                    <div className="vote-buttons">
                        <button 
                            className={`vote-for ${support ? 'active' : ''}`} 
                            onClick={() => setSupport(true)}
                        >
                            Vote For
                        </button>
                        <button 
                            className={`vote-against ${!support ? 'active' : ''}`} 
                            onClick={() => setSupport(false)}
                        >
                            Vote Against
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleVote} 
                        disabled={submitting || votingClosed}
                    >
                        {submitting ? "Submitting..." : "Submit Vote"}
                    </button>
                </>
            )}
            
            <div className="proposal-stats">
                <div className="stat-item">
                    <div className="stat-value">{proposal.votes_for}</div>
                    <div className="stat-label">Votes For</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-value">{proposal.votes_against}</div>
                    <div className="stat-label">Votes Against</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-value">{proposal.deadline}</div>
                    <div className="stat-label">Deadline</div>
                </div>
            </div>
            
            <div className="proposal-links">
                <Link to={`/proposal/${proposal.id}`}>View Proposal Details</Link>
                <Link to="/">Back to all proposals</Link>
            </div>
        </div>
    );
}

export default Vote;