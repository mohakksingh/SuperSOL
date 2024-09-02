import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaCheckCircle, FaTimesCircle, FaCopy } from 'react-icons/fa';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching transactions...');
        const signatures = await connection.getSignaturesForAddress(publicKey);
        const transactionDetails = await Promise.all(
          signatures.slice(0, 10).map(async (signatureInfo) => {
            const transaction = await connection.getTransaction(signatureInfo.signature);
            return { ...transaction, signature: signatureInfo.signature };
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
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load transactions. Please try again.',
        });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey, connection, toast]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Transaction signature copied to clipboard.',
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg mb-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900 to-fuchsia-900 p-6 rounded-lg mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaHistory className="mr-3 text-purple-300" /> Transaction History
      </h2>
      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions yet.</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {transactions.map((transaction, index) => (
              <motion.li
                key={transaction.signature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Signature:</p>
                    <p className="text-gray-300 font-mono text-sm truncate w-64">
                      {transaction.signature}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(transaction.signature)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaCopy />
                  </button>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Slot: <span className="text-gray-200">{transaction.slot}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Block Time:{' '}
                    <span className="text-gray-200">
                      {new Date(transaction.blockTime * 1000).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm flex items-center">
                    {transaction.meta.err ? (
                      <FaTimesCircle className="text-red-400 mr-1" />
                    ) : (
                      <FaCheckCircle className="text-blue-400 mr-1" />
                    )}
                    {transaction.meta.err ? 'Failed' : 'Success'}
                  </p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default TransactionHistory;