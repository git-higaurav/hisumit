import mongoose from 'mongoose';

const graphicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [100, 'Title must be less than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description must be less than 500 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: {
            validator: function(v: string) {
                return /\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: 'Only .jpg, .jpeg, .png, and .webp formats are supported'
        }
    },
    public_id: {
        type: String,
        required: [true, "Assets public id is required"],
        minlength: [1, "Public id cannot be empty"],
        trim: true // Remove any whitespace
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Graphic || mongoose.model('Graphic', graphicSchema);