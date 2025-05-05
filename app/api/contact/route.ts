import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/lib/models/form.model';
import { contactFormSchema } from '@/lib/validation/form';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the data using Zod
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Create and save the message
    const message = await ContactMessage.create(result.data);
    
    return NextResponse.json(
      { message: 'Message sent successfully!', data: message },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 