import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, COLLECTIONS } from '@/lib/db';
import { z } from 'zod';

const createDesignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  roomWidth: z.number().min(1).max(20),
  roomLength: z.number().min(1).max(20),
  roomHeight: z.number().min(1).max(5),
  roomShape: z.enum(['rectangle', 'square', 'l-shape']),
  wallColor: z.string(),
  floorColor: z.string(),
  furnitureItems: z.array(z.any()),
});

// GET - Fetch all designs for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const designsRef = db.collection(COLLECTIONS.DESIGNS);
    const snapshot = await designsRef
      .where('userId', '==', session.user.id)
      .orderBy('updatedAt', 'desc')
      .get();

    const designs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

// POST - Create a new design
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = createDesignSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    
    const data = result.data;

    const designsRef = db.collection(COLLECTIONS.DESIGNS);
    const designDoc = await designsRef.add({
      name: data.name,
      description: data.description || null,
      userId: session.user.id,
      roomWidth: data.roomWidth,
      roomLength: data.roomLength,
      roomHeight: data.roomHeight,
      roomShape: data.roomShape,
      wallColor: data.wallColor,
      floorColor: data.floorColor,
      furnitureItems: data.furnitureItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const design = {
      id: designDoc.id,
      name: data.name,
      description: data.description || null,
      userId: session.user.id,
      roomWidth: data.roomWidth,
      roomLength: data.roomLength,
      roomHeight: data.roomHeight,
      roomShape: data.roomShape,
      wallColor: data.wallColor,
      floorColor: data.floorColor,
      furnitureItems: data.furnitureItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json(
      { error: 'Failed to create design' },
      { status: 500 }
    );
  }
}
