// Furniture Item Types
export interface FurnitureItem {
  id: string;
  templateId: string;
  name: string;
  category: string;
  width: number;
  depth: number;
  height: number;
  x: number;
  y: number;
  zPosition: number;
  rotation: number;
  color: string;
  material: string;
  modelFile?: string;
}

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: string;
  defaultWidth: number;
  defaultDepth: number;
  defaultHeight: number;
  defaultZPosition?: number;
  defaultColor: string;
  material: string;
  modelFile?: string;
  thumbnail?: string;
}

// Room Types
export type RoomShape = 'rectangle' | 'square' | 'l-shape';

export interface RoomSpec {
  width: number;
  length: number;
  height: number;
  shape: RoomShape;
  wallColor: string;
  floorColor: string;
}

// Design Types
export interface Design {
  id: string;
  name: string;
  description?: string;
  userId: string;
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  roomShape: RoomShape;
  wallColor: string;
  floorColor: string;
  furnitureItems: FurnitureItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Editor State Types
export interface EditorState {
  mode: '2d' | '3d';
  selectedItemId: string | null;
  furnitureItems: FurnitureItem[];
  room: RoomSpec;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  history: FurnitureItem[][];
  historyIndex: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}
