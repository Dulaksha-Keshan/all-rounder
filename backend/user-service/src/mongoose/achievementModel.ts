import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["local", "national", "international"],
      required: true,
    },
    dateAchieved: {
      type: Date,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    proofUrl: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

export const achievementModel = mongoose.model("Achievement", achievementSchema);
