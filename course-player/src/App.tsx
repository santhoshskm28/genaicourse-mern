import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContentArea from './components/MainContentArea';
import BottomControls from './components/BottomControls';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import type { Lecture } from './types';

const mockLectures: Lecture[] = [
  {
    id: '1',
    title: 'Introduction to React',
    duration: 1200,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    completed: false,
  },
  {
    id: '2',
    title: 'Components and Props',
    duration: 1800,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    completed: false,
  },
  {
    id: '3',
    title: 'State and Lifecycle',
    duration: 2400,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    completed: false,
  },
  {
    id: '4',
    title: 'Hooks Deep Dive',
    duration: 2100,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    completed: false,
  },
];

function App() {
  const [currentLectureId, setCurrentLectureId] = useState<string>(mockLectures[0].id);
  const [lectures, setLectures] = useState<Lecture[]>(mockLectures);
  const { videoState, updateVideoState, seekTo } = useVideoPlayer();

  const currentLecture = lectures.find(l => l.id === currentLectureId) || lectures[0];

  const handleLectureSelect = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    updateVideoState({ currentTime: 0, isPlaying: false });
  };

  const handleLectureComplete = (lectureId: string) => {
    setLectures(prev => 
      prev.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, completed: true }
          : lecture
      )
    );

    const currentIndex = lectures.findIndex(l => l.id === lectureId);
    const nextLecture = lectures[currentIndex + 1];
    
    if (nextLecture) {
      setTimeout(() => {
        handleLectureSelect(nextLecture.id);
        updateVideoState({ isPlaying: true });
      }, 2000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          updateVideoState({ isPlaying: !videoState.isPlaying });
          break;
        case 'ArrowRight':
          seekTo(Math.min(videoState.currentTime + 10, videoState.duration));
          break;
        case 'ArrowLeft':
          seekTo(Math.max(videoState.currentTime - 10, 0));
          break;
        case 'ArrowUp':
          updateVideoState({ volume: Math.min(videoState.volume + 0.1, 1) });
          break;
        case 'ArrowDown':
          updateVideoState({ volume: Math.max(videoState.volume - 0.1, 0) });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [videoState, updateVideoState, seekTo]);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header courseTitle="Complete React Development Course" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          lectures={lectures}
          currentLectureId={currentLectureId}
          onLectureSelect={handleLectureSelect}
        />
        
        <div className="flex-1 flex flex-col">
          <MainContentArea
            lecture={currentLecture}
            videoState={videoState}
            onVideoStateChange={updateVideoState}
            onLectureComplete={handleLectureComplete}
          />
          
          <BottomControls
            videoState={videoState}
            onVideoStateChange={updateVideoState}
            onSeek={seekTo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;