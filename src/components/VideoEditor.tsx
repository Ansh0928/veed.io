import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Clock, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Canvas from './Canvas';
import MediaControls from './MediaControls';
import Timeline from './Timeline';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';

const VideoEditor = () => {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaItems, setMediaItems] = useState<Array<MediaItem>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newMedia: MediaItem = {
        id: `media-${Date.now()}`,
        type,
        src: e.target?.result as string,
        x: 50,
        y: 50,
        width: 320,
        height: type === 'image' ? 240 : 180,
        startTime: 0,
        endTime: 10,
      };
      
      setMediaItems([...mediaItems, newMedia]);
      setSelectedMedia(newMedia);
      toast.success(`${type === 'image' ? 'Image' : 'Video'} added to canvas`);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSelectMedia = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const handleUpdateMedia = (updatedMedia: MediaItem) => {
    setMediaItems(mediaItems.map(item => 
      item.id === updatedMedia.id ? updatedMedia : item
    ));
    setSelectedMedia(updatedMedia);
  };

  const handleStartTimer = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        const maxEndTime = Math.max(...mediaItems.map(item => item.endTime), 10);
        
        if (newTime >= maxEndTime) {
          handleStopTimer();
          return 0;
        }
        
        return newTime;
      });
    }, 100);
  };

  const handleStopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleResetTimer = () => {
    handleStopTimer();
    setCurrentTime(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Nav */}
      <div className="flex items-center justify-between py-2 px-4 bg-editor-sidebar text-white">
        <div className="text-xl font-bold">Canvas Video Magic</div>
        <div className="flex space-x-2 items-center">
          <div className="flex items-center mr-4">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">{currentTime.toFixed(1)}s</span>
          </div>
          <Button 
            onClick={handleStartTimer} 
            variant="outline" 
            className="bg-green-600 text-white hover:bg-green-700 border-none"
            disabled={isPlaying}
          >
            <Play className="mr-1 h-4 w-4" />
            Start
          </Button>
          <Button 
            onClick={handleStopTimer} 
            variant="outline" 
            className="bg-red-600 text-white hover:bg-red-700 border-none"
            disabled={!isPlaying}
          >
            <Pause className="mr-1 h-4 w-4" />
            Stop
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-editor-sidebar text-white p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Add Media</h2>
            <div className="flex space-x-2">
              <label className="flex-1">
                <div className="flex items-center justify-center p-2 border border-dashed border-gray-500 rounded cursor-pointer hover:border-white transition-colors">
                  <Image className="mr-2 h-4 w-4" />
                  <span>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e, 'image')}
                  />
                </div>
              </label>
              <label className="flex-1">
                <div className="flex items-center justify-center p-2 border border-dashed border-gray-500 rounded cursor-pointer hover:border-white transition-colors">
                  <Video className="mr-2 h-4 w-4" />
                  <span>Add Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e, 'video')}
                  />
                </div>
              </label>
            </div>
          </div>

          <Separator className="bg-gray-700 my-4" />

          {selectedMedia ? (
            <MediaControls 
              media={selectedMedia} 
              onUpdate={handleUpdateMedia} 
            />
          ) : (
            <div className="text-center text-gray-400 mt-8">
              <p>Add and select media to edit properties</p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-editor-canvas">
          <div className="flex-1 flex items-center justify-center p-4">
            <Canvas 
              mediaItems={mediaItems} 
              selectedMedia={selectedMedia}
              onSelectMedia={handleSelectMedia}
              onUpdateMedia={handleUpdateMedia}
              currentTime={currentTime}
              isPlaying={isPlaying}
            />
          </div>
          
          {/* Timeline */}
          <div className="h-24 bg-white border-t border-gray-200 p-2">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium mr-2 text-editor-text">
                Current time: {currentTime.toFixed(1)}s
              </span>
            </div>
            <Timeline 
              mediaItems={mediaItems}
              currentTime={currentTime}
              onSelectMedia={handleSelectMedia}
              selectedMedia={selectedMedia}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
