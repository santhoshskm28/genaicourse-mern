import React, { useRef, useEffect } from 'react';
import type { Lecture, VideoState } from '../types';

interface MainContentAreaProps {
  lecture: Lecture;
  videoState: VideoState;
  onVideoStateChange: (state: Partial<VideoState>) => void;
  onLectureComplete: (lectureId: string) => void;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({
  lecture,
  videoState,
  onVideoStateChange,
  onLectureComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onVideoStateChange({ currentTime: video.currentTime });
    };

    const handleLoadedMetadata = () => {
      onVideoStateChange({ duration: video.duration });
    };

    const handleEnded = () => {
      onVideoStateChange({ isPlaying: false });
      onLectureComplete(lecture.id);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lecture.id, onVideoStateChange, onLectureComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoState.isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoState.isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = videoState.volume;
  }, [videoState.volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = videoState.playbackRate;
  }, [videoState.playbackRate]);

  return (
    <main className="flex-1 bg-black flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          src={lecture.videoUrl}
          className="w-full h-full object-contain"
          preload="metadata"
        />
        
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <span className="text-sm">{lecture.title}</span>
        </div>
      </div>
    </main>
  );
};

export default MainContentArea;