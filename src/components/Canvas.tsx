
import React, { useEffect, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';

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

interface CanvasProps {
  mediaItems: MediaItem[];
  selectedMedia: MediaItem | null;
  onSelectMedia: (media: MediaItem) => void;
  onUpdateMedia: (media: MediaItem) => void;
  currentTime: number;
  isPlaying: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  mediaItems,
  selectedMedia,
  onSelectMedia,
  onUpdateMedia,
  currentTime,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    // Handle video playback based on isPlaying state
    Object.values(videoRefs.current).forEach(videoEl => {
      if (isPlaying) {
        videoEl.play().catch(error => console.error("Error playing video:", error));
      } else {
        videoEl.pause();
      }
    });
  }, [isPlaying]);

  const handleDragStop = (media: MediaItem, e: any, data: { x: number, y: number }) => {
    onUpdateMedia({
      ...media,
      x: data.x,
      y: data.y
    });
  };

  const handleResize = (media: MediaItem, e: any, { size }: { size: { width: number, height: number } }) => {
    onUpdateMedia({
      ...media,
      width: size.width,
      height: size.height
    });
  };

  const isMediaVisible = (media: MediaItem) => {
    return currentTime >= media.startTime && currentTime <= media.endTime;
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden relative"
      style={{ minHeight: "400px" }}
    >
      {mediaItems.map((media) => {
        const isVisible = isMediaVisible(media);
        const isSelected = selectedMedia?.id === media.id;
        
        if (!isVisible && isPlaying) return null;
        
        return (
          <Draggable
            key={media.id}
            position={{ x: media.x, y: media.y }}
            onStop={(e, data) => handleDragStop(media, e, data)}
            bounds="parent"
          >
            <div>
              <ResizableBox
                width={media.width}
                height={media.height}
                onResize={(e, data) => handleResize(media, e, data)}
                resizeHandles={['se']}
                handle={
                  <div className={`absolute bottom-0 right-0 w-5 h-5 cursor-se-resize ${isSelected ? 'block' : 'hidden'}`}>
                    <svg viewBox="0 0 10 10" className="w-full h-full fill-current text-blue-500">
                      <polygon points="0,10 10,10 10,0" />
                    </svg>
                  </div>
                }
              >
                <div
                  className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => onSelectMedia(media)}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.src}
                      alt="User uploaded content"
                      className="w-full h-full object-contain"
                      draggable="false"
                    />
                  ) : (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[media.id] = el;
                      }}
                      src={media.src}
                      className="w-full h-full object-contain"
                      loop
                      muted
                      draggable="false"
                    />
                  )}
                </div>
              </ResizableBox>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default Canvas;
