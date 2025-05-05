import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/lib/models/form.model';

export async function GET() {
  try {
    await connectDB();
    
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 