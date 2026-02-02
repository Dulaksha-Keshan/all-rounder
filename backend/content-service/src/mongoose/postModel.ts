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

    postType: {
      type: String,
      enum: ["announcement", "update", "general"],
      default: "general",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    attachments: [
      {
        type: String, 
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

export default mongoose.model("Post", postSchema);
