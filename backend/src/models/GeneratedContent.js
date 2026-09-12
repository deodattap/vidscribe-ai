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
    // Not a hardcoded enum on purpose: valid types live in
    // config/contentTypes.js and are validated there in the controller,
    // so adding a new content type never requires a model migration.
    type: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // shape varies by type — see config/contentTypes.js
      required: true,
    },
    // The generation parameters (word count, tone, audience, language,
    // custom instructions) used to produce this content — lets the UI
    // show what was used and re-apply the same params on regenerate.
    params: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// One generated piece per type per video — regenerating replaces, not duplicates
generatedContentSchema.index({ video: 1, type: 1 }, { unique: true });

const GeneratedContent = mongoose.model('GeneratedContent', generatedContentSchema);

export default GeneratedContent;
