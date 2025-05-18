import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/lib/models/project.model';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const link = formData.get('link') as string;

    if (!file || !title || !description || !category || !link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert File to ArrayBuffer and then to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // Create the proper Cloudinary upload formatted data
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', `data:${file.type};base64,${base64Data}`);
    cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');
    cloudinaryFormData.append('api_key', process.env.CLOUDINARY_API_KEY || '');

    // Use the correct Cloudinary upload URL
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );
        if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error('Failed to upload image to Cloudinary');
    }

    const uploadData = await uploadResponse.json();
    const imageUrl = uploadData.secure_url;

    // Save to MongoDB
    await connectToDatabase();
    const project = {
      title,
      description,
      category,
      link,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    const result = await Project.create(project);
    return NextResponse.json({ ...project, _id: result._id });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const result = await Project.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}