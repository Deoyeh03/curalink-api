import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

forumPostSchema.index({ title: 'text', content: 'text', tags: 1 });

export default mongoose.model('ForumPost', forumPostSchema);
