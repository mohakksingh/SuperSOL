import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUser, FaSpinner, FaComments, FaGift } from 'react-icons/fa';
import { PublicKey } from '@solana/web3.js';

const YOUTUBE_API_KEY = `${import.meta.env.VITE_YOUTUBE_API_KEY}`;

const LiveChat = ({ videoId, onParticipantsUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [winner, setWinner] = useState(null);
  const chatContainerRef = useRef(null);

  const isValidSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const extractSolanaAddress = (message) => {
    const words = message.split(/\s+/);
    for (const word of words) {
      if (isValidSolanaAddress(word)) {
        return word;
      }
    }
    return null;
  };

  useEffect(() => {
    let intervalId;
    const fetchLiveChatMessages = async () => {
      try {
        const liveStreamResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'liveStreamingDetails',
            id: videoId,
            key: YOUTUBE_API_KEY,
          },
        });

        const liveChatId = liveStreamResponse.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
        if (liveChatId) {
          const chatResponse = await axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages`, {
            params: {
              liveChatId: liveChatId,
              part: 'snippet,authorDetails',
              key: YOUTUBE_API_KEY,
            },
          });

          const newMessages = chatResponse.data.items.filter(item => {
            const solanaAddress = extractSolanaAddress(item.snippet.displayMessage);
            return solanaAddress && !messages.some(msg => msg.id === item.id);
          });

          setMessages(prevMessages => [...prevMessages, ...newMessages].slice(-50));
          
          const newParticipants = newMessages.map(msg => ({
            address: extractSolanaAddress(msg.snippet.displayMessage),
            name: msg.authorDetails.displayName,
          }));

          setParticipants(prevParticipants => {
            const updatedParticipants = [...prevParticipants, ...newParticipants];
            const uniqueParticipants = updatedParticipants.filter((participant, index, self) =>
              index === self.findIndex((t) => t.address === participant.address)
            );
            onParticipantsUpdate(uniqueParticipants);
            return uniqueParticipants;
          });

          setLoading(false);
        } else {
          setError('No active live chat found for this video');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching live chat messages:', error);
        setError('Failed to fetch live chat messages');
        setLoading(false);
      }
    };

    fetchLiveChatMessages();
    intervalId = setInterval(fetchLiveChatMessages, 5000); // Fetch messages every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [videoId, onParticipantsUpdate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const selectWinner = () => {
    if (participants.length > 0) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinner(participants[randomIndex]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-800 rounded-lg p-4">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-white text-lg">Loading live chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg h-full flex items-center justify-center">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaComments className="mr-2 text-blue-500" />
          Live Chat
        </div>
        <button
          onClick={selectWinner}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaGift className="mr-2" />
          Select Winner
        </button>
      </h3>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-2 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-gray-700 rounded-lg p-3 flex items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              {message.authorDetails.profileImageUrl ? (
                <img
                  src={message.authorDetails.profileImageUrl}
                  alt={message.authorDetails.displayName}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-semibold text-blue-300 mb-1">
                {message.authorDetails.displayName}
              </p>
              <p className="text-sm text-white break-words">{message.snippet.displayMessage}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-2 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          {participants.length} participants • {messages.length} eligible messages
        </p>
      </div>
      {winner && (
        <div className="mt-4 bg-green-500 text-white p-4 rounded-lg">
          <h4 className="text-lg font-bold mb-2">Giveaway Winner:</h4>
          <p>{winner.name}</p>
          <p className="text-sm">{winner.address}</p>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
