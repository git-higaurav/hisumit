import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video; 