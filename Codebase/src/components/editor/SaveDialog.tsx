'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useEditorStore } from '@/store/editorStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveDialog({ open, onOpenChange }: SaveDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const {
    currentDesignId,
    designName,
    setDesignName,
    room,
    furnitureItems,
    setCurrentDesignId,
    setHasUnsavedChanges,
  } = useEditorStore();

  const [name, setName] = useState(designName);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save designs',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a design name',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const designData = {
        name: name.trim(),
        description: description.trim() || undefined,
        roomWidth: room.width,
        roomLength: room.length,
        roomHeight: room.height,
        roomShape: room.shape,
        wallColor: room.wallColor,
        floorColor: room.floorColor,
        furnitureItems,
      };

      let response;
      if (currentDesignId) {
        // Update existing design
        response = await fetch(`/api/designs/${currentDesignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(designData),
        });
      } else {
        // Create new design
        response = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(designData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save design');
      }

      const savedDesign = await response.json();
      
      setCurrentDesignId(savedDesign.id);
      setDesignName(name.trim());
      setHasUnsavedChanges(false);
      
      toast({
        title: 'Success',
        description: currentDesignId 
          ? 'Design updated successfully' 
          : 'Design saved successfully',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving design:', error);
      toast({
        title: 'Error',
        description: 'Failed to save design. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Design</DialogTitle>
          <DialogDescription>
            Save your room design to access it later
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Design Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Living Room Design"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your design..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : currentDesignId ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
