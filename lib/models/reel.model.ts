import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [100, 'Title must be less than 100 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v: string) {
        return /\.(mp4|mov)$/i.test(v);
      },
      message: 'Only .mp4 and .mov formats are supported'
    }
  },
  public_id: {
    type: String,
    required: [true, 'Public ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Reel || mongoose.model('Reel', reelSchema); 