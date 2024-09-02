import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to Solana YouTube Superchat",
      content: "This app allows you to support your favorite YouTubers using Solana."
    },
    {
      title: "Connect Your Wallet",
      content: "Click the 'Connect Wallet' button in the top right to get started."
    },
    {
      title: "Send Superchat",
      content: "Enter the amount and your message, then click 'Send Superchat' to support the creator."
    },
    {
      title: "Join Giveaways",
      content: "Creators can host giveaways. Make sure your wallet is connected to participate!"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md">
        <h2 className="text-2xl mb-4">{steps[step].title}</h2>
        <p className="mb-6">{steps[step].content}</p>
        <button
          onClick={nextStep}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {step < steps.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;