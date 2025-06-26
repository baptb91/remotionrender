import React from 'react';
import { Composition } from 'remotion';
import { ShortsVideo } from './ShortsVideo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ShortsVideo"
        component={ShortsVideo}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          beats: [1, 2, 3, 4, 5],
          audioUrl: '',
          audioDuration: 10
        }}
      />
    </>
  );
};