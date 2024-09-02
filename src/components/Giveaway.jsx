import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FaCoins, FaUsers, FaSpinner } from 'react-icons/fa';

const Giveaway = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGiveaway = async () => {
    // ... (handleGiveaway function remains the same)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a237e] p-6 rounded-lg shadow-lg mb-10"
    >
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        <FaCoins className="mr-3 text-yellow-300" /> Start Giveaway
      </h2>
      <div className="space-y-4">
        <div className="relative">
          <FaCoins className="absolute top-3 left-3 text-blue-300" />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Total giveaway amount in SOL"
            className="w-full p-2 pl-8 bg-[#283593] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-none placeholder-blue-200"
          />
        </div>
        <div className="relative">
          <FaUsers className="absolute top-3 left-3 text-blue-300" />
          <Textarea
            value={winners.join('\n')}
            onChange={(e) => setWinners(e.target.value.split('\n'))}
            placeholder="Enter winner wallet addresses (one per line)"
            className="w-full p-2 pl-8 bg-[#283593] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-none placeholder-blue-200"
            rows={4}
          />
        </div>
        <Button
          onClick={handleGiveaway}
          disabled={loading}
          className="w-full bg-[#3949ab] hover:bg-[#303f9f] text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {loading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaCoins className="mr-2" />
          )}
          {loading ? 'Processing...' : 'Start Giveaway'}
        </Button>
      </div>
    </motion.div>
  );
};

export default Giveaway;