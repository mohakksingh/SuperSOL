import React, { useState, useEffect, useMemo } from 'react';
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';
import LiveStream from './components/LiveStream';
import Superchat from './components/Superchat';
import Onboarding from './components/Onboarding';
import Giveaway from './components/Giveaway';
import NFTGiveaway from './components/NFTGiveaway';
import TransactionHistory from './components/TransactionHistory';
import WalletBalance from './components/WalletBalance';
import WalletConnect from './components/WalletConnect';
import { VideoProvider } from './contexts/VideoContext';
import { FaRocket } from 'react-icons/fa';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([]);

  const network = 'devnet';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  useEffect(() => {
    if (publicKey) {
      console.log('Public Key:', publicKey.toString());
      fetchTransactions(publicKey);
    } else {
      console.log('Public Key is not available');
    }
  }, [publicKey, connection]);

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

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <VideoProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
              <AnimatePresence>
                {!onboardingComplete ? (
                  <Onboarding key="onboarding" onComplete={() => setOnboardingComplete(true)} />
                ) : (
                  <motion.div
                    key="main-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto px-4 py-8"
                  >
                    <header className="flex justify-between items-center mb-8">
                      <h1 className="text-4xl font-bold text-white flex items-center">
                        <FaRocket className="mr-2 text-blue-500" />
                        SuperSOL
                      </h1>
                      <WalletMultiButton />
                    </header>
                    <main className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <WalletBalance />
                        <WalletConnect />
                      </div>
                      <LiveStream />
                      <Superchat />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Giveaway />
                        <NFTGiveaway />
                      </div>
                      <TransactionHistory transactions={transactions} />
                    </main>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Toaster position="bottom-right" />
          </VideoProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;