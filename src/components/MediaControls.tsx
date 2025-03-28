
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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

interface MediaControlsProps {
  media: MediaItem;
  onUpdate: (media: MediaItem) => void;
}

const MediaControls: React.FC<MediaControlsProps> = ({ media, onUpdate }) => {
  const handleInputChange = (property: keyof MediaItem, value: string | number) => {
    onUpdate({
      ...media,
      [property]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-medium">{media.type === 'image' ? 'Image' : 'Video'} Properties</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="width" className="text-sm text-gray-300">Width (px)</Label>
          <Input
            id="width"
            type="number"
            value={media.width}
            onChange={(e) => handleInputChange('width', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-sm text-gray-300">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={media.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startTime" className="text-sm text-gray-300">Start Time (s)</Label>
          <Input
            id="startTime"
            type="number"
            min="0"
            step="0.1"
            value={media.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="endTime" className="text-sm text-gray-300">End Time (s)</Label>
          <Input
            id="endTime"
            type="number"
            min={media.startTime + 0.1}
            step="0.1"
            value={media.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="x" className="text-sm text-gray-300">X Position</Label>
          <Input
            id="x"
            type="number"
            value={media.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="y" className="text-sm text-gray-300">Y Position</Label>
          <Input
            id="y"
            type="number"
            value={media.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MediaControls;
