import mongoose from 'mongoose';

const generatedContentSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['summary', 'blog', 'linkedin', 'twitter', 'notes', 'mcq'],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // shape varies by type — string for summary, structured object for blog/mcq
      required: true,
    },
  },
  { timestamps: true }
);

// One generated piece per type per video — regenerating replaces, not duplicates
generatedContentSchema.index({ video: 1, type: 1 }, { unique: true });

const GeneratedContent = mongoose.model('GeneratedContent', generatedContentSchema);

export default GeneratedContent;