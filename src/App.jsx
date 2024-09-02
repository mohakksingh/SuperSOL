import React, { useState, useEffect } from 'react';
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
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
import Auth from './components/Auth';
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
  const { publicKey, connect, connected } = useWallet();
  const {connectionWallet}=useConnection();
  const [publicKeys,setPublicKeys]=useState(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      setPublicKeys(publicKey ? publicKey.toString() : null);
      console.log(publicKey ? publicKey.toString() : 'No public key available');
    };
    fetchPublicKey();
  }, [publicKey]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user', { withCredentials: true });
        if (response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (publicKey) {
      console.log('Public Key:', publicKey.toString());
      handleWalletConnect(publicKey);
      fetchTransactions(publicKey);
    } else {
      console.log('Public Key is not available');
    }
  }, [publicKey]);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/wallet/creator', { withCredentials: true });
        setWalletAddress(response.data.walletAddress);
      } catch (error) {
        console.error('Error fetching creator wallet:', error);
      }
    };

    if (isAuthenticated) {
      fetchWalletAddress();
    }
  }, [isAuthenticated]);

  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];

  const handleWalletConnect = async (publicKey) => {
    try {
      await axios.post('http://localhost:5001/api/wallet/connect', { walletAddress: publicKey.toString() }, { withCredentials: true });
      console.log('Wallet connected successfully');
      setWalletAddress(publicKey.toString()); // Update the wallet address state
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchTransactions = async (publicKey) => {
    try {
      const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(publicKey));
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
      await axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      setWalletAddress(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
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
                      <TransactionHistory />
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
  );
}

export default App;