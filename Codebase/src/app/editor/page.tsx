'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas2D } from '@/components/editor/Canvas2D';
import { Canvas3D } from '@/components/editor/Canvas3D';
import { SaveDialog } from '@/components/editor/SaveDialog';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Save, 
  Undo, 
  RotateCcw,
  Download,
  LayoutGrid,
  Box,
  Menu
} from 'lucide-react';

function EditorContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    mode,
    setMode,
    room,
    furnitureItems,
    resetEditor,
    loadDesign,
    undo,
    canUndo,
    hasUnsavedChanges,
    currentDesignId,
    designName,
  } = useEditorStore();

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load design from URL params
  useEffect(() => {
    const designId = searchParams.get('design');
    const modeParam = searchParams.get('mode');
    
    if (modeParam === '3d') {
      setMode('3d');
    }

    if (designId && session?.user) {
      loadDesignFromId(designId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams, session]);

  const loadDesignFromId = async (id: string) => {
    try {
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) throw new Error('Failed to load design');
      
      const design = await response.json();
      loadDesign({
        id: design.id,
        name: design.name,
        roomWidth: design.roomWidth,
        roomLength: design.roomLength,
        roomHeight: design.roomHeight,
        roomShape: design.roomShape,
        wallColor: design.wallColor,
        floorColor: design.floorColor,
        furnitureItems: design.furnitureItems,
      });
      
      setMode(searchParams.get('mode') === '3d' ? '3d' : '2d');
    } catch (error) {
      console.error('Error loading design:', error);
      toast({
        title: 'Error',
        description: 'Failed to load design',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetEditor();
    setResetDialogOpen(false);
    toast({
      title: 'Reset',
      description: 'Editor has been reset',
    });
  };

  const handleExport = async () => {
    // For 2D mode, we can capture the canvas
    if (mode === '2d') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${designName || 'design'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: 'Exported',
          description: 'Design exported as image',
        });
      }
    } else {
      toast({
        title: 'Info',
        description: 'Switch to 2D mode to export as image',
      });
    }
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <Navigation showMenuButton onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex items-center justify-center bg-orange-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation showMenuButton onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Editor Header */}
      <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-gray-900 truncate max-w-[200px]">
              {designName}
            </h2>
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-500">Unsaved</span>
            )}
          </div>
          
          <Tabs value={mode} onValueChange={(v) => setMode(v as '2d' | '3d')}>
            <TabsList>
              <TabsTrigger value="2d" className="flex items-center gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                <LayoutGrid className="h-4 w-4" />
                2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                <Box className="h-4 w-4" />
                3D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
          >
            <Undo className="h-4 w-4 mr-1" />
            Undo
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Save className="h-4 w-4 mr-1" />
            {currentDesignId ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Canvas */}
        {mode === '2d' ? <Canvas2D /> : <Canvas3D />}

        {/* Properties Panel */}
        <div className="hidden lg:block">
          <PropertiesPanel />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-white border-t border-gray-200 px-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Room: {room.width}m × {room.length}m × {room.height}m</span>
          <span>Shape: {room.shape}</span>
          <span>Items: {furnitureItems.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Mode: {mode.toUpperCase()}</span>
        </div>
      </div>

      {/* Save Dialog */}
      <SaveDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} />

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Editor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset? All unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
