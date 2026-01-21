export interface Lecture {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  totalDuration: number;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}