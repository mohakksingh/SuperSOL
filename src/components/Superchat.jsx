import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { FaCoins, FaPaperPlane, FaUser } from 'react-icons/fa';

const Superchat = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const { creatorAddress } = useVideo();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSuperchat = async () => {
    if (!publicKey || !creatorAddress) return;
    setSending(true);
    try {
      const recipientPubkey = new PublicKey(creatorAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      toast({
        title: 'Superchat sent',
        description: 'Your Superchat was sent successfully!',
      });
      setAmount('');
      setMessage('');
    } catch (error) {
      console.error('Error sending superchat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send Superchat. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-900 to-cyan-800 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <FaCoins className="mr-2 text-yellow-500" /> Send Superchat
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">Creator's Address:</label>
        <Input
          type="text"
          value={creatorAddress || 'No creator address found'}
          readOnly
          className="w-full p-3 bg-gray-700 rounded-lg text-white"
        />
      </div>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in SOL"
        className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"
      />
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white resize-none"
        rows={4}
      />
      <Button
        onClick={handleSuperchat}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        disabled={!publicKey || !creatorAddress || sending}
      >
        {sending ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
        ) : (
          <FaPaperPlane className="mr-2" />
        )}
        {sending ? 'Sending...' : 'Send Superchat'}
      </Button>
    </motion.div>
  );
};

export default Superchat;