import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    userId: {
      type: Number,
      required: true,
    },

    userType: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "likes",
  }
);

//prevented duplicate likes by same user on same post
likeSchema.index({ postId: 1, userId: 1, userType: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);
