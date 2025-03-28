
import React from 'react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
}

interface TimelineProps {
  mediaItems: MediaItem[];
  currentTime: number;
  onSelectMedia: (media: MediaItem) => void;
  selectedMedia: MediaItem | null;
}

const Timeline: React.FC<TimelineProps> = ({
  mediaItems,
  currentTime,
  onSelectMedia,
  selectedMedia
}) => {
  const maxTime = Math.max(
    ...mediaItems.map(item => item.endTime),
    10 // Default min time
  );
  
  const getTimelineScale = () => {
    return 100 / maxTime; // percent per second
  };

  return (
    <div className="border border-gray-200 rounded bg-gray-50 p-2 h-full">
      <div className="relative h-full">
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-4 flex">
          {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute text-xs text-gray-500" 
              style={{ 
                left: `${i * getTimelineScale()}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {i}s
            </div>
          ))}
        </div>
        
        {/* Current time marker */}
        <div 
          className="absolute top-4 bottom-0 w-0.5 bg-red-500 z-30"
          style={{ 
            left: `${currentTime * getTimelineScale()}%`,
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Media items */}
        <div className="absolute top-6 bottom-0 left-0 right-0">
          {mediaItems.map((media, index) => {
            const startPercent = media.startTime * getTimelineScale();
            const widthPercent = (media.endTime - media.startTime) * getTimelineScale();
            
            return (
              <div 
                key={media.id}
                className={`
                  absolute h-6 rounded px-2 flex items-center text-xs text-white
                  ${selectedMedia?.id === media.id ? 'ring-2 ring-blue-500' : ''}
                  ${media.type === 'image' ? 'bg-green-500' : 'bg-purple-500'}
                  cursor-pointer
                `}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                  top: `${index * 8}px`
                }}
                onClick={() => onSelectMedia(media)}
              >
                {media.type === 'image' ? 'Image' : 'Video'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
