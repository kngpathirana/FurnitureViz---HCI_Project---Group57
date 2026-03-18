'use client';

import { useState } from 'react';
import { furnitureTemplates, furnitureCategories } from '@/data/furniture';
import { FurnitureItem, FurnitureTemplate } from '@/types';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  GripVertical, 
  Sofa, 
  Table, 
  Armchair, 
  Bed, 
  Lamp,
  Package,
  Grid3X3,
  Magnet
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  chairs: <Armchair className="h-4 w-4" />,
  tables: <Table className="h-4 w-4" />,
  sofas: <Sofa className="h-4 w-4" />,
  cabinets: <Package className="h-4 w-4" />,
  storage: <Package className="h-4 w-4" />,
  beds: <Bed className="h-4 w-4" />,
  decor: <Lamp className="h-4 w-4" />,
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('chairs');
  const { addFurnitureItem, showGrid, setShowGrid, snapToGrid, setSnapToGrid, room, setRoom } = useEditorStore();
  
  const filteredTemplates = furnitureTemplates.filter(
    (t) => t.category === selectedCategory
  );

  const handleDragStart = (e: React.DragEvent, template: FurnitureTemplate) => {
    e.dataTransfer.setData('furnitureTemplate', JSON.stringify(template));
  };

  const handleAddFurniture = (template: FurnitureTemplate) => {
    const newItem: FurnitureItem = {
      id: uuidv4(),
      templateId: template.id,
      name: template.name,
      category: template.category,
      width: template.defaultWidth,
      depth: template.defaultDepth,
      height: template.defaultHeight,
      x: room.width / 2 - template.defaultWidth / 2,
      y: room.length / 2 - template.defaultDepth / 2,
      zPosition: template.defaultZPosition || 0.05,
      rotation: 0,
      color: template.defaultColor,
      material: template.material,
      modelFile: template.modelFile,
    };
    addFurnitureItem(newItem);
  };

  return (
    <aside 
      className={`fixed lg:relative z-40 w-72 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)] transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="font-semibold text-gray-900">Tools</h2>
      </div>

      <Tabs defaultValue="furniture" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-fit grid-cols-2 mx-4 mt-2 flex-shrink-0">
          <TabsTrigger value="furniture">Furniture</TabsTrigger>
          <TabsTrigger value="room">Room</TabsTrigger>
        </TabsList>

        <TabsContent value="furniture" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=active]:flex">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex gap-1 flex-wrap">
              {furnitureCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs h-8 border border-gray-200 ${selectedCategory === cat.id ? 'bg-orange-600 hover:bg-orange-700 border-orange-600' : ''}`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2 pb-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, template)}
                  onClick={() => handleAddFurniture(template)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-orange-50 cursor-pointer transition-colors group"
                >
                  <div className="p-2 bg-white rounded border border-gray-200 group-hover:border-orange-300">
                    {categoryIcons[template.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{template.name}</p>
                    <p className="text-xs text-gray-500">
                      {template.defaultWidth}m × {template.defaultDepth}m
                    </p>
                  </div>
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="room" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=active]:flex">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="roomWidth" className="text-sm font-medium">Width (m)</Label>
                <Input
                  id="roomWidth"
                  type="number"
                  min={2}
                  max={20}
                  step={0.5}
                  value={room.width}
                  onChange={(e) => setRoom({ width: parseFloat(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomLength" className="text-sm font-medium">Length (m)</Label>
                <Input
                  id="roomLength"
                  type="number"
                  min={2}
                  max={20}
                  step={0.5}
                  value={room.length}
                  onChange={(e) => setRoom({ length: parseFloat(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomHeight" className="text-sm font-medium">Height (m)</Label>
                <Input
                  id="roomHeight"
                  type="number"
                  min={2}
                  max={5}
                  step={0.1}
                  value={room.height}
                  onChange={(e) => setRoom({ height: parseFloat(e.target.value) || 3 })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Room Shape</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['rectangle', 'square', 'l-shape'].map((shape) => (
                    <Button
                      key={shape}
                      variant={room.shape === shape ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRoom({ shape: shape as 'rectangle' | 'square' | 'l-shape' })}
                      className={`text-xs capitalize ${room.shape === shape ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                    >
                      {shape}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Wall Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {['#FFFFFF', '#F5F5F5', '#E8E8E8', '#E6F3FF', '#FFF8DC', '#F0FFF0'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setRoom({ wallColor: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        room.wallColor === color ? 'border-orange-500 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Floor Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {['#C4A35A', '#8B4513', '#5D4037', '#D2B48C', '#9E9E9E', '#F5F5F5'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setRoom({ floorColor: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        room.floorColor === color ? 'border-orange-500 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-3 border-t border-gray-200 space-y-2 mb-22 bg-white">
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          className={`w-full justify-start ${showGrid ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          Toggle Grid
        </Button>
      </div>
    </aside>
  );
}
