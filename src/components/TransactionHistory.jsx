// src/components/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [publicKeys, setPublicKeys] = useState(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      setPublicKeys(publicKey ? publicKey.toString() : null);
      console.log(publicKey ? publicKey.toString() : 'No public key available');
    };
    fetchPublicKey();
  }, [publicKey]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKeys) {
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching transactions...');
        const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(publicKeys));
        const transactionDetails = await Promise.all(
          confirmedSignatures.map(async (signatureInfo) => {
            const transaction = await connection.getConfirmedTransaction(signatureInfo.signature);
            return transaction;
          })
        );
        setTransactions(transactionDetails);
        setLoading(false);
        toast({
          title: 'Transactions Loaded',
          description: 'Transaction history has been successfully loaded.',
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          backgroundColor: 'red',
          title: 'Result',
          description: 'No transactions found.',
        });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKeys, connection, toast]);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.transaction.signatures[0]} className="mb-4 p-4 bg-gray-700 rounded">
              <p><strong>Signature:</strong> {transaction.transaction.signatures[0]}</p>
              <p><strong>Slot:</strong> {transaction.slot}</p>
              <p><strong>Block Time:</strong> {new Date(transaction.blockTime * 1000).toLocaleString()}</p>
              <p><strong>Transaction Error:</strong> {transaction.meta.err ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;