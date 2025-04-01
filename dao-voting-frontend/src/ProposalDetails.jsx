import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProposalDetails() {
    const { id } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="loading">Loading proposal details...</div>;
    }

    if (!proposal) {
        return <div className="loading">Proposal not found</div>;
    }

    const parseDeadline = (deadlineStr) => {
      
        if (deadlineStr.includes("IST")) {
            
            return new Date(deadlineStr.replace("IST", "+05:30"));
        }
        return new Date(deadlineStr); 
    };

    // Determine proposal status
    const now = new Date();
    const deadline = parseDeadline(proposal.deadline);

    console.log(now);
    console.log(deadline);

    let statusClass = "status-active";
    let statusText = "Active";
    
    if (proposal.executed) {
        statusClass = "status-executed";
        statusText = "Executed";
    } else if (now > deadline) {
        statusClass = "status-ended";
        statusText = "Ended";
    }

    return (
        <div className="proposal-details">
            <h1>{proposal.title}</h1>
            
            <span className={`status ${statusClass}`}>{statusText}</span>
            
            <p>{proposal.description}</p>
            
            <div className="proposal-stats">
                <div className="stat-item">
                    <div className="stat-value">{(proposal.deadline)}</div>
                    <div className="stat-label">Deadline</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-value">{proposal.votes_for}</div>
                    <div className="stat-label">Votes For</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-value">{proposal.votes_against}</div>
                    <div className="stat-label">Votes Against</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-value">{proposal.executed ? "Yes" : "No"}</div>
                    <div className="stat-label">Executed</div>
                </div>
            </div>
            
            <div className="proposal-links">
                <Link to={`/vote/${proposal.id}`}>Vote on this proposal</Link>
                <Link to="/">Back to all proposals</Link>
            </div>
        </div>
    );
}

export default ProposalDetails;