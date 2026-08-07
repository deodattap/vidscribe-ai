import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      unique: true, // one transcript per video
    },
    rawText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transcript = mongoose.model('Transcript', transcriptSchema);

export default Transcript;