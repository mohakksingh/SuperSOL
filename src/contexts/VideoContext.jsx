import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');

  return (
    <VideoContext.Provider value={{ videoUrl, setVideoUrl, creatorAddress, setCreatorAddress }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);