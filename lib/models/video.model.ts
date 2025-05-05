import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  public_id: {
    type: String,
    required: [true, 'Public ID is required']
  }
}, {
  timestamps: true
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video; 