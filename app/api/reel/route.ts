import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reel from '@/lib/models/reel.model';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const reelSchema = z.object({
  title: z.string().min(1).max(100),
  videoUrl: z.string().min(1),
  public_id: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    
    // Validate request body
    const result = reelSchema.safeParse(body);
    if (!result.success) {
 
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { title, videoUrl, public_id } = result.data;
    

    // Connect to database
    await connectDB();

    // Create and save the reel
    const reel = new Reel({
      title,
      videoUrl,
      public_id:public_id
    });
 
    await reel.save();


    return NextResponse.json(
      { message: 'Reel created successfully', reel },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get the reel ID from the URL if provided
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // If ID is provided, fetch specific reel
      const reel = await Reel.findById(id);
      
      if (!reel) {
        return NextResponse.json(
          { error: 'Reel not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(reel);
    }
    
    // Otherwise fetch all reels sorted by creation date
    const reels = await Reel.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Validate request body
    const result = reelSchema.safeParse(updateData);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Update the reel
    const updatedReel = await Reel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReel) {
      return NextResponse.json(
        { error: 'Reel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Reel updated successfully', reel: updatedReel },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const public_id = url.searchParams.get('public_id');

    if (!id || !public_id) {
      return NextResponse.json(
        { error: 'Reel ID and public_id are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the reel from database
    const deletedReel = await Reel.findByIdAndDelete(id);

    if (!deletedReel) {
      return NextResponse.json(
        { error: 'Reel not found' },
        { status: 404 }
      );
    }

    // Delete the video from Cloudinary
    try {
      await cloudinary.uploader.destroy(public_id, {
        resource_type: 'video'
      });
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with the response even if Cloudinary deletion fails
      // The video might have been already deleted or the public_id might be invalid
    }

    return NextResponse.json(
      { message: 'Reel deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting reel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
