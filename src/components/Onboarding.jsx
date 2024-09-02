import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaYoutube, FaGift, FaCoins, FaRocket } from 'react-icons/fa';

const steps = [
  {
    title: "Welcome to SuperSOL",
    description: "SuperSOL takes your Superchat experience to the next level using Solana blockchain technology. Fast, secure, and decentralized support for your favourite creators!",
    icon: <FaRocket className="text-5xl mb-4 text-blue-500" />,
  },
  {
    title: "Connect Your Wallet",
    description: "Link your Solana wallet to send and receive SOL. We support Phantom,Backpack and other popular wallets for seamless transactions.",
    icon: <FaWallet className="text-4xl mb-4 text-purple-500" />,
  },
  {
    title: "Enter YouTube Stream",
    description: "Paste the URL of any YouTube live stream. SuperSOL will automatically extract the creator's wallet address from the video description, making it easy to support them.",
    icon: <FaYoutube className="text-4xl mb-4 text-red-500" />,
  },
  {
    title: "Send Superchat with SuperSOL",
    description: "Support creators by sending SOL directly to their wallet. Add a personalized message to make your support stand out! With SuperSOL, transactions are faster and cheaper than traditional Superchats.",
    icon: <FaCoins className="text-4xl mb-4 text-yellow-500" />,
  },
  {
    title: "Exclusive Perks with SuperSOL",
    description: "Participate in creator-hosted giveaways, including SOL and NFT drops. Your chances increase with your support! SuperSOL also enables creators to offer exclusive content and perks to their supporters.",
    icon: <FaGift className="text-4xl mb-4 text-green-500" />,
  },
];

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">SuperSOL</h1>
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-1/5 h-2 rounded ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {steps[currentStep].icon}
            <h2 className="text-3xl font-semibold text-white mb-4">{steps[currentStep].title}</h2>
            <p className="text-gray-300 mb-8 text-lg">{steps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            className={`px-6 py-3 rounded-full text-lg ${
              currentStep === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300'
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 text-lg"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;