import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';

const WalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;

    const fetchBalance = async () => {
      try {
        const walletBalance = await connection.getBalance(publicKey);
        setBalance(walletBalance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900 to-indigo-800 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <FaWallet className="mr-2 text-green-400" /> Wallet Balance
      </h2>
      {balance !== null ? (
        <p className="text-3xl font-bold text-white">
          {balance.toFixed(4)} <span className="text-sm text-gray-300">SOL</span>
        </p>
      ) : (
        <p className="text-white">Loading balance...</p>
      )}
    </motion.div>
  );
};

export default WalletBalance;