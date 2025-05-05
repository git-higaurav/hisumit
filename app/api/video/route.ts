import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/lib/models/video.model';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_COUDINARY_API_SECRECT,
  });

const videoSchema = z.object({
  title: z.string().min(1).max(100),
  videoUrl: z.string().min(1),
  public_id: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = videoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { title, videoUrl, public_id } = result.data;
    console.log('Validated data:', { title, videoUrl, public_id });

    // Connect to database
    await connectDB();

    // Create and save the video
    const video = new Video({
      title,
      videoUrl,
      public_id
    });
 
    await video.save();

    return NextResponse.json(
      { message: 'Video created successfully', video },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get the video ID from the URL if provided
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // If ID is provided, fetch specific video
      const video = await Video.findById(id);
      
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(video);
    }
    
    // Otherwise fetch all videos sorted by creation date
    const videos = await Video.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
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
        { error: 'Video ID and public_id are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the video first to get its public_id
    const video = await Video.findById(id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    console.log('Video found:', video);
    console.log('Public ID:', video.public_id);
    // Delete the video from Cloudinary
    try {
        await cloudinary.uploader.destroy(video.public_id, {
            resource_type: 'video'
          });
      
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      return NextResponse.json(
        { error: 'Failed to delete video from storage' },
        { status: 500 }
      );
    }

    // Delete from database
    console.log('Deleting video from database:', id);
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      console.error('Video not found in database after Cloudinary deletion');
      return NextResponse.json(
        { error: 'Failed to delete video from database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in delete operation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}