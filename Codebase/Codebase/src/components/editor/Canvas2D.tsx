'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { FurnitureItem, FurnitureTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const PIXELS_PER_METER = 80;

// Get contrast color for text
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

interface DragState {
  isDragging: boolean;
  itemId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface ResizeState {
  isResizing: boolean;
  itemId: string | null;
  corner: string | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  const {
    room,
    furnitureItems,
    selectedItemId,
    setSelectedItemId,
    updateFurnitureItem,
    addFurnitureItem,
    showGrid,
    snapToGrid,
    gridSize,
  } = useEditorStore();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    itemId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    itemId: null,
    corner: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  // Calculate canvas dimensions based on room size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        const roomPixelWidth = room.width * PIXELS_PER_METER;
        const roomPixelHeight = room.length * PIXELS_PER_METER;
        
        const scale = Math.min(
          (containerWidth - 40) / roomPixelWidth,
          (containerHeight - 40) / roomPixelHeight,
          1
        );
        
        setCanvasSize({
          width: Math.max(roomPixelWidth * scale, 400),
          height: Math.max(roomPixelHeight * scale, 300),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [room.width, room.length]);

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = useCallback((worldX: number, worldY: number) => {
    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );
    return {
      x: worldX * PIXELS_PER_METER * scale,
      y: worldY * PIXELS_PER_METER * scale,
    };
  }, [canvasSize, room.width, room.length]);

  // Convert canvas coordinates to world coordinates
  const canvasToWorld = useCallback((canvasX: number, canvasY: number) => {
    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );
    return {
      x: canvasX / (PIXELS_PER_METER * scale),
      y: canvasY / (PIXELS_PER_METER * scale),
    };
  }, [canvasSize, room.width, room.length]);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );

    // Clear canvas
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      
      const gridPixels = gridSize * PIXELS_PER_METER * scale;
      
      for (let x = 0; x <= canvasSize.width; x += gridPixels) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvasSize.height; y += gridPixels) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    }

    // Draw room boundary
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw dimension labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${room.width}m`, canvasSize.width / 2, canvasSize.height + 20);
    ctx.save();
    ctx.translate(-15, canvasSize.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${room.length}m`, 0, 0);
    ctx.restore();

    // Draw furniture items
    furnitureItems.forEach((item) => {
      const pos = worldToCanvas(item.x, item.y);
      const width = item.width * PIXELS_PER_METER * scale;
      const depth = item.depth * PIXELS_PER_METER * scale;
      const isSelected = item.id === selectedItemId;

      ctx.save();
      ctx.translate(pos.x + width / 2, pos.y + depth / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);

      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(-width / 2 + 4, -depth / 2 + 4, width, depth);

      // Draw item
      ctx.fillStyle = item.color;
      ctx.strokeStyle = isSelected ? '#2563EB' : '#333';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.fillRect(-width / 2, -depth / 2, width, depth);
      ctx.strokeRect(-width / 2, -depth / 2, width, depth);

      // Draw item label
      ctx.fillStyle = getContrastColor(item.color);
      ctx.font = `${Math.min(12, width / 8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name.slice(0, 12), 0, 0);

      // Draw resize handles if selected
      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#2563EB';
        
        // Corner handles
        ctx.fillRect(-width / 2 - handleSize / 2, -depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(width / 2 - handleSize / 2, -depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(-width / 2 - handleSize / 2, depth / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(width / 2 - handleSize / 2, depth / 2 - handleSize / 2, handleSize, handleSize);
      }

      ctx.restore();

      // Draw dimension label
      if (isSelected) {
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${item.width.toFixed(1)}m × ${item.depth.toFixed(1)}m`,
          pos.x + width / 2,
          pos.y + depth + 15
        );
      }
    });
  }, [canvasSize, room, furnitureItems, selectedItemId, showGrid, gridSize, worldToCanvas]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Get item at position
  const getItemAtPosition = useCallback((canvasX: number, canvasY: number): FurnitureItem | null => {
    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );

    for (let i = furnitureItems.length - 1; i >= 0; i--) {
      const item = furnitureItems[i];
      const width = item.width * PIXELS_PER_METER * scale;
      const depth = item.depth * PIXELS_PER_METER * scale;
      
      // Rotate point around item center
      const centerX = item.x * PIXELS_PER_METER * scale + width / 2;
      const centerY = item.y * PIXELS_PER_METER * scale + depth / 2;
      
      const angle = -(item.rotation * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const dx = canvasX - centerX;
      const dy = canvasY - centerY;
      
      const rotatedX = dx * cos - dy * sin;
      const rotatedY = dx * sin + dy * cos;
      
      if (
        Math.abs(rotatedX) <= width / 2 &&
        Math.abs(rotatedY) <= depth / 2
      ) {
        return item;
      }
    }
    return null;
  }, [furnitureItems, canvasSize, room]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = getItemAtPosition(x, y);
    
    if (item) {
      setSelectedItemId(item.id);
      
      const scale = Math.min(
        canvasSize.width / (room.width * PIXELS_PER_METER),
        canvasSize.height / (room.length * PIXELS_PER_METER)
      );
      const itemCanvasX = item.x * PIXELS_PER_METER * scale;
      const itemCanvasY = item.y * PIXELS_PER_METER * scale;
      
      setDragState({
        isDragging: true,
        itemId: item.id,
        startX: x,
        startY: y,
        offsetX: x - itemCanvasX,
        offsetY: y - itemCanvasY,
      });
    } else {
      setSelectedItemId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.itemId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );

    let newX = (x - dragState.offsetX) / (PIXELS_PER_METER * scale);
    let newY = (y - dragState.offsetY) / (PIXELS_PER_METER * scale);

    // Snap to grid
    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    // Clamp to room bounds
    const item = furnitureItems.find((i) => i.id === dragState.itemId);
    if (item) {
      newX = Math.max(0, Math.min(room.width - item.width, newX));
      newY = Math.max(0, Math.min(room.length - item.depth, newY));
    }

    updateFurnitureItem(dragState.itemId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      itemId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    });
  };

  // Handle drop from sidebar
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const templateData = e.dataTransfer.getData('furnitureTemplate');
    if (!templateData) return;

    const template: FurnitureTemplate = JSON.parse(templateData);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = Math.min(
      canvasSize.width / (room.width * PIXELS_PER_METER),
      canvasSize.height / (room.length * PIXELS_PER_METER)
    );

    let worldX = x / (PIXELS_PER_METER * scale);
    let worldY = y / (PIXELS_PER_METER * scale);

    // Snap to grid
    if (snapToGrid) {
      worldX = Math.round(worldX / gridSize) * gridSize;
      worldY = Math.round(worldY / gridSize) * gridSize;
    }

    const newItem: FurnitureItem = {
      id: uuidv4(),
      templateId: template.id,
      name: template.name,
      category: template.category,
      width: template.defaultWidth,
      depth: template.defaultDepth,
      height: template.defaultHeight,
      x: Math.max(0, Math.min(room.width - template.defaultWidth, worldX - template.defaultWidth / 2)),
      y: Math.max(0, Math.min(room.length - template.defaultDepth, worldY - template.defaultDepth / 2)),
      zPosition: template.defaultZPosition || 0.05,
      rotation: 0,
      color: template.defaultColor,
      material: template.material,
      modelFile: template.modelFile,
    };

    addFurnitureItem(newItem);
    setSelectedItemId(newItem.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 flex items-center justify-center bg-gray-100 overflow-auto p-4"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-white shadow-lg cursor-crosshair"
        style={{ 
          border: '2px solid #ccc',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
}
