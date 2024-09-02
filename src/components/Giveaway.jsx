import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Giveaway = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [winners, setWinners] = useState([]);

  const handleGiveaway = async () => {
    if (!publicKey) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet first.',
      });
      return;
    }

    if (winners.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No winners provided',
        description: 'Please enter at least one winner wallet address.',
      });
      return;
    }

    const amountPerWinner = parseFloat(amount) / winners.length;

    for (const winner of winners) {
      try {
        const winnerWallet = new PublicKey(winner);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: winnerWallet,
            lamports: amountPerWinner * 1e9,
          })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');
      } catch (error) {
        console.error('Error sending giveaway to winner:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to send giveaway to ${winner}. Please try again.`,
        });
      }
    }

    toast({
      title: 'Giveaway completed',
      description: 'Giveaway completed successfully!',
    });
    setAmount('');
    setWinners([]);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-10">
      <h2 className="text-2xl mb-4">Start Giveaway</h2>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Total giveaway amount in SOL"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <Textarea
        value={winners.join('\n')}
        onChange={(e) => setWinners(e.target.value.split('\n'))}
        placeholder="Enter winner wallet addresses (one per line)"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <Button
        onClick={handleGiveaway}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Start Giveaway
      </Button>
    </div>
  );
};

export default Giveaway;