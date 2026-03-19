import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/db';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;

    // Check if user already exists
    const usersRef = db.collection(COLLECTIONS.USERS);
    const existingUserSnapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (!existingUserSnapshot.empty) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);
    
    const userDoc = await usersRef.add({
      name,
      email,
      password: hashedPassword,
      role: 'designer',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      user: {
        id: userDoc.id,
        name,
        email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
