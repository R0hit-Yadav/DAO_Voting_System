import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProposal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await fetch("http://localhost:3030/create_proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, duration: parseInt(duration) })
            });
            const data = await response.json();
            alert("Proposal created successfully! Transaction Hash: " + data);
            navigate('/');
        } catch (error) {
            console.error("Error creating proposal:", error);
            alert("Failed to create proposal. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create Proposal</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <textarea 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        placeholder="Duration (seconds)" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Proposal"}
                </button>
            </form>
        </div>
    );
}

export default CreateProposal;