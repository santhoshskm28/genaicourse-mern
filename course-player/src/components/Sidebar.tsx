import React from 'react';
import type { Lecture } from '../types';

interface SidebarProps {
  lectures: Lecture[];
  currentLectureId: string;
  onLectureSelect: (lectureId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lectures, currentLectureId, onLectureSelect }) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="w-80 bg-gray-100 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Course Content</h2>
        <div className="space-y-2">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentLectureId === lecture.id
                  ? 'bg-blue-100 border-l-4 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => onLectureSelect(lecture.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{lecture.title}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{formatDuration(lecture.duration)}</span>
                    {lecture.completed && (
                      <span className="ml-2 text-green-600">
                        <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;