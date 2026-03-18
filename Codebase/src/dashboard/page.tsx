'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  FolderOpen, 
  Clock, 
  ArrowRight,
  LayoutGrid,
  Box
} from 'lucide-react';

interface Design {
  id: string;
  name: string;
  description?: string;
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  roomShape: string;
  createdAt: string;
  updatedAt: string;
  furnitureItems: Array<{ id: string }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/designs');
      if (!response.ok) throw new Error('Failed to fetch designs');
      const data = await response.json();
      setDesigns(data.slice(0, 6)); // Show only recent 6 designs
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navigation />
        <main className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-orange-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-orange-200 rounded-lg"></div>
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name || 'Designer'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to create amazing room designs?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-2 border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Plus className="h-5 w-5" />
                  New Design
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Start creating a new room layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/editor">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20">
                    Create Design
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <FolderOpen className="h-5 w-5" />
                  Saved Designs
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage your designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/saved-designs">
                  <Button variant="outline" className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Box className="h-5 w-5" />
                  3D Visualization
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Explore designs in 3D view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/editor?mode=3d">
                  <Button variant="outline" className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50">
                    Open 3D Editor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Designs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Designs</h2>
              {designs.length > 0 && (
                <Link href="/saved-designs" className="text-orange-600 hover:text-orange-700 hover:underline text-sm font-medium">
                  View All →
                </Link>
              )}
            </div>

            {designs.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <LayoutGrid className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No designs yet</h3>
                  <p className="text-gray-500 mb-4">Create your first room design to get started</p>
                  <Link href="/editor">
                    <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Design
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {designs.map((design) => (
                  <Card key={design.id} className="hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group border-2">
                    <Link href={`/editor?design=${design.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg group-hover:text-orange-700 transition-colors">{design.name}</CardTitle>
                          <Badge variant="secondary" className="capitalize bg-orange-100 text-orange-700 border-orange-200">
                            {design.roomShape}
                          </Badge>
                        </div>
                        <CardDescription>
                          {design.roomWidth}m × {design.roomLength}m × {design.roomHeight}m
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <LayoutGrid className="h-4 w-4" />
                            {design.furnitureItems?.length || 0} items
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatDate(design.updatedAt)}
                      </CardFooter>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Box className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-gray-900">FurnitureViz</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} FurnitureViz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
