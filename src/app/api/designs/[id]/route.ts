import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, COLLECTIONS } from '@/lib/db';
import { z } from 'zod';

const updateDesignSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  roomWidth: z.number().min(1).max(20).optional(),
  roomLength: z.number().min(1).max(20).optional(),
  roomHeight: z.number().min(1).max(5).optional(),
  roomShape: z.enum(['rectangle', 'square', 'l-shape']).optional(),
  wallColor: z.string().optional(),
  floorColor: z.string().optional(),
  furnitureItems: z.array(z.any()).optional(),
});

// GET - Fetch a single design
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const designDoc = await db.collection(COLLECTIONS.DESIGNS).doc(id).get();

    if (!designDoc.exists) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const designData = designDoc.data();
    const design = { id: designDoc.id, ...designData };

    // Verify ownership
    if (designData?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    );
  }
}

// PUT - Update a design
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateDesignSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    
    const data = result.data;

    // Verify ownership
    const designRef = db.collection(COLLECTIONS.DESIGNS).doc(id);
    const designDoc = await designRef.get();

    if (!designDoc.exists) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const existingDesign = designDoc.data();
    if (existingDesign?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    await designRef.update(updateData);

    const updatedDoc = await designRef.get();
    const design = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a design
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const designRef = db.collection(COLLECTIONS.DESIGNS).doc(id);
    const designDoc = await designRef.get();

    if (!designDoc.exists) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const existingDesign = designDoc.data();
    if (existingDesign?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    await designRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}
