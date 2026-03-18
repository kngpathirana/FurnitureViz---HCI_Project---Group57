'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  LayoutGrid, 
  Clock,
  Trash2,
  Edit,
  Eye,
  Search,
  MoreVertical,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Design {
  id: string;
  name: string;
  description?: string;
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  roomShape: string;
  wallColor: string;
  floorColor: string;
  createdAt: string;
  updatedAt: string;
  furnitureItems: Array<{ id: string; name: string }>;
}

export default function SavedDesignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<Design | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDesigns();
    }
  }, [session]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDesigns(designs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDesigns(
        designs.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, designs]);

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/designs');
      if (!response.ok) throw new Error('Failed to fetch designs');
      const data = await response.json();
      setDesigns(data);
      setFilteredDesigns(data);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load designs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!designToDelete) return;

    try {
      const response = await fetch(`/api/designs/${designToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete design');

      setDesigns(designs.filter((d) => d.id !== designToDelete.id));
      toast({
        title: 'Success',
        description: 'Design deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting design:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete design',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDesignToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navigation />
        <main className="p-6">
          <div className="animate-pulse space-y-4 max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Designs</h1>
              <p className="text-gray-600">
                {designs.length} design{designs.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Link href="/editor">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Design
                </Button>
              </Link>
            </div>
          </div>

          {/* Designs Grid */}
          {filteredDesigns.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No matching designs</h3>
                    <p className="text-gray-500">Try adjusting your search query</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No saved designs</h3>
                    <p className="text-gray-500 mb-4">Create your first room design to get started</p>
                    <Link href="/editor">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Design
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDesigns.map((design) => (
                <Card key={design.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{design.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {design.roomWidth}m × {design.roomLength}m × {design.roomHeight}m
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/editor?design=${design.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/editor?design=${design.id}&mode=3d`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View in 3D
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDesignToDelete(design);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="capitalize bg-orange-100 text-orange-700 hover:bg-orange-200">
                        {design.roomShape}
                      </Badge>
                      <Badge variant="outline">
                        {design.furnitureItems?.length || 0} items
                      </Badge>
                    </div>
                    {design.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{design.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: design.wallColor }}
                        title="Wall Color"
                      />
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: design.floorColor }}
                        title="Floor Color"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(design.updatedAt)}
                    </span>
                    <Link href={`/editor?design=${design.id}`}>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        Open
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        FurnitureViz Professional © {new Date().getFullYear()}
      </footer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{designToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
