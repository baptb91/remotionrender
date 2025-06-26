import React from 'react';
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

export const ShortsVideo = ({ beats, audioUrl, audioDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Convert frame to seconds
  const timeInSeconds = frame / fps;
  
  // Calculate which beat we're closest to
  const getCurrentBeat = () => {
    let closestBeat = -1;
    let minDistance = Infinity;
    
    beats.forEach((beatTime, index) => {
      const distance = Math.abs(timeInSeconds - beatTime);
      if (distance < minDistance) {
        minDistance = distance;
        closestBeat = index;
      }
    });
    
    return closestBeat;
  };
  
  const currentBeat = getCurrentBeat();
  
  // Check if we're near a beat (within 0.2 seconds)
  const isNearBeat = beats.some(beatTime => 
    Math.abs(timeInSeconds - beatTime) < 0.2
  );
  
  // Animation for beat visualization
  const beatScale = isNearBeat ? 
    interpolate(
      timeInSeconds % 1,
      [0, 0.1, 0.2],
      [1, 1.5, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.elastic(1.5)
      }
    ) : 1;
  
  // Background color animation
  const backgroundColor = isNearBeat ? '#FF6B6B' : '#4ECDC4';
  
  // Progress bar
  const progress = Math.min(timeInSeconds / audioDuration, 1);
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(45deg, ${backgroundColor}, #45B7D1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Audio */}
      {audioUrl && (
        <Audio
          src={audioUrl}
          startFrom={0}
          endAt={audioDuration * fps}
        />
      )}
      
      {/* Beat Visualization */}
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${beatScale})`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          BEAT {currentBeat + 1}
        </div>
      </div>
      
      {/* Beat Counter */}
      <div
        style={{
          fontSize: 32,
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: 40,
        }}
      >
        {beats.length} BEATS DETECTED
      </div>
      
      {/* Progress Bar */}
      <div
        style={{
          width: '80%',
          height: 8,
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 100,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: 'white',
            transition: 'width 0.1s ease',
          }}
        />
      </div>
      
      {/* Time Display */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      >
        {Math.floor(timeInSeconds)}s / {Math.floor(audioDuration)}s
      </div>
      
      {/* Beat Indicators */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        {beats.map((beatTime, index) => (
          <div
            key={index}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: index === currentBeat ? '#FFD93D' : 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: index === currentBeat ? '#333' : 'white',
              transform: index === currentBeat ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};