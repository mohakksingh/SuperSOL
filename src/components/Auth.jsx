import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Auth = () => {
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    window.location.href = 'https://supersol-backend.onrender.com/auth/google';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg mb-8"
    >
      <h2 className="text-2xl text-white mb-4">Creator Authentication</h2>
      <Button
        onClick={handleGoogleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </Button>
    </motion.div>
  );
};

export default Auth;