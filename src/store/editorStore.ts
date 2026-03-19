import { create } from 'zustand';
import { FurnitureItem, RoomSpec, RoomShape } from '@/types';

interface EditorStore {
  // Mode
  mode: '2d' | '3d';
  setMode: (mode: '2d' | '3d') => void;
  
  // Room
  room: RoomSpec;
  setRoom: (room: Partial<RoomSpec>) => void;
  
  // Furniture Items
  furnitureItems: FurnitureItem[];
  setFurnitureItems: (items: FurnitureItem[]) => void;
  addFurnitureItem: (item: FurnitureItem) => void;
  updateFurnitureItem: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurnitureItem: (id: string) => void;
  
  // Selection
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  getSelectedItem: () => FurnitureItem | null;
  
  // Grid
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  gridSize: number;
  
  // History for undo
  history: FurnitureItem[][];
  historyIndex: number;
  saveToHistory: () => void;
  undo: () => void;
  canUndo: () => boolean;
  
  // Current design
  currentDesignId: string | null;
  setCurrentDesignId: (id: string | null) => void;
  designName: string;
  setDesignName: (name: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (has: boolean) => void;
  
  // Reset
  resetEditor: () => void;
  loadDesign: (design: {
    id: string;
    name: string;
    roomWidth: number;
    roomLength: number;
    roomHeight: number;
    roomShape: RoomShape;
    wallColor: string;
    floorColor: string;
    furnitureItems: FurnitureItem[];
  }) => void;
}

const defaultRoom: RoomSpec = {
  width: 5,
  length: 5,
  height: 3,
  shape: 'rectangle',
  wallColor: '#F5F5F5',
  floorColor: '#C4A35A',
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Mode
  mode: '2d',
  setMode: (mode) => set({ mode }),
  
  // Room
  room: defaultRoom,
  setRoom: (room) => set((state) => ({
    room: { ...state.room, ...room },
    hasUnsavedChanges: true,
  })),
  
  // Furniture Items
  furnitureItems: [],
  setFurnitureItems: (items) => set({ furnitureItems: items }),
  addFurnitureItem: (item) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.furnitureItems]);
      return {
        furnitureItems: [...state.furnitureItems, item],
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hasUnsavedChanges: true,
      };
    });
  },
  updateFurnitureItem: (id, updates) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.furnitureItems]);
      return {
        furnitureItems: state.furnitureItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hasUnsavedChanges: true,
      };
    });
  },
  removeFurnitureItem: (id) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.furnitureItems]);
      return {
        furnitureItems: state.furnitureItems.filter((item) => item.id !== id),
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hasUnsavedChanges: true,
      };
    });
  },
  
  // Selection
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  getSelectedItem: () => {
    const state = get();
    return state.furnitureItems.find((item) => item.id === state.selectedItemId) || null;
  },
  
  // Grid
  showGrid: true,
  setShowGrid: (show) => set({ showGrid: show }),
  snapToGrid: false,
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  gridSize: 0.5,
  
  // History
  history: [[]],
  historyIndex: 0,
  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.furnitureItems]);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          furnitureItems: [...state.history[newIndex]],
          historyIndex: newIndex,
          hasUnsavedChanges: true,
        };
      }
      return state;
    });
  },
  canUndo: () => get().historyIndex > 0,
  
  // Current design
  currentDesignId: null,
  setCurrentDesignId: (id) => set({ currentDesignId: id }),
  designName: 'Untitled Design',
  setDesignName: (name) => set({ designName: name }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (has) => set({ hasUnsavedChanges: has }),
  
  // Reset
  resetEditor: () => set({
    mode: '2d',
    room: defaultRoom,
    furnitureItems: [],
    selectedItemId: null,
    history: [[]],
    historyIndex: 0,
    currentDesignId: null,
    designName: 'Untitled Design',
    hasUnsavedChanges: false,
  }),
  
  loadDesign: (design) => set({
    currentDesignId: design.id,
    designName: design.name,
    room: {
      width: design.roomWidth,
      length: design.roomLength,
      height: design.roomHeight,
      shape: design.roomShape,
      wallColor: design.wallColor,
      floorColor: design.floorColor,
    },
    furnitureItems: design.furnitureItems,
    selectedItemId: null,
    history: [design.furnitureItems],
    historyIndex: 0,
    hasUnsavedChanges: false,
  }),
}));
