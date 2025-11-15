import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    source: { type: String, default: 'PubMed' },
  },
  { timestamps: true }
);

publicationSchema.index({ title: 'text', abstract: 'text' });

export default mongoose.model('Publication', publicationSchema);
