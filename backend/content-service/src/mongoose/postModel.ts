import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String, // e.g., "achievement", "participation", "competition", "project"
      required: true,
    },
    postType: {
      type: String,
      enum: ["achievement", "participation", "event", "project"], 
      default: "achievement",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    attachments: [
      {
        type: String, // URLs for images, certificates, or media
      },
    ],
    tags: [
      {
        type: String, // e.g., "science-fair", "math-competition"
      },
    ],
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true, // posts are always tied to a student
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    comments: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

export default mongoose.model("Post", postSchema);
