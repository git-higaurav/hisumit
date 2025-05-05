import { NextResponse } from 'next/server';
import { imageFormSchema } from '@/lib/validation/image';
import connectDB from '@/lib/mongodb';
import Graphic from '@/models/Graphic';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate the request body
        const validationResult = imageFormSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { title, description, imageUrl , public_id} = validationResult.data;
        console.log(title, description, imageUrl , public_id)

        // Connect to database
        await connectDB();

        // Create and save the graphic
        const graphic = new Graphic({
            title,
            description,
            imageUrl,
            public_id: public_id // Explicitly map the public_id field
        });

        await graphic.save();

        return NextResponse.json(
            { 
                message: 'Graphic saved successfully',
                id: graphic._id 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving graphic:', error);
        return NextResponse.json(
            { error: 'Failed to save graphic' },
            { status: 500 }
        );
    }
} 

export async function GET() {
    try {
        await connectDB();
        const graphics = await Graphic.find().sort({ createdAt: -1 });
        return NextResponse.json(graphics);
    } catch (error) {
        console.error('Error fetching graphics:', error);
        return NextResponse.json(
            { error: 'Error fetching graphics' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        const public_id = url.searchParams.get('public_id');

        if (!id) {
            return NextResponse.json(
                { error: 'Graphic ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find the graphic first to get the imageUrl
        const graphic = await Graphic.findById(id);
        
        if (!graphic) {
            return NextResponse.json(
                { error: 'Graphic not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary using the utility function
        await deleteCloudinaryImage(String(public_id));

        // Delete from database
        await Graphic.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Graphic deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting graphic:', error);
        return NextResponse.json(
            { error: 'Failed to delete graphic' },
            { status: 500 }
        );
    }
}
