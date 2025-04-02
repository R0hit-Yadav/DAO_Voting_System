import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask');
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();

            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    useEffect(() => {
        // Check if wallet is already connected
        if (window.ethereum) {
            const checkConnection = async () => {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        const signer = await provider.getSigner();
                        setProvider(provider);
                        setSigner(signer);
                        setAccount(accounts[0]);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            checkConnection();

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    setAccount(null);
                    setSigner(null);
                } else {
                    setAccount(accounts[0]);
                }
            });
        }
    }, []);

    return (
        <WalletContext.Provider value={{ account, provider, signer, error, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
} 