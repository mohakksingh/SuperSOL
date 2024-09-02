import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const Superchat = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');

  const handleSuperchat = async () => {
    if (!publicKey) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet first.',
      });
      return;
    }

    if (!creatorAddress) {
      toast({
        variant: 'destructive',
        title: 'Creator address not provided',
        description: 'Please enter the creator\'s wallet address.',
      });
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(creatorAddress),
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
      setCreatorAddress('');

      // Here you would typically send the message to your backend
      console.log('Superchat message:', message);
    } catch (error) {
      console.error('Error sending superchat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send Superchat. Please try again.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 bg-gray-800 p-6 rounded-lg mb-8"
    >
      <h2 className="text-2xl text-white mb-4">Send Superchat</h2>
      <Input
        type="text"
        value={creatorAddress}
        onChange={(e) => setCreatorAddress(e.target.value)}
        placeholder="Creator's Wallet Address"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in SOL"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <Button onClick={handleSuperchat} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Send Superchat
      </Button>
    </motion.div>
  );
};

export default Superchat;