import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, useAddress, useMetamask, useDisconnect } from '@thirdweb-dev/react';
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import LiveStream from './components/LiveStream';
import Superchat from './components/Superchat';
import Onboarding from './components/Onboarding';
import Giveaway from './components/Giveaway';
import NFTGiveaway from './components/NFTGiveaway';
import TransactionHistory from './components/TransactionHistory';
import WalletBalance from './components/WalletBalance';
import WalletConnect from './components/WalletConnect';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (address) {
      console.log('Address:', address);
      handleWalletConnect(address);
      fetchTransactions(address);
    } else {
      console.log('Address is not available');
    }
  }, [address]);

  const handleWalletConnect = async (address) => {
    try {
      await axios.post('http://localhost:5001/api/wallet/connect', { walletAddress: address }, { withCredentials: true });
      console.log('Wallet connected successfully');
      setWalletAddress(address); // Update the wallet address state
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchTransactions = async (address) => {
    try {
      const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(address));
      const transactionDetails = await Promise.all(
        confirmedSignatures.map(async (signatureInfo) => {
          const transaction = await connection.getConfirmedTransaction(signatureInfo.signature);
          return transaction;
        })
      );
      setTransactions(transactionDetails);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://supersol-backend.onrender.com/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      setWalletAddress(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];

  return (
    <ThirdwebProvider activeChain="mainnet">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="container mx-auto px-4 py-8">
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Solana YouTube Superchat</h1>
                <div className="flex items-center space-x-4">
                  <WalletMultiButton />
                  {isAuthenticated && (
                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                      Logout
                    </Button>
                  )}
                  <Button onClick={() => console.log('Address:', address ? address : 'Not connected')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Log Address
                  </Button>
                </div>
              </header>
              <main>
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {!onboardingComplete && (
                      <Onboarding onComplete={() => setOnboardingComplete(true)} />
                    )}
                    {onboardingComplete && (
                      <>
                        <p className="text-white">Welcome, {user.username}!</p>
                        <WalletBalance />
                        <WalletConnect />
                        <LiveStream />
                        <Superchat />
                        <Giveaway />
                        <NFTGiveaway />
                        <TransactionHistory transactions={transactions} />
                      </>
                    )}
                  </motion.div>
                ) : (
                  <Auth />
                )}
              </main>
            </div>
            <Toaster position="bottom-right" />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThirdwebProvider>
  );
}

export default App;