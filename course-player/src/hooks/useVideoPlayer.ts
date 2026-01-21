import { useState } from 'react';
import type { VideoState } from '../types';

export const useVideoPlayer = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
  });

  const updateVideoState = (updates: Partial<VideoState>) => {
    setVideoState(prev => ({ ...prev, ...updates }));
  };

  const seekTo = (time: number) => {
    setVideoState(prev => ({ ...prev, currentTime: time }));
  };

  return {
    videoState,
    updateVideoState,
    seekTo,
  };
};