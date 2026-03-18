'use client';

import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Trash2, RotateCw, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';

export function PropertiesPanel() {
  const { 
    furnitureItems, 
    selectedItemId, 
    setSelectedItemId, 
    updateFurnitureItem, 
    removeFurnitureItem 
  } = useEditorStore();
  
  const selectedItem = furnitureItems.find((item) => item.id === selectedItemId);

  if (!selectedItem) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col h-[calc(100vh-4rem)]">
        <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm text-center">
          Select a furniture item to view and edit its properties
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: string | number) => {
    updateFurnitureItem(selectedItemId!, { [field]: value });
  };

  const handleDuplicate = () => {
    const newItem = {
      ...selectedItem,
      id: uuidv4(),
      x: selectedItem.x + 0.5,
      y: selectedItem.y + 0.5,
    };
    useEditorStore.getState().addFurnitureItem(newItem);
    setSelectedItemId(newItem.id);
  };

  const handleDelete = () => {
    removeFurnitureItem(selectedItemId!);
    setSelectedItemId(null);
  };

  const colorOptions = [
    '#8B4513', '#5D4037', '#A0522D', '#D2B48C', '#4A5568', 
    '#2F4F4F', '#8B0000', '#006400', '#00008B', '#C0C0C0'
  ];

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Properties</h3>
        <Button variant="ghost" size="sm" onClick={() => setSelectedItemId(null)}>
          ×
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4 pb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{selectedItem.name}</p>
            <p className="text-xs text-gray-500 capitalize">{selectedItem.category}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Dimensions</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Width</Label>
                <Input
                  type="number"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={selectedItem.width}
                  onChange={(e) => handleUpdate('width', parseFloat(e.target.value) || 0.5)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Depth</Label>
                <Input
                  type="number"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={selectedItem.depth}
                  onChange={(e) => handleUpdate('depth', parseFloat(e.target.value) || 0.5)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Height</Label>
                <Input
                  type="number"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={selectedItem.height}
                  onChange={(e) => handleUpdate('height', parseFloat(e.target.value) || 0.5)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Position</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">X Position</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={selectedItem.x.toFixed(2)}
                  onChange={(e) => handleUpdate('x', parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Y Position</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={selectedItem.y.toFixed(2)}
                  onChange={(e) => handleUpdate('y', parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Z Position</Label>
                <Input
                  type="number"
                  min={-1}
                  max={3}
                  step={0.05}
                  value={selectedItem.zPosition.toFixed(2)}
                  onChange={(e) => handleUpdate('zPosition', parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Rotation</h4>
              <span className="text-xs text-gray-500">{selectedItem.rotation}°</span>
            </div>
            <Slider
              value={[selectedItem.rotation]}
              min={0}
              max={360}
              step={15}
              onValueChange={([value]) => handleUpdate('rotation', value)}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleUpdate('rotation', (selectedItem.rotation + 90) % 360)}
              >
                <RotateCw className="h-3 w-3 mr-1" />
                90°
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleUpdate('rotation', (selectedItem.rotation + 45) % 360)}
              >
                45°
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Color</h4>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleUpdate('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedItem.color === color ? 'border-orange-500 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-gray-500">Custom</Label>
              <Input
                type="color"
                value={selectedItem.color}
                onChange={(e) => handleUpdate('color', e.target.value)}
                className="w-10 h-8 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={selectedItem.color}
                onChange={(e) => handleUpdate('color', e.target.value)}
                className="h-8 text-sm flex-1"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Material</h4>
            <div className="grid grid-cols-2 gap-2">
              {['wood', 'fabric', 'metal', 'glass', 'leather', 'ceramic'].map((material) => (
                <Button
                  key={material}
                  variant={selectedItem.material === material ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdate('material', material)}
                  className={`text-xs capitalize ${selectedItem.material === material ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                >
                  {material}
                </Button>
              ))}
            </div>
          </div>
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0 mb-22 bg-white">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleDuplicate}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Item
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Item
        </Button>
      </div>
    </div>
  );
}
