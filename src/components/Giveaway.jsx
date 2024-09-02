import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const Giveaway = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [winners, setWinners] = useState([]);

  const handleGiveaway = async () => {
    if (!publicKey) return;

    const connection = new Connection("https://api.mainnet-beta.solana.com");
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
        alert(`Failed to send giveaway to ${winner}. Please try again.`);
      }
    }

    alert('Giveaway completed successfully!');
    setAmount('');
    setWinners([]);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-10">
      <h2 className="text-2xl mb-4">Start Giveaway</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Total giveaway amount in SOL"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <textarea
        value={winners.join('\n')}
        onChange={(e) => setWinners(e.target.value.split('\n'))}
        placeholder="Enter winner wallet addresses (one per line)"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <button
        onClick={handleGiveaway}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Start Giveaway
      </button>
    </div>
  );
};

export default Giveaway;