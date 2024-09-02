import React, { useState } from 'react';
import YouTube from 'react-youtube';

const LiveStream = () => {
  const [videoId, setVideoId] = useState('');

  const handleInputChange = (e) => {
    setVideoId(e.target.value);
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        value={videoId}
        onChange={handleInputChange}
        placeholder="Enter YouTube Video ID"
        className="w-full p-2 mb-4 bg-gray-800 rounded"
      />
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={{
            height: '390',
            width: '640',
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      )}
    </div>
  );
};

export default LiveStream;