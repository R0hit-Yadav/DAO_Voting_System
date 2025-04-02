import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./WalletContext";
import { ethers } from "ethers";

function CreateProposal() {
    const { account, signer } = useWallet();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        setSubmitting(true);
        
        try {
            // Get the contract ABI and address from the backend
            const response = await fetch("http://localhost:3030/contract-info");
            const { abi, address } = await response.json();

            // Create contract instance
            const contract = new ethers.Contract(address, abi, signer);

            // Send transaction through MetaMask
            const tx = await contract.createProposal(title, description, duration);
            await tx.wait();

            alert("Proposal created successfully! Transaction Hash: " + tx.hash);
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
                <button type="submit" disabled={submitting || !account}>
                    {!account ? "Connect Wallet to Create" : submitting ? "Creating..." : "Create Proposal"}
                </button>
            </form>
        </div>
    );
}

export default CreateProposal;